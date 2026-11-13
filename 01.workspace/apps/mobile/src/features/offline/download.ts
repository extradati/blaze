import { OfflineManager } from "@maplibre/maplibre-react-native";
import { File, Paths } from "expo-file-system";
import { MAP_STYLE } from "@/features/map/config";
import type { Track } from "@/features/track/types";
import { MAX_Z, MIN_Z, stripRects } from "./area";
import type { Progress } from "./types";

const TAG = { app: "blaze-track" };

/**
 * Downloads the map along the track as MapLibre offline packs (one per strip rectangle).
 * MapLibre pauses by itself while offline and resumes when the connection is back.
 */
export async function downloadTrackArea(track: Track, onProgress: Progress, signal: AbortSignal) {
  await clearTrackArea(); // restart cleanly; tiles already on the device are reused by MapLibre
  const style = new File(Paths.document, "offline-style.json");
  style.write(JSON.stringify(MAP_STYLE));
  const rects = stripRects(track);
  const pct = new Map<string, number>();
  await new Promise<void>((resolve, reject) => {
    signal.addEventListener("abort", () => resolve());
    const report = () => {
      const sum = [...pct.values()].reduce((a, b) => a + b, 0);
      onProgress(sum / rects.length / 100);
      if (pct.size === rects.length && sum >= rects.length * 100) resolve();
    };
    rects.forEach((bounds) => {
      OfflineManager.createPack(
        { mapStyle: style.uri, bounds, minZoom: MIN_Z, maxZoom: MAX_Z, metadata: TAG },
        (pack, s) => { pct.set(pack.id, s.state === "complete" ? 100 : s.percentage); report(); },
        (_, e) => reject(new Error(e.message)),
      ).catch(reject);
    });
  });
}

export async function clearTrackArea() {
  const packs = await OfflineManager.getPacks();
  await Promise.all(packs.filter((p) => p.metadata?.app === TAG.app).map((p) => OfflineManager.deletePack(p.id)));
}

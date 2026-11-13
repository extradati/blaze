import { useEffect, useState } from "react";
import { Platform } from "react-native";
import type { Track } from "@/features/track/types";
import { usePersistedState } from "@/lib/usePersistedState";
import { clearTrackArea, downloadTrackArea } from "./download";
import { OfflineDownloadPaused } from "./types";

export type OfflineMapState = { status: "saving"; progress: number } | { status: "paused" | "done" | "failed" };

const trackKey = (t: Track) => `${t.loadedAt ?? 0}|${t.distanceM}`;

/** Keeps the map along the loaded track saved on the device; removes it when the track is removed. */
export function useOfflineMap(track: Track | null, ready: boolean): OfflineMapState | null {
  const saved = usePersistedState<{ key: string; done: boolean }>("offline.map"); // track whose map is on the device
  const [state, setState] = useState<OfflineMapState | null>(null);
  const [retry, setRetry] = useState(0);
  const key = track ? trackKey(track) : null;

  useEffect(() => {
    if (!ready || !saved.ready) return;
    if (!track) {
      setState(null);
      if (saved.value) { saved.save(null); clearTrackArea().catch(() => {}); } // also drops a partial download
      return;
    }
    if (saved.value?.key === key && saved.value.done) return setState({ status: "done" });
    const ctrl = new AbortController();
    setState({ status: "saving", progress: 0 });
    (async () => {
      if (saved.value && saved.value.key !== key) await clearTrackArea(); // map of a previous track
      saved.save({ key: key!, done: false });
      await downloadTrackArea(track, (progress) => !ctrl.signal.aborted && setState({ status: "saving", progress }), ctrl.signal);
    })().then(
      () => { if (!ctrl.signal.aborted) { saved.save({ key: key!, done: true }); setState({ status: "done" }); } },
      (e) => { if (!ctrl.signal.aborted) setState({ status: e instanceof OfflineDownloadPaused ? "paused" : "failed" }); ctrl.abort(); },
    );
    return () => ctrl.abort();
  }, [ready, saved.ready, key, retry]);

  // Web: resume when the connection comes back.
  useEffect(() => {
    if (Platform.OS !== "web" || state?.status !== "paused") return;
    const again = () => setRetry((n) => n + 1);
    window.addEventListener("online", again);
    return () => window.removeEventListener("online", again);
  }, [state?.status]);

  return state;
}

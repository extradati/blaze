import type { Track } from "@/features/track/types";
import { stripTiles } from "./area";
import { OfflineDownloadPaused, type Progress } from "./types";

// Shared with public/sw.js, which serves tiles from this cache.
const CACHE = "tiles-v1";
const key = (z: number, x: number, y: number) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`;
const PARALLEL = 4;

/** Saves the map tiles along the track into Cache Storage. Already saved tiles are skipped, so it resumes. */
export async function downloadTrackArea(track: Track, onProgress: Progress, signal: AbortSignal) {
  if (typeof caches === "undefined") throw new Error("Cache Storage not available");
  navigator.storage?.persist?.().catch(() => {}); // ask the browser not to evict it
  const cache = await caches.open(CACHE);
  const tiles = stripTiles(track);
  let next = 0, done = 0;
  async function worker() {
    while (next < tiles.length) {
      if (signal.aborted) return;
      const { z, x, y } = tiles[next++];
      const url = key(z, x, y);
      if (!(await cache.match(url))) {
        const sub = "abc"[(x + y) % 3];
        let res: Response;
        try {
          res = await fetch(`https://${sub}.tile.opentopomap.org/${z}/${x}/${y}.png`, { signal });
        } catch {
          if (signal.aborted) return;
          throw new OfflineDownloadPaused();
        }
        if (res.ok) await cache.put(url, res);
      }
      onProgress(++done / tiles.length);
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, worker));
}

export async function clearTrackArea() {
  if (typeof caches !== "undefined") await caches.delete(CACHE);
}

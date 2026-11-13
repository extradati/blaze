import { distanceM } from "@/features/location/geo";
import type { LngLat } from "@/features/map/config";
import type { Bounds, Track } from "@/features/track/types";

export const STRIP_M = 1000; // map kept offline this far on each side of the track
export const MIN_Z = 10;
export const MAX_Z = 16;
const MAX_TILES = 6000; // ~150 MB; very long tracks get less detail
const STEP_M = 200; // sample spacing along the track

export type Tile = { z: number; x: number; y: number };

export function tileAt([lng, lat]: LngLat, z: number) {
  const n = 2 ** z, r = (lat * Math.PI) / 180;
  const clamp = (v: number) => Math.min(n - 1, Math.max(0, Math.floor(v)));
  return { x: clamp(((lng + 180) / 360) * n), y: clamp(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * n) };
}

/** Points every STEP_M along all segments. */
function samples(track: Track): LngLat[] {
  const out: LngLat[] = [];
  for (const seg of track.segments) {
    seg.forEach((b, i) => {
      if (i === 0) return void out.push(b);
      const a = seg[i - 1], n = Math.ceil(distanceM(a, b) / STEP_M);
      for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
    });
  }
  return out;
}

/** Box of ±STRIP_M around a point: [west, south, east, north]. */
function around([lng, lat]: LngLat): Bounds {
  const dLat = STRIP_M / 111_320, dLng = dLat / Math.cos((lat * Math.PI) / 180);
  return [lng - dLng, lat - dLat, lng + dLng, lat + dLat];
}

/** Map tiles covering a STRIP_M strip along the track, zoom MIN_Z..MAX_Z (lowered if too many). */
export function stripTiles(track: Track): Tile[] {
  const boxes = samples(track).map(around);
  for (let maxZ = MAX_Z; ; maxZ--) {
    const keys = new Set<string>();
    for (let z = MIN_Z; z <= maxZ; z++)
      for (const [w, s, e, n] of boxes) {
        const a = tileAt([w, n], z), b = tileAt([e, s], z);
        for (let x = a.x; x <= b.x; x++) for (let y = a.y; y <= b.y; y++) keys.add(`${z}/${x}/${y}`);
      }
    if (keys.size <= MAX_TILES || maxZ === MIN_Z)
      return [...keys].map((k) => { const [z, x, y] = k.split("/").map(Number); return { z, x, y }; });
  }
}

/** Rectangles covering the strip, one per ~CHUNK_M of track (for native offline packs). */
export function stripRects(track: Track, chunkM = 3000): Bounds[] {
  const pts = samples(track), per = Math.max(1, Math.round(chunkM / STEP_M)), rects: Bounds[] = [];
  for (let i = 0; i < pts.length; i += per) {
    const box = pts.slice(i, i + per + 1).map(around);
    rects.push([Math.min(...box.map((b) => b[0])), Math.min(...box.map((b) => b[1])), Math.max(...box.map((b) => b[2])), Math.max(...box.map((b) => b[3]))]);
  }
  return rects;
}

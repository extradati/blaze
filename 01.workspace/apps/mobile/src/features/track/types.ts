import type { LngLat } from "@/features/map/config";

export type Bounds = [west: number, south: number, east: number, north: number];
export type Waypoint = { name: string; coord: LngLat };
/** `loadedAt` (ms) is set when the user loads the file; missing on tracks saved before it existed. */
export type Track = { name: string | null; segments: LngLat[][]; waypoints: Waypoint[]; distanceM: number; bounds: Bounds; loadedAt?: number };

export class GpxError extends Error {
  constructor(readonly reason: "invalid" | "empty") {
    super(reason);
  }
}

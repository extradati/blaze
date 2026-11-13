import type { LngLat } from "@/features/map/config";

export type Bounds = [west: number, south: number, east: number, north: number];
export type Waypoint = { name: string; coord: LngLat };
export type Track = { name: string | null; segments: LngLat[][]; waypoints: Waypoint[]; distanceM: number; bounds: Bounds };

export class GpxError extends Error {
  constructor(readonly reason: "invalid" | "empty") {
    super(reason);
  }
}

import type { LngLat } from "@/features/map/config";
import type { UserPosition } from "./types";

const EARTH_RADIUS_M = 6_371_008.8;

/** Polygon ring approximating a circle of radiusM metres around center. */
export function circleRing([lng, lat]: LngLat, radiusM: number, steps = 64): LngLat[] {
  const dLat = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI);
  const dLng = dLat / Math.cos((lat * Math.PI) / 180);
  const ring = Array.from({ length: steps }, (_, i): LngLat => {
    const a = (2 * Math.PI * i) / steps;
    return [lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)];
  });
  return [...ring, ring[0]];
}

export function userLocationGeoJSON(pos: UserPosition | null): GeoJSON.FeatureCollection {
  if (!pos) return { type: "FeatureCollection", features: [] };
  return {
    type: "FeatureCollection",
    features: [
      { type: "Feature", properties: { kind: "accuracy" }, geometry: { type: "Polygon", coordinates: [circleRing(pos.center, pos.accuracy)] } },
      { type: "Feature", properties: { kind: "dot" }, geometry: { type: "Point", coordinates: pos.center } },
    ],
  };
}

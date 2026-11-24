import { expect, test } from "./test";
import { circleRing } from "../src/features/location/geo";

// Haversine distance in metres.
function dist([lng1, lat1]: number[], [lng2, lat2]: number[]) {
  const r = Math.PI / 180, a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 2 * 6_371_008.8 * Math.asin(Math.sqrt(a));
}

test("circleRing points lie at the given radius and close the ring", () => {
  const ring = circleRing([7.75, 46.02], 100);
  expect(ring[0]).toEqual(ring.at(-1));
  for (const p of ring) expect(Math.abs(dist([7.75, 46.02], p) - 100)).toBeLessThan(1);
});

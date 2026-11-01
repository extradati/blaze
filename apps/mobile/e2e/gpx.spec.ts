import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parseGpx, trackGeoJSON } from "../src/features/track/gpx";
import { GpxError } from "../src/features/track/types";

const fixture = (name: string) => readFileSync(`${__dirname}/fixtures/${name}`, "utf8");

test("parses tracks, waypoints, name, bounds and distance", () => {
  const t = parseGpx(fixture("sample.gpx"));
  expect(t.name).toBe("Rifugio Test Loop");
  expect(t.segments).toEqual([[[9.39, 45.92], [9.4, 45.93]], [[9.4, 45.93], [9.41, 45.94]]]); // invalid point dropped
  expect(t.waypoints.map((w) => w.name)).toEqual(["Rifugio", "Vetta"]);
  expect(t.bounds).toEqual([9.39, 45.92, 9.41, 45.94]);
  expect(t.distanceM).toBeGreaterThan(2600); // 2 legs of ~1.36 km
  expect(t.distanceM).toBeLessThan(2800);
});

test("parses routes (rte) as segments", () => {
  const t = parseGpx('<gpx><rte><name>R</name><rtept lat="1" lon="2"/><rtept lat="1.1" lon="2.1"/></rte></gpx>');
  expect(t.name).toBe("R");
  expect(t.segments).toEqual([[[2, 1], [2.1, 1.1]]]);
});

test("rejects non-GPX and GPX without track", () => {
  expect(() => parseGpx("hello")).toThrow(GpxError);
  expect(() => parseGpx("<html><body/></html>")).toThrow(expect.objectContaining({ reason: "invalid" }));
  expect(() => parseGpx(fixture("no-track.gpx"))).toThrow(expect.objectContaining({ reason: "empty" }));
});

test("geojson has line, waypoints, start and end", () => {
  const kinds = trackGeoJSON(parseGpx(fixture("sample.gpx"))).features.map((f) => f.properties!.kind);
  expect(kinds).toEqual(["line", "wpt", "wpt", "start", "end"]);
});

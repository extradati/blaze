import { XMLParser } from "fast-xml-parser";
import { distanceM } from "@/features/location/geo";
import type { LngLat } from "@/features/map/config";
import { type Bounds, GpxError, type Track, type Waypoint } from "./types";

const ARRAYS = new Set(["trk", "trkseg", "trkpt", "rte", "rtept", "wpt"]);
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  removeNSPrefix: true,
  parseAttributeValue: false,
  isArray: (name) => ARRAYS.has(name),
});

type Pt = { lat?: string; lon?: string; name?: unknown };

const coord = (p: Pt): LngLat | null => {
  const lng = Number(p.lon), lat = Number(p.lat);
  return Number.isFinite(lng) && Number.isFinite(lat) && p.lon !== undefined && p.lat !== undefined ? [lng, lat] : null;
};
const points = (pts: Pt[] = []) => pts.map(coord).filter((c): c is LngLat => c !== null);
const text = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v).trim() || null : null);

/** Parses GPX 1.0/1.1 text: tracks (trk/trkseg) and routes (rte) become segments; wpt become waypoints. */
export function parseGpx(xml: string): Track {
  let gpx: any;
  try {
    gpx = parser.parse(xml.replace(/^﻿/, "")).gpx;
  } catch {
    throw new GpxError("invalid");
  }
  if (!gpx || typeof gpx !== "object") throw new GpxError("invalid");

  const segments: LngLat[][] = [
    ...(gpx.trk ?? []).flatMap((t: any) => (t.trkseg ?? []).map((s: any) => points(s.trkpt))),
    ...(gpx.rte ?? []).map((r: any) => points(r.rtept)),
  ].filter((s) => s.length >= 2);
  if (!segments.length) throw new GpxError("empty");

  const waypoints: Waypoint[] = (gpx.wpt ?? []).flatMap((w: Pt) => {
    const c = coord(w);
    return c ? [{ name: text(w.name) ?? "", coord: c }] : [];
  });

  const all = segments.flat();
  const bounds: Bounds = [
    Math.min(...all.map((c) => c[0])), Math.min(...all.map((c) => c[1])),
    Math.max(...all.map((c) => c[0])), Math.max(...all.map((c) => c[1])),
  ];
  const distance = segments.reduce((sum, s) => sum + s.slice(1).reduce((d, c, i) => d + distanceM(s[i], c), 0), 0);
  const name = text(gpx.metadata?.name) ?? text(gpx.trk?.[0]?.name) ?? text(gpx.rte?.[0]?.name);

  return { name, segments, waypoints, distanceM: distance, bounds };
}

export function trackGeoJSON(track: Track | null): GeoJSON.FeatureCollection {
  if (!track) return { type: "FeatureCollection", features: [] };
  const first = track.segments[0], last = track.segments.at(-1)!;
  const point = (kind: string, c: LngLat): GeoJSON.Feature => ({ type: "Feature", properties: { kind }, geometry: { type: "Point", coordinates: c } });
  return {
    type: "FeatureCollection",
    features: [
      { type: "Feature", properties: { kind: "line" }, geometry: { type: "MultiLineString", coordinates: track.segments } },
      point("start", first[0]),
      point("end", last.at(-1)!),
    ],
  };
}

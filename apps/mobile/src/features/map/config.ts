
export type LngLat = [number, number];

// Swap tile provider here (e.g. MapTiler or self-hosted) without touching map components.
export const TILE_SOURCE = {
  tiles: ["a", "b", "c"].map((s) => `https://${s}.tile.opentopomap.org/{z}/{x}/{y}.png`),
  tileSize: 256,
  maxzoom: 17,
  attribution:
    'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Style © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
};

export const MAP_STYLE = {
  version: 8 as const,
  sources: { topo: { type: "raster" as const, ...TILE_SOURCE } },
  layers: [{ id: "topo", type: "raster" as const, source: "topo" }],
};

export const DEFAULT_VIEW = { center: [10.5, 46.3] as LngLat, zoom: 6 }; // Alps
export const USER_ZOOM = 13;
export const LOCATE_ZOOM = 15;

export const TRACK_PADDING = 60; // px around a track when fitting it on screen

export const USER_LOCATION_SOURCE = "user-location";
// Shared by web and native renderers.
export const USER_LOCATION_LAYERS = [
  { id: "user-accuracy", type: "fill" as const, filter: ["==", ["get", "kind"], "accuracy"] as any, paint: { "fill-color": "#1a73e8", "fill-opacity": 0.15 } },
  { id: "user-accuracy-edge", type: "line" as const, filter: ["==", ["get", "kind"], "accuracy"] as any, paint: { "line-color": "#1a73e8", "line-opacity": 0.4, "line-width": 1 } },
  { id: "user-dot", type: "circle" as const, filter: ["==", ["get", "kind"], "dot"] as any, paint: { "circle-radius": 7, "circle-color": "#1a73e8", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } },
];

const kind = (k: string) => ["==", ["get", "kind"], k] as any;
export const TRACK_COLOR = "#e6007e"; // magenta: stands out from OpenTopoMap's red trails and blue water
export const TRACK_SOURCE = "track";
// Order matters: later layers draw on top. Keep below USER_LOCATION_LAYERS.
export const TRACK_LAYERS = [
  { id: "track-casing", type: "line" as const, filter: kind("line"), layout: { "line-join": "round" as const, "line-cap": "round" as const }, paint: { "line-color": "#ffffff", "line-width": 8 } },
  { id: "track-line", type: "line" as const, filter: kind("line"), layout: { "line-join": "round" as const, "line-cap": "round" as const }, paint: { "line-color": TRACK_COLOR, "line-width": 4 } },
  { id: "track-start", type: "circle" as const, filter: kind("start"), paint: { "circle-radius": 7, "circle-color": "#2e7d32", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } },
  { id: "track-end", type: "circle" as const, filter: kind("end"), paint: { "circle-radius": 7, "circle-color": "#c62828", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } },
];

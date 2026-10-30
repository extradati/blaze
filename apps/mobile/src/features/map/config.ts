
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

export const USER_LOCATION_SOURCE = "user-location";
// Shared by web and native renderers.
export const USER_LOCATION_LAYERS = [
  { id: "user-accuracy", type: "fill" as const, filter: ["==", ["get", "kind"], "accuracy"] as any, paint: { "fill-color": "#1a73e8", "fill-opacity": 0.15 } },
  { id: "user-accuracy-edge", type: "line" as const, filter: ["==", ["get", "kind"], "accuracy"] as any, paint: { "line-color": "#1a73e8", "line-opacity": 0.4, "line-width": 1 } },
  { id: "user-dot", type: "circle" as const, filter: ["==", ["get", "kind"], "dot"] as any, paint: { "circle-radius": 7, "circle-color": "#1a73e8", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } },
];

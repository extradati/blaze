
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

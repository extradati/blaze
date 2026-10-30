import { type GeoJSONSource, Map as MlMap, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { userLocationGeoJSON } from "@/features/location/geo";
import { DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, USER_LOCATION_LAYERS, USER_LOCATION_SOURCE } from "./config";
import type { TrekMapProps } from "./types";

// Metro cannot bundle the worker; postinstall copies it to public/.
setWorkerUrl("/maplibre-gl-worker.mjs");

export function TrekMap({ focus, userPosition }: TrekMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const position = useRef(userPosition);
  position.current = userPosition;

  useEffect(() => {
    const m = new MlMap({ container: el.current!, style: MAP_STYLE, maxZoom: TILE_SOURCE.maxzoom, ...DEFAULT_VIEW });
    m.addControl(new NavigationControl());
    m.on("load", () => {
      m.addSource(USER_LOCATION_SOURCE, { type: "geojson", data: userLocationGeoJSON(position.current) });
      USER_LOCATION_LAYERS.forEach((l) => m.addLayer({ ...l, source: USER_LOCATION_SOURCE }));
    });
    map.current = m;
    return () => m.remove();
  }, []);

  useEffect(() => {
    if (focus) map.current?.flyTo(focus);
  }, [focus]);

  useEffect(() => {
    map.current?.getSource<GeoJSONSource>(USER_LOCATION_SOURCE)?.setData(userLocationGeoJSON(userPosition));
  }, [userPosition]);

  return (
    <div
      ref={el}
      data-testid="trek-map"
      data-user-location={userPosition?.center.join(",")}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

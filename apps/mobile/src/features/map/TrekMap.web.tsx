import { Map as MlMap, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, USER_ZOOM } from "./config";
import type { TrekMapProps } from "./types";

// Metro cannot bundle the worker; postinstall copies it to public/.
setWorkerUrl("/maplibre-gl-worker.mjs");

export function TrekMap({ center }: TrekMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);

  useEffect(() => {
    const m = new MlMap({ container: el.current!, style: MAP_STYLE, maxZoom: TILE_SOURCE.maxzoom, ...DEFAULT_VIEW });
    m.addControl(new NavigationControl());
    map.current = m;
    return () => m.remove();
  }, []);

  useEffect(() => {
    if (center) map.current?.flyTo({ center, zoom: USER_ZOOM });
  }, [center]);

  return <div ref={el} data-testid="trek-map" style={{ position: "absolute", inset: 0 }} />;
}

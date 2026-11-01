import { type GeoJSONSource, Map as MlMap, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { userLocationGeoJSON } from "@/features/location/geo";
import { trackGeoJSON } from "@/features/track/gpx";
import {
  DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, TRACK_LAYERS, TRACK_PADDING, TRACK_SOURCE, USER_LOCATION_LAYERS, USER_LOCATION_SOURCE,
} from "./config";
import type { TrekMapProps } from "./types";

// Metro cannot bundle the worker; postinstall copies it to public/ as .js (servers like nginx
// serve .mjs with a non-JS MIME type, which makes the browser refuse the worker).
setWorkerUrl("/maplibre-gl-worker.js");

export function TrekMap({ focus, userPosition, track }: TrekMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const latest = useRef({ userPosition, track });
  latest.current = { userPosition, track };

  useEffect(() => {
    const m = new MlMap({ container: el.current!, style: MAP_STYLE, maxZoom: TILE_SOURCE.maxzoom, ...DEFAULT_VIEW });
    m.addControl(new NavigationControl());
    m.on("load", () => {
      m.addSource(TRACK_SOURCE, { type: "geojson", data: trackGeoJSON(latest.current.track) });
      TRACK_LAYERS.forEach((l) => m.addLayer({ ...l, source: TRACK_SOURCE }));
      m.addSource(USER_LOCATION_SOURCE, { type: "geojson", data: userLocationGeoJSON(latest.current.userPosition) });
      USER_LOCATION_LAYERS.forEach((l) => m.addLayer({ ...l, source: USER_LOCATION_SOURCE }));
    });
    map.current = m;
    return () => m.remove();
  }, []);

  useEffect(() => {
    if (!focus) return;
    if ("bounds" in focus) map.current?.fitBounds(focus.bounds, { padding: TRACK_PADDING });
    else map.current?.flyTo(focus);
  }, [focus]);

  useEffect(() => {
    map.current?.getSource<GeoJSONSource>(USER_LOCATION_SOURCE)?.setData(userLocationGeoJSON(userPosition));
  }, [userPosition]);

  useEffect(() => {
    map.current?.getSource<GeoJSONSource>(TRACK_SOURCE)?.setData(trackGeoJSON(track));
  }, [track]);

  return (
    <div
      ref={el}
      data-testid="trek-map"
      data-user-location={userPosition?.center.join(",")}
      data-track-points={track?.segments.reduce((n, s) => n + s.length, 0)}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

import { Asset } from "expo-asset";
import { type GeoJSONSource, Map as MlMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { userLocationGeoJSON } from "@/features/location/geo";
import { trackEnds, trackGeoJSON } from "@/features/track/gpx";
import { TrackFlag } from "@/features/track/TrackFlag";
import {
  DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, TRACK_ARROW_IMAGE, TRACK_LAYERS, TRACK_PADDING, TRACK_SOURCE, USER_LOCATION_LAYERS, USER_LOCATION_SOURCE,
} from "./config";
import type { TrekMapProps } from "./types";

// Metro cannot bundle the worker; postinstall (scripts/copy-maplibre-worker.mjs) copies it to public/ as .js (servers like nginx
// serve .mjs with a non-JS MIME type, which makes the browser refuse the worker).
setWorkerUrl("/maplibre-gl-worker.js");

const ARROW_URL = Asset.fromModule(require("../../../assets/map/track-arrow.png")).uri;
const FLAGS = ["start", "finish"] as const;

export function TrekMap({ focus, userPosition, track }: TrekMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const latest = useRef({ userPosition, track });
  latest.current = { userPosition, track };
  // Flags are React views rendered into MapLibre marker elements via portals.
  const flagEls = useMemo(() => ({ start: document.createElement("div"), finish: document.createElement("div") }), []);
  const markers = useMemo(() => ({
    start: new Marker({ element: flagEls.start, anchor: "bottom" }),
    finish: new Marker({ element: flagEls.finish, anchor: "bottom" }),
  }), [flagEls]);

  useEffect(() => {
    const m = new MlMap({ container: el.current!, style: MAP_STYLE, maxZoom: TILE_SOURCE.maxzoom, ...DEFAULT_VIEW });
    m.addControl(new NavigationControl());
    // Without a listener MapLibre console.errors every failed tile (red LogBox in dev). Broken tiles are
    // expected (OpenTopoMap serves a few cached HTML pages as images); MapLibre keeps the lower-zoom tile there.
    m.on("error", (e) => {
      if ((e as { sourceId?: string }).sourceId !== "topo") console.warn("Map error", e.error);
    });
    m.on("load", async () => {
      m.addImage(TRACK_ARROW_IMAGE, (await m.loadImage(ARROW_URL)).data);
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
    const ends = track && trackEnds(track);
    for (const k of FLAGS) {
      if (ends) markers[k].setLngLat(ends[k]).addTo(map.current!);
      else markers[k].remove();
    }
  }, [track, markers]);

  return (
    <>
      {track && FLAGS.map((k) => createPortal(<TrackFlag kind={k} />, flagEls[k], k))}
      <div
        ref={el}
        data-testid="trek-map"
        data-user-location={userPosition?.center.join(",")}
        data-track-points={track?.segments.reduce((n, s) => n + s.length, 0)}
        style={{ position: "absolute", inset: 0 }}
      />
    </>
  );
}

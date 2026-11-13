import { Asset } from "expo-asset";
import { type GeoJSONSource, Map as MlMap, Marker, NavigationControl, type PointLike, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { userLocationGeoJSON } from "@/features/location/geo";
import { PositionAge } from "@/features/location/PositionAge";
import { trackEnds, trackGeoJSON } from "@/features/track/gpx";
import { TrackFlag } from "@/features/track/TrackFlag";
import {
  DEFAULT_VIEW, type LngLat, MAP_STYLE, TILE_SOURCE, TRACK_ARROW_IMAGE, TRACK_LAYERS, TRACK_PADDING, TRACK_SOURCE, USER_LOCATION_LAYERS,
  USER_LOCATION_SOURCE,
} from "./config";
import type { TrekMapProps } from "./types";

// Metro cannot bundle the worker; postinstall (scripts/copy-maplibre-worker.mjs) copies it to public/ as .js (servers like nginx
// serve .mjs with a non-JS MIME type, which makes the browser refuse the worker).
setWorkerUrl("/maplibre-gl-worker.js");

const ARROW_URL = Asset.fromModule(require("../../../assets/map/track-arrow.png")).uri;

type MarkerProps = { map: MlMap; lngLat: LngLat; anchor: "top" | "bottom"; offset?: PointLike; children: ReactNode };

/** React view pinned to a map coordinate (a MapLibre marker whose element is filled through a portal). */
function MapMarker({ map, lngLat, anchor, offset, children }: MarkerProps) {
  const el = useMemo(() => document.createElement("div"), []);
  const marker = useMemo(() => new Marker({ element: el, anchor, offset }), [el, anchor, offset]);
  const [lng, lat] = lngLat;
  useEffect(() => {
    marker.setLngLat([lng, lat]).addTo(map);
    return () => void marker.remove();
  }, [map, marker]); // add once per map; position kept in sync below
  useEffect(() => void marker.setLngLat([lng, lat]), [marker, lng, lat]);
  return createPortal(children, el);
}

const AGE_OFFSET: PointLike = [0, 10];

export function TrekMap({ focus, userPosition, positionStale, track }: TrekMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MlMap | null>(null);
  const latest = useRef({ userPosition, positionStale, track });
  latest.current = { userPosition, positionStale, track };
  const ends = track && trackEnds(track);

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
      const { userPosition, positionStale, track } = latest.current;
      m.addSource(TRACK_SOURCE, { type: "geojson", data: trackGeoJSON(track) });
      TRACK_LAYERS.forEach((l) => m.addLayer({ ...l, source: TRACK_SOURCE }));
      m.addSource(USER_LOCATION_SOURCE, { type: "geojson", data: userLocationGeoJSON(userPosition, positionStale) });
      USER_LOCATION_LAYERS.forEach((l) => m.addLayer({ ...l, source: USER_LOCATION_SOURCE }));
    });
    setMap(m);
    return () => m.remove();
  }, []);

  useEffect(() => {
    if (!focus || !map) return;
    if ("bounds" in focus) map.fitBounds(focus.bounds, { padding: TRACK_PADDING });
    else map.flyTo(focus);
  }, [focus, map]);

  useEffect(() => {
    map?.getSource<GeoJSONSource>(USER_LOCATION_SOURCE)?.setData(userLocationGeoJSON(userPosition, positionStale));
  }, [userPosition, positionStale, map]);

  useEffect(() => {
    map?.getSource<GeoJSONSource>(TRACK_SOURCE)?.setData(trackGeoJSON(track));
  }, [track, map]);

  return (
    <>
      {map && ends && (
        <>
          <MapMarker map={map} lngLat={ends.start} anchor="bottom"><TrackFlag kind="start" /></MapMarker>
          <MapMarker map={map} lngLat={ends.finish} anchor="bottom"><TrackFlag kind="finish" /></MapMarker>
        </>
      )}
      {map && userPosition && positionStale && (
        <MapMarker map={map} lngLat={userPosition.center} anchor="top" offset={AGE_OFFSET}>
          <PositionAge time={userPosition.time} />
        </MapMarker>
      )}
      <div
        ref={el}
        data-testid="trek-map"
        data-user-location={userPosition?.center.join(",")}
        data-user-location-stale={positionStale ? "true" : undefined}
        data-track-points={track?.segments.reduce((n, s) => n + s.length, 0)}
        style={{ position: "absolute", inset: 0 }}
      />
    </>
  );
}

import { Camera, type CameraRef, GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { userLocationGeoJSON } from "@/features/location/geo";
import { trackGeoJSON } from "@/features/track/gpx";
import {
  DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, TRACK_LAYERS, TRACK_PADDING, TRACK_SOURCE, USER_LOCATION_LAYERS, USER_LOCATION_SOURCE,
} from "./config";
import type { TrekMapProps } from "./types";

const PAD = { top: TRACK_PADDING, right: TRACK_PADDING, bottom: TRACK_PADDING, left: TRACK_PADDING };

export function TrekMap({ focus, userPosition, track }: TrekMapProps) {
  const camera = useRef<CameraRef>(null);
  const trackData = useMemo(() => trackGeoJSON(track), [track]);

  useEffect(() => {
    if (!focus) return;
    if ("bounds" in focus) camera.current?.fitBounds(focus.bounds, { padding: PAD, duration: 1000 });
    else camera.current?.flyTo({ ...focus, duration: 1000 });
  }, [focus]);

  return (
    <Map style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE} logo={false} attribution testID="trek-map">
      <Camera ref={camera} initialViewState={DEFAULT_VIEW} maxZoom={TILE_SOURCE.maxzoom} />
      <GeoJSONSource id={TRACK_SOURCE} data={trackData}>
        {TRACK_LAYERS.map((l) => <Layer key={l.id} {...l} />)}
      </GeoJSONSource>
      <GeoJSONSource id={USER_LOCATION_SOURCE} data={userLocationGeoJSON(userPosition)}>
        {USER_LOCATION_LAYERS.map((l) => <Layer key={l.id} {...l} />)}
      </GeoJSONSource>
    </Map>
  );
}

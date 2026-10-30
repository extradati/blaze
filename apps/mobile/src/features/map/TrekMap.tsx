import { Camera, type CameraRef, GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { userLocationGeoJSON } from "@/features/location/geo";
import { DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, USER_LOCATION_LAYERS, USER_LOCATION_SOURCE } from "./config";
import type { TrekMapProps } from "./types";

export function TrekMap({ focus, userPosition }: TrekMapProps) {
  const camera = useRef<CameraRef>(null);

  useEffect(() => {
    if (focus) camera.current?.flyTo({ ...focus, duration: 1000 });
  }, [focus]);

  return (
    <Map style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE} logo={false} attribution testID="trek-map">
      <Camera ref={camera} initialViewState={DEFAULT_VIEW} maxZoom={TILE_SOURCE.maxzoom} />
      <GeoJSONSource id={USER_LOCATION_SOURCE} data={userLocationGeoJSON(userPosition)}>
        {USER_LOCATION_LAYERS.map((l) => <Layer key={l.id} {...l} />)}
      </GeoJSONSource>
    </Map>
  );
}

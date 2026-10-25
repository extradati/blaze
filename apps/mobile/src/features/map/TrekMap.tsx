import { Camera, Map } from "@maplibre/maplibre-react-native";
import { StyleSheet } from "react-native";
import { DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, USER_ZOOM } from "./config";
import type { TrekMapProps } from "./types";

export function TrekMap({ center }: TrekMapProps) {
  return (
    <Map style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE} logo={false} attribution testID="trek-map">
      <Camera
        initialViewState={DEFAULT_VIEW}
        maxZoom={TILE_SOURCE.maxzoom}
        {...(center ? { center, zoom: USER_ZOOM, duration: 1000, easing: "fly" as const } : {})}
      />
    </Map>
  );
}

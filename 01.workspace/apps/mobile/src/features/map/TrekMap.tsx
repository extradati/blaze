import { Camera, type CameraRef, GeoJSONSource, Images, Layer, Map, Marker } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { userLocationGeoJSON } from "@/features/location/geo";
import { PositionAge } from "@/features/location/PositionAge";
import { trackEnds, trackGeoJSON } from "@/features/track/gpx";
import { TrackFlag } from "@/features/track/TrackFlag";
import {
  DEFAULT_VIEW, MAP_STYLE, TILE_SOURCE, TRACK_ARROW_IMAGE, TRACK_LAYERS, TRACK_PADDING, TRACK_SOURCE, USER_LOCATION_LAYERS, USER_LOCATION_SOURCE,
} from "./config";
import type { TrekMapProps } from "./types";

const PAD = { top: TRACK_PADDING, right: TRACK_PADDING, bottom: TRACK_PADDING, left: TRACK_PADDING };
const IMAGES = { [TRACK_ARROW_IMAGE]: require("../../../assets/map/track-arrow.png") };

export function TrekMap({ focus, userPosition, positionStale, track }: TrekMapProps) {
  const camera = useRef<CameraRef>(null);
  const trackData = useMemo(() => trackGeoJSON(track), [track]);
  const ends = track && trackEnds(track);

  useEffect(() => {
    if (!focus) return;
    if ("bounds" in focus) camera.current?.fitBounds(focus.bounds, { padding: PAD, duration: 1000 });
    else camera.current?.flyTo({ ...focus, duration: 1000 });
  }, [focus]);

  return (
    <Map style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE} logo={false} attribution testID="trek-map">
      <Camera ref={camera} initialViewState={DEFAULT_VIEW} maxZoom={TILE_SOURCE.maxzoom} />
      <Images images={IMAGES} />
      <GeoJSONSource id={TRACK_SOURCE} data={trackData}>
        {TRACK_LAYERS.map((l) => <Layer key={l.id} {...l} />)}
      </GeoJSONSource>
      <GeoJSONSource id={USER_LOCATION_SOURCE} data={userLocationGeoJSON(userPosition, positionStale)}>
        {USER_LOCATION_LAYERS.map((l) => <Layer key={l.id} {...l} />)}
      </GeoJSONSource>
      {userPosition && positionStale && (
        <Marker id="position-age" lngLat={userPosition.center} anchor="top" offset={[0, 10]}>
          <PositionAge time={userPosition.time} />
        </Marker>
      )}
      {ends && (
        <Marker id="track-start" lngLat={ends.start} anchor="bottom">
          <TrackFlag kind="start" />
        </Marker>
      )}
      {ends && (
        <Marker id="track-finish" lngLat={ends.finish} anchor="bottom">
          <TrackFlag kind="finish" />
        </Marker>
      )}
    </Map>
  );
}

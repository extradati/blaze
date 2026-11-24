import type { UserPosition } from "./types";

/** Keeps GPS on and reports each new fix (like a navigation app). Returns a stop function. Errors are ignored: the last fix stays shown. */
export function watchLocation(onFix: (p: UserPosition) => void): () => void {
  const id = navigator.geolocation.watchPosition(
    ({ coords, timestamp }) => onFix({ center: [coords.longitude, coords.latitude], accuracy: coords.accuracy, time: timestamp }),
    () => {},
    { enableHighAccuracy: true, maximumAge: 0 },
  );
  return () => navigator.geolocation.clearWatch(id);
}

import * as Location from "expo-location";
import type { UserPosition } from "./types";

/** Keeps GPS on and reports each new fix (like a navigation app). Returns a stop function. Errors are ignored: the last fix stays shown. */
export function watchLocation(onFix: (p: UserPosition) => void): () => void {
  let stopped = false;
  let sub: Location.LocationSubscription | null = null;
  Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 }, ({ coords, timestamp }) =>
    onFix({ center: [coords.longitude, coords.latitude], accuracy: coords.accuracy ?? 0, time: timestamp }),
  ).then((s) => (stopped ? s.remove() : (sub = s)), () => {});
  return () => {
    stopped = true;
    sub?.remove();
  };
}

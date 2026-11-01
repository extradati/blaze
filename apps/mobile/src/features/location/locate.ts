import * as Location from "expo-location";
import { LocationDeniedError, LocationUnavailableError, type UserPosition } from "./types";

/** One-time GPS fix. For live tracking, switch to Location.watchPositionAsync. */
export async function locate(): Promise<UserPosition> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new LocationDeniedError("Location permission denied");
  const pos =
    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }).catch(() => null)) ??
    (await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 }));
  if (!pos) throw new LocationUnavailableError("No position available");
  return { center: [pos.coords.longitude, pos.coords.latitude], accuracy: pos.coords.accuracy ?? 0 };
}

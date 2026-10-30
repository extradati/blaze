import * as Location from "expo-location";
import { LocationDeniedError, type UserPosition } from "./types";

/** One-time GPS fix. For live tracking, switch to Location.watchPositionAsync. */
export async function locate(): Promise<UserPosition> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new LocationDeniedError("Location permission denied");
  const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { center: [coords.longitude, coords.latitude], accuracy: coords.accuracy ?? 0 };
}

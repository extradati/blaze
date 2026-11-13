import * as Location from "expo-location";
import { preferPrecise } from "./preferPrecise";
import { LocationDeniedError, LocationTimeoutError, LocationUnavailableError, type UserPosition } from "./types";

const toPosition = ({ coords }: Location.LocationObject): UserPosition => ({
  center: [coords.longitude, coords.latitude],
  accuracy: coords.accuracy ?? 0,
});

/** One-time GPS fix. For live tracking, switch to Location.watchPositionAsync. */
export async function locate(): Promise<UserPosition> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new LocationDeniedError("Location permission denied");
  const precise = Promise.race([
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }).then(toPosition),
    new Promise<never>((_, reject) => setTimeout(() => reject(new LocationTimeoutError("Timed out")), 15_000)),
  ]);
  const recent = Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 }).then((p) => {
    if (!p) throw new LocationUnavailableError("No recent position");
    return toPosition(p);
  });
  return preferPrecise(precise, recent);
}

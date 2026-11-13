import { preferPrecise } from "./preferPrecise";
import { LocationDeniedError, LocationTimeoutError, LocationUnavailableError, type UserPosition } from "./types";

function fix(options: PositionOptions): Promise<UserPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ center: [coords.longitude, coords.latitude], accuracy: coords.accuracy }),
      (e) =>
        reject(
          e.code === e.PERMISSION_DENIED ? new LocationDeniedError(e.message)
          : e.code === e.TIMEOUT ? new LocationTimeoutError(e.message)
          : new LocationUnavailableError(e.message),
        ),
      options,
    ),
  );
}

// expo-location on web reuses a cached fix (maximumAge: Infinity), so query the browser directly.
// Precise and coarse/recent requests run in parallel (e.g. a Mac without Wi-Fi only gets coarse).
export function locate(): Promise<UserPosition> {
  return preferPrecise(
    fix({ enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 }),
    fix({ enableHighAccuracy: false, maximumAge: 5 * 60_000, timeout: 15_000 }),
  );
}

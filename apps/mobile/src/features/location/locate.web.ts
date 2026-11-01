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
// Fresh precise fix first; if the device can't provide one (e.g. Mac without Wi-Fi), accept a coarse/recent one.
export async function locate(): Promise<UserPosition> {
  try {
    return await fix({ enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 });
  } catch (e) {
    if (e instanceof LocationDeniedError) throw e;
    return fix({ enableHighAccuracy: false, maximumAge: 5 * 60_000, timeout: 15_000 });
  }
}

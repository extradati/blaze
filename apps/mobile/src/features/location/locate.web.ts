import { LocationDeniedError, type UserPosition } from "./types";

// expo-location on web reuses a cached fix (maximumAge: Infinity), so query the browser directly.
export function locate(): Promise<UserPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ center: [coords.longitude, coords.latitude], accuracy: coords.accuracy }),
      (e) => reject(e.code === e.PERMISSION_DENIED ? new LocationDeniedError(e.message) : new Error(e.message)),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 },
    ),
  );
}

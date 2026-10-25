import * as Location from "expo-location";
import { useEffect, useState } from "react";
import type { LngLat } from "./config";

/** User position once known; null while unknown or permission denied. */
export function useUserCenter(): LngLat | null {
  const [center, setCenter] = useState<LngLat | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const last = await Location.getLastKnownPositionAsync();
      if (last && alive) setCenter([last.coords.longitude, last.coords.latitude]);
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (alive) setCenter([coords.longitude, coords.latitude]);
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return center;
}

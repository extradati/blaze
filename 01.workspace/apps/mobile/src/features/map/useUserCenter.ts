import * as Location from "expo-location";
import { useEffect, useState } from "react";
import type { LngLat } from "./config";

/** User position at startup, only if permission was already granted (never prompts). */
export function useUserCenter(enabled: boolean): LngLat | null {
  const [center, setCenter] = useState<LngLat | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    (async () => {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (!granted) return;
      const last = await Location.getLastKnownPositionAsync();
      if (last && alive) setCenter([last.coords.longitude, last.coords.latitude]);
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (alive) setCenter([coords.longitude, coords.latitude]);
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, [enabled]);
  return center;
}

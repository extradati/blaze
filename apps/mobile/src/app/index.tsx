import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LocateButton } from "@/features/location/LocateButton";
import { locate } from "@/features/location/locate";
import { LocationDeniedError, type UserPosition } from "@/features/location/types";
import { LOCATE_ZOOM, USER_ZOOM } from "@/features/map/config";
import { TrekMap } from "@/features/map/TrekMap";
import type { MapFocus } from "@/features/map/types";
import { useUserCenter } from "@/features/map/useUserCenter";

export default function MapScreen() {
  const startCenter = useUserCenter();
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startCenter) setFocus({ center: startCenter, zoom: USER_ZOOM });
  }, [startCenter]);

  async function onLocate() {
    setBusy(true);
    setError(null);
    try {
      const pos = await locate();
      setUserPosition(pos);
      setFocus({ center: pos.center, zoom: LOCATE_ZOOM });
    } catch (e) {
      setError(e instanceof LocationDeniedError ? "Location permission denied" : "Could not get your location");
      setTimeout(() => setError(null), 4000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TrekMap focus={focus} userPosition={userPosition} />
      <LocateButton onPress={onLocate} busy={busy} />
      {error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    position: "absolute", left: 16, right: 80, bottom: 52, padding: 12, borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.75)", color: "white",
  },
});

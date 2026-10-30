import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { LocateButton } from "@/features/location/LocateButton";
import { locate } from "@/features/location/locate";
import { LocationDeniedError, type UserPosition } from "@/features/location/types";
import { LOCATE_ZOOM, USER_ZOOM } from "@/features/map/config";
import { TrekMap } from "@/features/map/TrekMap";
import type { MapFocus } from "@/features/map/types";
import { useUserCenter } from "@/features/map/useUserCenter";
import { Hint } from "@/features/onboarding/Hint";
import { useHint } from "@/features/onboarding/useHint";

export default function MapScreen() {
  const { t } = useTranslation();
  const startCenter = useUserCenter();
  const locateHint = useHint("locate");
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startCenter) setFocus({ center: startCenter, zoom: USER_ZOOM });
  }, [startCenter]);

  async function onLocate() {
    locateHint.dismiss();
    setBusy(true);
    setError(null);
    try {
      const pos = await locate();
      setUserPosition(pos);
      setFocus({ center: pos.center, zoom: LOCATE_ZOOM });
    } catch (e) {
      setError(t(e instanceof LocationDeniedError ? "location.denied" : "location.failed"));
      setTimeout(() => setError(null), 4000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TrekMap focus={focus} userPosition={userPosition} />
      <LocateButton onPress={onLocate} busy={busy} />
      {locateHint.visible && !error && <Hint text={t("hint.locate")} onClose={locateHint.dismiss} style={styles.hint} />}
      {error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { right: 16, bottom: 132 },
  error: {
    position: "absolute", left: 16, right: 80, bottom: 76, padding: 12, borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.75)", color: "white",
  },
});

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { MapButton } from "@/components/MapButton";
import { locate } from "@/features/location/locate";
import { LocationDeniedError, LocationTimeoutError, LocationUnavailableError, type UserPosition } from "@/features/location/types";
import { LOCATE_ZOOM, USER_ZOOM } from "@/features/map/config";
import { TrekMap } from "@/features/map/TrekMap";
import type { MapFocus } from "@/features/map/types";
import { useUserCenter } from "@/features/map/useUserCenter";
import { Hint } from "@/features/onboarding/Hint";
import { useHint } from "@/features/onboarding/useHint";
import { parseGpx } from "@/features/track/gpx";
import { pickTextFile } from "@/features/track/pickFile";
import { TrackCard } from "@/features/track/TrackCard";
import { GpxError } from "@/features/track/types";
import { useTrack } from "@/features/track/useTrack";

export default function MapScreen() {
  const { t } = useTranslation();
  const startCenter = useUserCenter();
  const locateHint = useHint("locate");
  const { track, ready: trackReady, save: saveTrack } = useTrack();
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [busy, setBusy] = useState<"locate" | "track" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startupDone = useRef(false);

  // Startup view: a saved track wins over the user's position.
  useEffect(() => {
    if (startupDone.current || !trackReady) return;
    if (track) setFocus({ bounds: track.bounds });
    else if (startCenter) setFocus({ center: startCenter, zoom: USER_ZOOM });
    else return;
    startupDone.current = true;
  }, [trackReady, track, startCenter]);

  function showError(msg: string) {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }

  async function onLocate() {
    locateHint.dismiss();
    setBusy("locate");
    setError(null);
    try {
      const pos = await locate();
      setUserPosition(pos);
      setFocus({ center: pos.center, zoom: LOCATE_ZOOM });
    } catch (e) {
      showError(t(locateErrorKey(e)));
    } finally {
      setBusy(null);
    }
  }

  async function onLoadTrack() {
    setBusy("track");
    setError(null);
    try {
      const text = await pickTextFile();
      if (text === null) return;
      const parsed = parseGpx(text);
      startupDone.current = true;
      saveTrack(parsed);
      setFocus({ bounds: parsed.bounds });
    } catch (e) {
      showError(t(e instanceof GpxError ? `track.${e.reason}` : "track.readFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TrekMap focus={focus} userPosition={userPosition} track={track} />
      {track && <TrackCard track={track} onRemove={() => saveTrack(null)} />}
      <View style={styles.controls}>
        <MapButton icon="route" label={t("track.load")} onPress={onLoadTrack} busy={busy === "track"} />
        <MapButton icon="my-location" label={t("location.show")} onPress={onLocate} busy={busy === "locate"} />
      </View>
      {locateHint.visible && !error && <Hint text={t("hint.locate")} onClose={locateHint.dismiss} style={styles.hint} />}
      {error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
    </View>
  );
}

function locateErrorKey(e: unknown) {
  if (e instanceof LocationDeniedError) return "location.denied";
  if (e instanceof LocationUnavailableError) return "location.unavailable";
  if (e instanceof LocationTimeoutError) return "location.timeout";
  return "location.failed";
}

const styles = StyleSheet.create({
  controls: { position: "absolute", right: 16, bottom: 72, gap: 12 },
  hint: { right: 76, bottom: 76 }, // left of the locate button (bottom of the controls column)
  error: {
    position: "absolute", left: 16, right: 80, bottom: 76, padding: 12, borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.75)", color: "white",
  },
});

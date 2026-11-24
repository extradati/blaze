import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { MapButton } from "@/components/MapButton";
import { locate } from "@/features/location/locate";
import { useFollowLocation } from "@/features/location/useFollowLocation";
import { LocationDeniedError, LocationTimeoutError, LocationUnavailableError, type UserPosition } from "@/features/location/types";
import { LOCATE_ZOOM, USER_ZOOM } from "@/features/map/config";
import { TrekMap } from "@/features/map/TrekMap";
import type { MapFocus } from "@/features/map/types";
import { useUserCenter } from "@/features/map/useUserCenter";
import { Hint } from "@/features/onboarding/Hint";
import { useHint } from "@/features/onboarding/useHint";
import { useOfflineMap } from "@/features/offline/useOfflineMap";
import { parseGpx } from "@/features/track/gpx";
import { pickTextFile } from "@/features/track/pickFile";
import { TrackCard } from "@/features/track/TrackCard";
import { GpxError } from "@/features/track/types";
import { useTrack } from "@/features/track/useTrack";
import { usePersistedState } from "@/lib/usePersistedState";

export default function MapScreen() {
  const { t } = useTranslation();
  const locateHint = useHint("locate");
  const { track, ready: trackReady, save: saveTrack } = useTrack();
  // Last position from the locate button, kept across sessions. Shown grey ("stale") until a new fix in this session.
  const offlineMap = useOfflineMap(track, trackReady);
  const lastPosition = usePersistedState<UserPosition & { savedAt?: number }>("location.last"); // savedAt: when the button was pressed (ms)
  const follow = useFollowLocation(); // live position after the first press (grey saved one until then)
  const freshPosition = follow.position;
  const userPosition = freshPosition ?? lastPosition.value;
  const storageReady = trackReady && lastPosition.ready;
  // Read live location at startup only if there's nothing saved to show (and permission was already given).
  const startCenter = useUserCenter(storageReady && !track && !lastPosition.value);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [busy, setBusy] = useState<"locate" | "track" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startupDone = useRef(false);

  // Startup view: whichever was more recent of saved track / last known position, else live position (if already allowed), else the Alps.
  useEffect(() => {
    if (startupDone.current || !storageReady) return;
    const pos = lastPosition.value;
    if (pos && (!track || (pos.savedAt ?? pos.time) > (track.loadedAt ?? 0))) setFocus({ center: pos.center, zoom: LOCATE_ZOOM });
    else if (track) setFocus({ bounds: track.bounds });
    else if (startCenter) setFocus({ center: startCenter, zoom: USER_ZOOM });
    else return;
    startupDone.current = true;
  }, [storageReady, track, lastPosition.value, startCenter]);

  function showError(msg: string) {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }

  // Save the live position now and then (it changes every second or so while walking).
  const lastSave = useRef(0);
  useEffect(() => {
    if (!freshPosition || Date.now() - lastSave.current < 15_000) return;
    lastSave.current = Date.now();
    lastPosition.save({ ...freshPosition, savedAt: Date.now() });
  }, [freshPosition]);

  async function onLocate() {
    locateHint.dismiss();
    if (follow.following && freshPosition) return setFocus({ center: freshPosition.center, zoom: LOCATE_ZOOM }); // already live: just recenter
    setBusy("locate");
    setError(null);
    try {
      const pos = await locate();
      startupDone.current = true;
      follow.start(pos);
      lastSave.current = Date.now();
      lastPosition.save({ ...pos, savedAt: Date.now() });
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
      saveTrack({ ...parsed, loadedAt: Date.now() });
      setFocus({ bounds: parsed.bounds });
    } catch (e) {
      showError(t(e instanceof GpxError ? `track.${e.reason}` : "track.readFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TrekMap focus={focus} userPosition={userPosition} positionStale={!freshPosition && !!userPosition} track={track} />
      {track && <TrackCard track={track} offline={offlineMap} onRemove={() => saveTrack(null)} />}
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { Track } from "./types";

const KEY = "track.current";

/** The single loaded track, persisted on the device. `ready` is false until storage has been read. */
export function useTrack() {
  const [track, setTrack] = useState<Track | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setTrack(JSON.parse(v)))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const save = useCallback((t: Track | null) => {
    setTrack(t);
    (t ? AsyncStorage.setItem(KEY, JSON.stringify(t)) : AsyncStorage.removeItem(KEY)).catch(() => {});
  }, []);

  return { track, ready, save };
}

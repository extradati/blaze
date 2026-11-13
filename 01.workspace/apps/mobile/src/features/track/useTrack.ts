import { usePersistedState } from "@/lib/usePersistedState";
import type { Track } from "./types";

/** The single loaded track, persisted on the device. `ready` is false until storage has been read. */
export function useTrack() {
  const { value: track, ready, save } = usePersistedState<Track>("track.current");
  return { track, ready, save };
}

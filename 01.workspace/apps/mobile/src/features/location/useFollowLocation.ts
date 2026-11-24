import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { shouldReplace } from "./better";
import type { UserPosition } from "./types";
import { watchLocation } from "./watch";

/**
 * Live position after the user's first locate: GPS stays on while the app is in the foreground
 * and stops in the background (battery). Less precise fixes don't replace better recent ones.
 */
export function useFollowLocation() {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [following, setFollowing] = useState(false);
  const [active, setActive] = useState(AppState.currentState !== "background");

  const accept = useCallback((p: UserPosition) => setPosition((cur) => (shouldReplace(cur, p) ? p : cur)), []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => setActive(s === "active"));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (following && active) return watchLocation(accept);
  }, [following, active, accept]);

  /** Starts following from a first fix. */
  const start = useCallback((first: UserPosition) => {
    accept(first);
    setFollowing(true);
  }, [accept]);

  return { position, following, start };
}

# 07 — Follow my location

After the first locate press, GPS stays on and the blue dot follows the user (like Google Maps), instead of one fix per press.
- First fix: as before (precise + coarse in parallel, `locate*.ts`), so the dot appears fast; then `watchLocation` (`watch*.ts`: browser `watchPosition` / expo-location `watchPositionAsync`) refines it.
- A fix replaces the shown one only if newer and at least as precise, or if the shown one is over 10 s old (`better.ts`). Fixes the "better, then worse" jumps.
- Pressing the button again only recenters the map (no new request). The map doesn't move by itself, so the user can look around.
- GPS stops when the app goes to the background / screen off, restarts when it's back (`useFollowLocation.ts`, AppState).
- Live position is saved as "last known position" at most every 15 s.

Tests: `e2e/map.spec.ts` (locate button › follows), `e2e/better.spec.ts`. Map tiles in tests come from a local image (`e2e/test.ts`) to spare OpenTopoMap (we got HTTP 429).

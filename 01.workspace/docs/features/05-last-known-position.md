# 05 — Last known position

Each locate-button fix is saved on the device (AsyncStorage `location.last`: center, accuracy, fix time). On reopen:
- The dot is shown at the saved spot in dark grey (#616161), without accuracy circle, with an "X ago" label underneath (just now / min / h / d; refreshes every minute).
- The map opens there (zoom 15), or on the saved track if it was loaded more recently than the last locate press (old tracks without a load time lose).
- Location is not read at startup; pressing the button replaces it with a fresh blue dot and saves it.
- Kept forever until replaced.

Code: `src/app/index.tsx`, `src/lib/usePersistedState.ts`, `src/lib/timeAgo.ts`, `src/features/location/PositionAge.tsx`. Tests: `e2e/map.spec.ts` (last known position), `e2e/timeAgo.spec.ts`.

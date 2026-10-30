# 02 — Locate button

Button (bottom right) shows the user's position as a blue dot with an accuracy circle and centers the map on it (zoom 15).
- One-time fix per press (fresh GPS reading, no cache). No dot until first press.
- Denied/failed → short error message.
- Live follow later: swap `locate()` for a position watcher (`src/features/location/locate*.ts`).

Tests: `e2e/map.spec.ts` (locate button), `e2e/geo.spec.ts` (accuracy circle).

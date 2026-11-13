# 06 — Offline use

When a track is loaded (or found saved at startup), the map along it is saved on the device automatically:
- Area: ~1 km each side of the track (`src/features/offline/area.ts`), zoom 10–16 (lowered if over 6000 tiles).
- Track card shows: saving N% / saved / no connection (resumes when online) / failed.
- Removing or replacing the track deletes its saved map. Only one track's map is kept (AsyncStorage `offline.map`).
- Outside the strip, or zoomed past 16, the map is blank offline (zooming in from 16 shows enlarged tiles).

**Web** (production build only): `public/sw.js` service worker caches the app files (opens offline after one online visit) and serves tiles from Cache Storage `tiles-v1`, which `download.web.ts` fills (4 parallel requests, resumes by skipping saved tiles). iOS Safari may clear site data after weeks unused; adding the app to the Home Screen avoids that.

**Native:** `download.ts` creates MapLibre offline packs (one per ~3 km of track, style written to a local file). MapLibre pauses/resumes them with the connection itself. Not yet tried on a device.

Tests: `e2e/offline.spec.ts` (runs on the production build at :8082, `npm run build:web && npm run serve:web`).

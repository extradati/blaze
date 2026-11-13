# 01 — Trekking map

Full-screen topographic map (OpenTopoMap) on web, Android, iOS.
- Starts on the user's location (zoom 13) if permission granted; otherwise the Alps (zoom 6).
- Pan/zoom, max zoom 17, attribution shown.

Tests: `e2e/map.spec.ts` (web: denied → Alps tiles; granted → tiles at user location).

# 04 — GPX track

"Load GPX track" button (above locate) opens a file picker. The track is drawn in magenta (#E6007E, white casing), the map fits it, and a card at the top shows name + distance with ✕ to remove.
- Supports GPX 1.0/1.1: `trk/trkseg` and `rte` → segments. Start = green flag pin, finish = checkered flag pin (React views as map markers). Magenta arrows along the line show walking direction (`assets/map/track-arrow.png`).
- Waypoints (`wpt`) are parsed but not drawn: their names duplicate the map's own labels.
- One track at a time; a new file replaces it. Saved on device (AsyncStorage `track.current`, parsed JSON ~150 KB for 4k points); on reopen the map fits the saved track.
- Invalid file / no track → error message.

Code: `src/features/track`. Tests: `e2e/gpx.spec.ts` (parser), `e2e/map.spec.ts` (GPX track).

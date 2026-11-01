# 04 — GPX track

"Load GPX track" button (above locate) opens a file picker. The track is drawn in magenta (#E6007E, white casing), the map fits it, and a card at the top shows name + distance with ✕ to remove.
- Supports GPX 1.0/1.1: `trk/trkseg` and `rte` → segments; `wpt` → waypoints (names shown from zoom 12). Start = green dot, end = red dot.
- One track at a time; a new file replaces it. Saved on device (AsyncStorage `track.current`, parsed JSON ~150 KB for 4k points); on reopen the map fits the saved track.
- Invalid file / no track → error message.
- Labels use free fonts from OpenFreeMap (`glyphs` in map style).

Code: `src/features/track`. Tests: `e2e/gpx.spec.ts` (parser), `e2e/map.spec.ts` (GPX track).

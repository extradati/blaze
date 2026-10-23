# Tasks

## 1. Scaffold Vite + TypeScript application

- [x] 1.1 Create package.json with Vite, TypeScript, Leaflet, and Leaflet types; verify `npm install` succeeds
- [x] 1.2 Create tsconfig.json, index.html, and src/main.ts entry; verify `tsc --noEmit` passes with no errors
- [x] 1.3 Add CSS for full-screen map container (`html, body, #map { height: 100%; width: 100%; margin: 0; }`) and viewport meta tag; verify files exist and are referenced

## 2. Implement full-screen OpenStreetMap map

- [x] 2.1 Initialize Leaflet map on `#map` with OSM tile layer (`tile.openstreetmap.org/{z}/{x}/{y}.png`); verify dev server starts and tiles load in browser
- [x] 2.2 Configure map to fill viewport on mobile and desktop; verify map container is 100vw × 100vh
- [x] 2.3 Keep Leaflet zoom and attribution controls visible and working; verify attribution renders and zoom changes map level
- [x] 2.4 Handle viewport resize/orientation change with `map.invalidateSize()`; verify map redraws to fit new viewport

## 3. Verify implementation

- [x] 3.1 Run `vite build` and verify production build succeeds without errors
- [x] 3.2 Open the built app and verify full-screen OSM map displays with controls and attribution

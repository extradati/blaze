# Design

## Context

See proposal.md for motivation (Why). The workspace at `/home/davide/projects/blaze/03.workspace` has an OpenSpec root (`openspec/`) but no existing application source code. The sibling sandbox `99.sandbox/spike_02` establishes the project's existing Vite + TypeScript pattern (Vite dev server, `tsc` build, ES modules). This change adds a new application on top of that pattern, without Ionic (no UI chrome is needed beyond the map).

## Goals / Non-Goals

**Goals:**
- Mobile-first web app rendering a full-screen OpenStreetMap map
- Visible, functional Leaflet controls (zoom, attribution)
- Map fills 100% of viewport width and height
- Responsive resize handling on viewport/orientation change
- Vite + TypeScript toolchain consistent with `99.sandbox/spike_02`

**Non-Goals:**
- Any application UI beyond the map (no search, markers, overlays, navigation chrome)
- User location / geolocation
- Offline mode or tile caching
- Production-scale tile infrastructure (OSM volunteer tiles acceptable for expected low traffic)
- Authentication, persistence, or backend services

## Decisions

**Leaflet.js for map rendering**
- Why: small (~45 KB), native OSM raster tile support, mature, well-typed
- Alternatives considered: MapLibre GL JS (larger, vector tiles need a third-party source), OpenLayers (heavier, overkill for a static full-screen map), plain `` tiles (fragile, no OSM static API)
- Rationale: best fit for a minimal full-screen OSM map with working controls

**Vite + TypeScript**
- Why: matches the existing `spike_02` pattern, gives typed dev server and production build
- Alternative: single HTML file with Leaflet from CDN (even smaller, but diverges from repo pattern and loses type-checking/build)

**OpenStreetMap raster tiles (`tile.openstreetmap.org`)**
- Why: user-confirmed requirement, low expected traffic
- Trade-off: volunteer-run service, requires attribution, not for sustained production traffic — provider can be swapped later without changing the spec

**Full-screen `<div id="map">` with CSS `width: 100vw; height: 100vh`**
- Simplest way to satisfy "full screen, no other application UI"
- Leaflet `map.invalidateSize()` on resize/orientation change to keep tiles aligned

**Leaflet controls left on (zoom + attribution)**
- User confirmed: controls visible and working; "no interaction" refers to the rest of the application, not the map itself

## Risks / Trade-offs

[OSM volunteer tile service may throttle or be unreliable] → acceptable for low traffic; document attribution requirement; swap provider if traffic grows

[Leaflet adds a runtime dependency and ~45 KB bundle] → acceptable; no lighter OSM-native alternative without losing controls

[Mobile viewport/safe-area issues (status bar, browser chrome)] → mitigate with viewport meta tag and device testing; does not change specs or tasks

## Migration Plan

No existing application to migrate. Deploy: build with `vite build`, serve static output. Rollback: remove the new application directory; no shared state or data to roll back.

## Open Questions

None blocking. Tile provider for production-scale traffic is deferrable — it does not change the specs, approach, or task breakdown.

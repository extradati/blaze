# Design

## Context

The map viewer (`03.workspace`) currently renders a full-screen Leaflet OpenStreetMap map into `<div id="map">` with CSS `width: 100vw; height: 100vh`, using Vite + TypeScript (ES modules, `tsc && vite build`). Runtime dependency: `leaflet` ^1.9.4. No application UI chrome exists beyond the map. See `proposal.md` for motivation (Why).

The sibling sandbox `99.sandbox/spike_02` already integrates `@ionic/core` ^9.0.7 with the same Vite + TypeScript pattern: custom elements are registered via `defineCustomElements()` from `@ionic/core/loader`, and `@ionic/core/css/core.css` is imported. Ionic components are then used as vanilla HTML custom elements.

This change adds `@ionic/core` so an empty Ionic header and footer can coexist with the Leaflet map. It reverses the archived foundation change's "no UI chrome" Non-Goal.

## Goals / Non-Goals

**Goals:**
- Add `@ionic/core` ^9.x as a runtime dependency
- Register Ionic custom elements in `src/main.ts` and import Ionic core CSS
- Add an empty Ionic header and an empty Ionic footer (both visible, no buttons) alongside the Leaflet map
- Keep Leaflet map rendering (tiles, zoom controls, resize handling) intact
- Share viewport between the map and Ionic chrome per the modified `map-display` spec

**Non-Goals:**
- Adopting an Ionic framework integration (`@ionic/react`, `@ionic/vue`, etc.)
- Converting the app to an Ionic navigation-based multi-page app
- Changing the map provider (Leaflet + OSM raster tiles remain)
- Adding authentication, persistence, or backend services

## Decisions

**Ionic via custom-elements loader (vanilla TypeScript)**
- Why: `99.sandbox/spike_02` proves this exact pattern works with this repo's toolchain (Vite + TS + ES modules). No framework integration is needed, avoiding extra dependencies and build complexity.
- Alternatives considered: `@ionic/react` / `@ionic/vue` / `@ionic/angular` (heavier, diverges from the plain TS pattern; requires a framework the app does not use).
- Rationale: minimal addition; Ionic components register as custom elements and work as plain HTML.

**Layout: Empty Ionic header above the map, empty Ionic footer below the map**
- Why: simplest way to share viewport per the modified spec. The header sits above the map and the footer below it, both visible and empty (no buttons); the map fills the remaining space between them.
- Alternative: none — the user explicitly requested no buttons or overlays, so the map is not overlaid by Ionic components.
- Rationale: satisfies the spec's "map alongside header and footer" scenario without fighting Leaflet's full-screen sizing or introducing buttons/overlays that were not requested.

**Ionic version ^9.x**
- Why: matches `99.sandbox/spike_02`, which already has `@ionic/core` ^9.0.7 and `ionicons` ^8.1.0 resolved in its lockfile. Same major version keeps integration behavior consistent across the repo.
- Rationale: proven, compatible with the existing Vite 8 / TypeScript 6 toolchain.

**CSS import: `@ionic/core/css/core.css` only (not bundled themes)**
- Why: core CSS provides component styling without pulling in a full theme bundle; the app can opt into additional Ionic CSS (e.g., `@ionic/core/css/ionic.bundle.css`) later if needed.
- Rationale: keeps bundle impact proportional to actual usage.

## Risks / Trade-offs

[Ionic bundle adds significant runtime weight beyond Leaflet's ~45 KB] → acceptable for enabling Ionic components; bundle size should be reviewed at build time
[Leaflet's `100vw × 100vh` map container conflicts with Ionic header occupying viewport space] → mitigate with `calc(100vh - <header-height>)` or flexbox layout in `style.css`; verify map `invalidateSize()` on header mount/resize
[Mobile safe-area (status bar, browser chrome) may collide with Ionic chrome] → mitigate with viewport meta tag and `--ion-safe-area-*` CSS variables; device testing required
[Reverses a prior explicit Non-Goal ("no UI chrome")] → documented in proposal; stakeholders should confirm this scope reversal is intended

## Migration Plan

Deploy: `npm install` to add `@ionic/core`, then `vite build` and serve static output. Rollback: remove `@ionic/core` from `package.json` and lockfile, revert `src/main.ts` / `src/style.css` / `index.html` changes, restore the map to full-screen 100vw × 100vh. No shared state or data to roll back.

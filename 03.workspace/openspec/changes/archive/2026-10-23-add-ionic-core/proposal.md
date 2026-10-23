# Proposal

## Why

The map viewer renders a full-screen Leaflet map with no application UI chrome. The archived foundation change explicitly excluded Ionic ("no UI chrome is needed beyond the map") and listed "any application UI beyond the map" as a Non-Goal. The user now needs Ionic Core components (header and footer chrome) to build application UI around the map. Adding `@ionic/core` reverses that Non-Goal and enables Ionic web components in the existing Vite + TypeScript stack, following the integration pattern already proven in `99.sandbox/spike_02`.

## What Changes

- Add `@ionic/core` runtime dependency to `package.json` (version ^9.x, matching spike_02)
- Register Ionic custom elements via `defineCustomElements()` from `@ionic/core/loader` in `src/main.ts`
- Import Ionic core CSS (`@ionic/core/css/core.css`) in `src/main.ts`
- Add an empty Ionic header and an empty Ionic footer (both visible, no buttons) alongside the Leaflet map
- Update `specs/map-display/spec.md` so the map no longer exclusively owns 100% of the viewport; Ionic UI chrome coexists with or overlays the map
- `index.html` viewport / safe-area meta adjustments as needed for Ionic layout on mobile

## Capabilities

### New Capabilities

(None)

### Modified Capabilities

- `map-display`: The requirement that the map fills 100% of the viewport with no other application UI is changing — Ionic UI chrome will now coexist with/inlay with the map. Leaflet map rendering (tiles, controls, resize handling) remains intact, but viewport ownership is shared with Ionic components.

## Impact

- New runtime dependency on `@ionic/core` ^9.x
- `src/main.ts` and `src/style.css` changes for custom element registration and shared header/footer layout
- `index.html` viewport / safe-area meta adjustments
- `specs/map-display/spec.md` delta updates reflecting shared viewport with Ionic header and footer
- Reverses the foundation change's "no UI chrome" Non-Goal

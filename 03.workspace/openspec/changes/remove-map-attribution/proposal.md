# Proposal

## Why

The Leaflet map control attribution (OpenStreetMap credit text in the bottom-right corner) clutters the full-screen map view. Removing it produces a cleaner interface. OpenStreetMap remains the tile provider; attribution will be provided in a separate app section in a future change, so this change removes the control without switching providers or suppressing the underlying obligation.

## What Changes

- Remove the Leaflet attribution control from the map (`attributionControl: false` in map options)
- Remove the `attribution` option from the OpenStreetMap tile layer
- No change to OpenStreetMap tile URL or zoom controls

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `map-display`: The `Map attribution` requirement changes — attribution text is removed from the map UI and will be provided in a separate app section instead. The `Map controls` requirement changes — Leaflet controls cover zoom only; attribution control is removed.

## Impact

- `src/main.ts`: map initialization and tile layer options
- `openspec/specs/map-display/spec.md`: requirements `Map attribution` and `Map controls`

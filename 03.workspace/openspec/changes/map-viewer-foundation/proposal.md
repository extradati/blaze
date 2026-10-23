# Proposal

## Why

The project has no map display capability yet. The foundation requirement is a mobile-first web application that renders a full-screen OpenStreetMap map with no additional application UI — establishing the minimal baseline before any interaction, search, or overlay features are added.

## What Changes

- Scaffold a Vite + TypeScript project for the map viewer application
- Add Leaflet.js as the map rendering library
- Add an OpenStreetMap raster tile layer as the map provider
- Add a full-screen map container with visible, functional Leaflet controls (zoom and attribution)

## Capabilities

### New Capabilities

- `map-display`: Renders a full-screen OpenStreetMap map with standard Leaflet controls. Covers tile loading, viewport setup, attribution display, and map lifecycle (initialize, resize). Creates specs/map-display/spec.md.

### Modified Capabilities

- None

## Impact

- New application code in the workspace (no existing application source to modify)
- New runtime dependency on Leaflet.js
- Toolchain consistent with the existing spike_02 pattern in 99.sandbox/ (Vite + TypeScript)

# Design

## Context

The map-display capability renders a full-screen OpenStreetMap map using Leaflet.js (`openspec/specs/map-display/spec.md`). The map currently shows an attribution control (OpenStreetMap credit text) in the bottom-right corner via Leaflet's default `L.Control.Attribution`, sourced from the tile layer's `attribution` option. See proposal.md for the motivation to remove it.

## Goals / Non-Goals

**Goals:**
- Remove the Leaflet attribution control from the map UI for a cleaner interface
- Keep OpenStreetMap as the tile provider and keep zoom controls functional

**Non-Goals:**
- Switching tile providers
- Adding attribution anywhere in this change (to be added in a separate app section later)
- Removing or changing the zoom control

## Decisions

- **Disable attribution control via `attributionControl: false`** in `L.map()` options rather than setting `attribution: ""` on the tile layer. This prevents Leaflet from creating the `.leaflet-control-attribution` element at all, avoiding an empty control node in the DOM.
  - Alternative considered: `attribution: ""` on the tile layer — rejected because Leaflet still renders an empty attribution control element, which does not fully clean the interface.

## Risks / Trade-offs

- [Attribution removed from map may not satisfy OpenStreetMap tile terms] → Mitigation: attribution will be provided in a separate app section in a future change, as noted in the proposal; this change does not switch providers or suppress the obligation silently

## Open Questions

None.

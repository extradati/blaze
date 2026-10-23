# Proposal

## Why

The map viewer has an Ionic header above the map and an Ionic footer below it (added by the archived `add-ionic-core` change), but both currently contain placeholder "Test" text. The application should show real identity — "Blaze 1.0" in the header and "version 0.0.1" in the footer — and both should be visibly rendered so users can confirm the app name and version at a glance.

## What Changes

- Update `index.html`: `<ion-header>` text from "Test" to "Blaze 1.0" (hardcoded)
- Update `index.html`: `<ion-footer>` text from "Test" to "version 0.0.1" (hardcoded)
- Add spec requirements to `map-display` for header content, footer content, and header/footer visibility
- Visually validate that both header and footer render with the correct text

## Capabilities

### New Capabilities

(None)

### Modified Capabilities

- `map-display`: Adds requirements that the Ionic header displays "Blaze 1.0", the Ionic footer displays "version 0.0.1", and both are visible on screen. This is application shell identity content rendered alongside the map.

## Impact

- `index.html` text content changes (header and footer)
- `specs/map-display/spec.md` gains new header/footer content and visibility requirements
- No new dependencies; `@ionic/core` already installed from the archived `add-ionic-core` change

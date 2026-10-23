# Design

## Context

The map viewer (`03.workspace`) already has an Ionic `<ion-header>` above the map and an `<ion-footer>` below it (added by the archived `add-ionic-core` change). Both currently contain placeholder "Test" text. `@ionic/core` ^9.0.7 is installed, custom elements are registered via `defineCustomElements()` in `src/main.ts`, and `src/style.css` uses a flexbox column layout so the header, map, and footer share the viewport. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Replace `<ion-header>` placeholder text "Test" with hardcoded "Blaze 1.0"
- Replace `<ion-footer>` placeholder text "Test" with hardcoded "version 0.0.1"
- Keep both header and footer visibly rendered alongside the map
- Verify the change visually (user confirmation)

**Non-Goals:**
- No automated test files (validation is visual/manual)
- No dynamic version sync with `package.json` (text is hardcoded per user request)
- No changes to `src/main.ts`, `src/style.css`, or any TypeScript
- No new dependencies

## Decisions

**Hardcoded text in `index.html`**
- Why: The user explicitly requested hardcoded values ("Blaze 1.0" and "version 0.0.1"). This is the simplest possible change — a single-file edit with no build impact.
- Alternatives considered: deriving text from `package.json` at build time (rejected — adds complexity and a build step for a content-only change); configurable text via environment variables (rejected — over-engineering for static identity text).
- Rationale: minimal, focused, matches user intent.

**Edit `index.html` only**
- Why: The header/footer are plain HTML custom elements with text content; no TypeScript or CSS changes are needed.
- Rationale: keeps the change scoped to one file; no risk to map rendering or Ionic registration.

**Visual validation**
- Why: The user will validate header/footer visibility and text manually. No test infrastructure exists in the project, and adding it is out of scope.
- Rationale: matches the user's stated acceptance criterion ("I'll validate it visually").

## Risks / Trade-offs

[Footer text "version 0.0.1" diverges from `package.json` version "0.0.0"] → acceptable per user's hardcoded requirement; version drift noted but not addressed in this change
[No automated visibility check] → acceptable; user will validate visually; if automated checks are desired later, a separate change can add test infrastructure

## Migration Plan

Deploy: `vite build` and serve static output. Rollback: revert the two text strings in `index.html` back to "Test". No shared state or data to roll back.

## Open Questions

None.

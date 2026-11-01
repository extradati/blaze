# 001 — Broken OpenTopoMap tiles

**Type:** fix (external) · **Found:** 2026-11-01

## Problem
Some OpenTopoMap tiles are cached on their server as an HTML page ("Human verification | Pngtree", 15 457 bytes) served with `content-type: image/jpeg`. Browsers can't decode them; the map shows a blurry lower-zoom tile in those spots.

Seen at zoom 14 near Roncola (Valle Imagna):
`14/8627/5844`, `14/8628/5841`, `14/8628/5844`, `14/8629/5841`, `14/8629/5842`, `14/8629/5843`, `14/8629/5844`
(e.g. https://a.tile.opentopomap.org/14/8628/5841.png — `x-cache-status: HIT`, `last-modified: 2026-01-16`)

## Done so far
App handles tile errors quietly (no red error in dev); MapLibre falls back to the lower-zoom tile (`a164cfb`).

## Options
1. Report to OpenTopoMap (GitHub issue) with the tile list so they purge their cache. Draft first, user approves before posting.
2. Switch tile provider: MapTiler free tier (key, 100k tiles/month) or self-host tiles on the DigitalOcean VM. Only `src/features/map/config.ts` changes.

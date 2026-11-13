# Architecture

- `apps/mobile` — Expo (React Native + TS), one codebase for web, Android, iOS. Routes in `src/app` (Expo Router), features in `src/features/<name>`.
- `apps/api`, `packages/*` — added when first needed (then switch root to npm workspaces).

## Decisions
- **Maps:** MapLibre (`maplibre-gl` on web via `*.web.tsx`, `@maplibre/maplibre-react-native` on native). Supports raster/vector tiles and offline packs.
- **Tiles:** OpenTopoMap (free, no key, fair-use). Provider lives only in `src/features/map/config.ts`; move to MapTiler free tier or self-hosted tiles when traffic/offline requires.
- **Offline:** web uses a service worker (`public/sw.js`, production only) + Cache Storage; native uses MapLibre offline packs. See features/06-offline.md.
- **Native builds:** MapLibre needs a dev build (not Expo Go): `npx expo run:android|ios` or `eas build`.

## Commands (in `apps/mobile`)
`npm run web` · `npm run typecheck` (app + tests) · `npm run test:e2e` · `npm run build:web` (production web build in `dist/`) · `npm run serve:web` (serves `dist/` on :8082)

## Translations
i18next + expo-localization (device language, fallback `en`). Strings in `src/i18n/locales/<lang>.ts`; keys are typed, so a missing key fails `npm run typecheck`. Never hard-code UI text.

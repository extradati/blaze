# Trekking app

Expo app for web, Android and iOS. Use **npm** only (pnpm/yarn are blocked).

## Run locally

```sh
cd 01.workspace/apps/mobile
npm ci                       # install exact versions from package-lock.json
npx expo start --web         # open http://localhost:8081
```

After installing or updating packages, add `-c` once to clear the bundler cache: `npx expo start --web -c`.

Offline mode only works in the production build: `npm run build:web && npm run serve:web` → http://localhost:8082. Deploy the `dist/` folder.

Phones: Android/iOS need a development build (MapLibre doesn't run in Expo Go).

## Checks

```sh
npm run typecheck
npx playwright install chromium   # first time, or after Playwright updates
npm run test:e2e
```

Docs: `../../docs/` (architecture, features, backlog).

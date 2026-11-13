import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:8081" },
  webServer: [
    { command: "npx expo start --web --port 8081", url: "http://localhost:8081", reuseExistingServer: true, timeout: 180_000 },
    // Production build, for features that only exist there (offline service worker).
    { command: "npm run build:web && npm run serve:web", url: "http://localhost:8082", reuseExistingServer: true, timeout: 300_000 },
  ],
});

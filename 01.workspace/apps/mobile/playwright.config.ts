import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:8081" },
  webServer: { command: "npx expo start --web --port 8081", url: "http://localhost:8081", reuseExistingServer: true, timeout: 180_000 },
});

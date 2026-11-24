import { expect, test } from "./test";
import { stripTiles } from "../src/features/offline/area";
import { parseGpx } from "../src/features/track/gpx";
import { readFileSync } from "node:fs";

const fixture = `${__dirname}/fixtures/sample.gpx`;

test("strip along the track: zoom 10–16, about 1 km each side", () => {
  const tiles = stripTiles(parseGpx(readFileSync(fixture, "utf8")));
  const zs = new Set(tiles.map((t) => t.z));
  expect(Math.min(...zs)).toBe(10);
  expect(Math.max(...zs)).toBe(16);
  const z16 = tiles.filter((t) => t.z === 16).length; // 2.7 km loop, z16 tile ≈ 430 m
  expect(z16).toBeGreaterThan(20);
  expect(z16).toBeLessThan(150);
});

// Production build only (service worker).
test.describe("offline", () => {
  test.use({ baseURL: "http://localhost:8082" });

  test("saved track and its map open without a connection; removing the track deletes the map", async ({ page, context }) => {
    test.setTimeout(180_000);
    await page.goto("/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(async () => !!(await caches.match("/")))).toBe(true);
    const chooser = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Load GPX track" }).click();
    await (await chooser).setFiles(fixture);
    await expect(page.getByTestId("offline-status")).toContainText("Map saved for offline use", { timeout: 150_000 });

    await context.setOffline(true);
    const tiles: number[] = [];
    context.on("response", (r) => /tile\.opentopomap\.org\/1[3-6]\//.test(r.url()) && tiles.push(r.status())); // detailed tiles: from the saved strip
    await page.reload();
    await expect(page.getByTestId("track-card")).toContainText("Rifugio Test Loop");
    await expect(page.getByTestId("trek-map")).toHaveAttribute("data-track-points", "4");
    await expect(page.getByTestId("offline-status")).toContainText("Map saved for offline use");
    await expect.poll(() => tiles.filter((s) => s === 200).length).toBeGreaterThan(4); // map drawn from saved tiles
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "test-results/offline-map.png" });

    await page.getByRole("button", { name: "Remove track" }).click();
    await expect.poll(() => page.evaluate(() => caches.has("tiles-v1"))).toBe(false);
  });

  test("download pauses offline and resumes when back online", async ({ page, context }) => {
    test.setTimeout(180_000);
    await page.goto("/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    const chooser = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Load GPX track" }).click();
    await (await chooser).setFiles(fixture);
    await expect(page.getByTestId("offline-status")).toContainText("No connection");
    await context.setOffline(false);
    await expect(page.getByTestId("offline-status")).toContainText("Map saved for offline use", { timeout: 150_000 });
  });
});

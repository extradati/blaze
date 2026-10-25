import { expect, test, type Page } from "@playwright/test";

const TILE = /tile\.opentopomap\.org\/(\d+)\/(\d+)\/(\d+)\.png/;
// 256px raster tiles are fetched one zoom level above the map zoom.

// Slippy-map tile containing lng/lat at zoom z.
function tileAt(lng: number, lat: number, z: number) {
  const n = 2 ** z, r = (lat * Math.PI) / 180;
  return { x: Math.floor(((lng + 180) / 360) * n), y: Math.floor(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * n) };
}

function waitForTile(page: Page, z: number, lng: number, lat: number) {
  const t = tileAt(lng, lat, z);
  return page.waitForResponse((res) => {
    const m = res.url().match(TILE);
    return !!m && +m[1] === z && Math.abs(+m[2] - t.x) <= 2 && Math.abs(+m[3] - t.y) <= 2 && res.ok();
  }, { timeout: 30_000 });
}

test("shows topo map of the Alps when location is denied", async ({ page }) => {
  const tile = waitForTile(page, 7, 10.5, 46.3);
  await page.goto("/");
  await expect(page.getByTestId("trek-map")).toBeVisible();
  await tile;
  await expect(page.getByText("OpenTopoMap")).toBeVisible();
});

test("centers on user location when granted", async ({ page, context }) => {
  const zermatt = { longitude: 7.75, latitude: 46.02 };
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation(zermatt);
  const tile = waitForTile(page, 14, zermatt.longitude, zermatt.latitude);
  await page.goto("/");
  await tile;
});

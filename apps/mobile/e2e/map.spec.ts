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

test.describe("locate button", () => {
  const zermatt = { longitude: 7.75, latitude: 46.02 };
  const chamonix = { longitude: 6.87, latitude: 45.92 };
  const button = (page: Page) => page.getByRole("button", { name: "Show my location" });

  test("shows no dot until pressed, then dot and map on current position", async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation(zermatt);
    const start = waitForTile(page, 14, zermatt.longitude, zermatt.latitude);
    await page.goto("/");
    await start;
    await expect(page.getByTestId("trek-map")).not.toHaveAttribute("data-user-location");

    await context.setGeolocation(chamonix); // user walked; button must read a fresh fix
    const moved = waitForTile(page, 16, chamonix.longitude, chamonix.latitude);
    await button(page).click();
    await expect(page.getByTestId("trek-map")).toHaveAttribute("data-user-location", "6.87,45.92");
    await moved;
  });

  test("shows an error when location is denied", async ({ page }) => {
    await page.goto("/");
    await button(page).click();
    await expect(page.getByRole("alert")).toHaveText(/denied|Could not get/);
  });
});

test.describe("first launch", () => {
  const hint = (page: Page) => page.getByText("Tap to see where you are");

  test("does not ask for location until the button is pressed", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as any;
      w.geoCalls = 0;
      for (const fn of ["getCurrentPosition", "watchPosition"] as const) {
        const orig = navigator.geolocation[fn].bind(navigator.geolocation);
        (navigator.geolocation as any)[fn] = (...a: any[]) => (w.geoCalls++, (orig as any)(...a));
      }
    });
    await page.goto("/");
    await expect(hint(page)).toBeVisible();
    expect(await page.evaluate(() => (window as any).geoCalls)).toBe(0);
    await page.getByRole("button", { name: "Show my location" }).click();
    await expect.poll(() => page.evaluate(() => (window as any).geoCalls)).toBeGreaterThan(0);
  });

  test("hint closes for good with its close button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Close hint" }).click();
    await expect(hint(page)).toBeHidden();
    await page.reload();
    await expect(page.getByRole("button", { name: "Show my location" })).toBeVisible();
    await expect(hint(page)).toBeHidden();
  });

  test("hint closes for good after using the locate button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show my location" }).click();
    await expect(hint(page)).toBeHidden();
    await page.reload();
    await expect(page.getByRole("button", { name: "Show my location" })).toBeVisible();
    await expect(hint(page)).toBeHidden();
  });
});

test.describe("position unavailable (e.g. Mac without Wi-Fi)", () => {
  // Fake browser geolocation: precise fixes fail with POSITION_UNAVAILABLE (or never answer if `preciseHangs`);
  // coarse ones succeed if `coarseWorks`.
  async function fakeGeo(page: Page, coarseWorks: boolean, preciseHangs = false) {
    await page.addInitScript(([coarseWorks, preciseHangs]) => {
      (navigator.geolocation as any).getCurrentPosition = (ok: PositionCallback, fail: PositionErrorCallback, o: PositionOptions) => {
        if (o?.enableHighAccuracy && preciseHangs) return;
        if (o?.enableHighAccuracy || !coarseWorks) return fail({ code: 2, message: "unavailable", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as any);
        ok({ coords: { longitude: 6.87, latitude: 45.92, accuracy: 500 } } as any);
      };
    }, [coarseWorks, preciseHangs]);
  }

  test("falls back to a coarse position", async ({ page }) => {
    await fakeGeo(page, true);
    await page.goto("/");
    await page.getByRole("button", { name: "Show my location" }).click();
    await expect(page.getByTestId("trek-map")).toHaveAttribute("data-user-location", "6.87,45.92");
  });

  test("does not wait for a precise fix that never comes", async ({ page }) => {
    await fakeGeo(page, true, true);
    await page.goto("/");
    await page.getByRole("button", { name: "Show my location" }).click();
    await expect(page.getByTestId("trek-map")).toHaveAttribute("data-user-location", "6.87,45.92", { timeout: 5_000 });
  });

  test("explains when no position can be found", async ({ page }) => {
    await fakeGeo(page, false);
    await page.goto("/");
    await page.getByRole("button", { name: "Show my location" }).click();
    await expect(page.getByRole("alert")).toContainText("could not determine its position");
  });
});

test("map worker loads (needed to draw the location dot)", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await expect(page.getByTestId("trek-map")).toBeVisible();
  await page.waitForTimeout(2000);
  expect(errors.filter((e) => /worker/i.test(e))).toEqual([]);
  const res = await request.get("/maplibre-gl-worker.js");
  expect(res.ok()).toBe(true);
  expect(res.headers()["content-type"]).toMatch(/javascript/);
  expect(await res.text()).not.toContain("sourceMappingURL"); // no 404 for a .map we don't ship
});

test.describe("GPX track", () => {
  const fixtures = `${__dirname}/fixtures`;
  const map = (page: Page) => page.getByTestId("trek-map");
  const card = (page: Page) => page.getByTestId("track-card");

  async function upload(page: Page, file: string) {
    const chooser = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Load GPX track" }).click();
    await (await chooser).setFiles(`${fixtures}/${file}`);
  }

  // Any tile at zoom >= minZ around lng/lat: the map was fitted to the track.
  function waitForTileNear(page: Page, lng: number, lat: number, minZ: number) {
    return page.waitForResponse((res) => {
      const m = res.url().match(TILE);
      if (!m || +m[1] < minZ || !res.ok()) return false;
      const t = tileAt(lng, lat, +m[1]);
      return Math.abs(+m[2] - t.x) <= 2 && Math.abs(+m[3] - t.y) <= 2;
    }, { timeout: 30_000 });
  }

  test("loads, fits the map, shows name and distance, survives reload, can be removed", async ({ page }) => {
    const warnings: string[] = [];
    page.on("console", (m) => ["warning", "error"].includes(m.type()) && warnings.push(m.text()));
    await page.goto("/");
    const fitted = waitForTileNear(page, 9.4, 45.93, 13);
    await upload(page, "sample.gpx");
    await expect(card(page)).toContainText("Rifugio Test Loop");
    await expect(card(page)).toContainText("2.7 km");
    await expect(map(page)).toHaveAttribute("data-track-points", "4");
    await expect(page.getByTestId("track-flag-start")).toBeVisible();
    await expect(page.getByTestId("track-flag-finish")).toBeVisible();
    await fitted;
    expect(warnings.filter((w) => /image|track-arrow/i.test(w))).toEqual([]); // arrow icon loaded

    const refitted = waitForTileNear(page, 9.4, 45.93, 13);
    await page.reload();
    await expect(card(page)).toContainText("Rifugio Test Loop");
    await expect(map(page)).toHaveAttribute("data-track-points", "4");
    await refitted; // reopening the app shows the saved track

    await page.getByRole("button", { name: "Remove track" }).click();
    await expect(card(page)).toBeHidden();
    await expect(map(page)).not.toHaveAttribute("data-track-points");
    await expect(page.getByTestId("track-flag-start")).toBeHidden();
    await page.reload();
    await expect(page.getByRole("button", { name: "Load GPX track" })).toBeVisible();
    await expect(card(page)).toBeHidden();
  });

  test("explains when the file has no track", async ({ page }) => {
    await page.goto("/");
    await upload(page, "no-track.gpx");
    await expect(page.getByRole("alert")).toContainText("contains no track");
    await expect(card(page)).toBeHidden();
  });
});

test("broken map tiles do not raise errors", async ({ page }) => {
  // OpenTopoMap has served HTML pages labelled as images for some tiles.
  await page.route(/tile\.opentopomap\.org\/7\//, (route) => route.fulfill({ status: 200, contentType: "image/jpeg", body: "<!DOCTYPE html><html></html>" }));
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await expect(page.getByTestId("trek-map")).toBeVisible();
  await page.waitForTimeout(3000);
  expect(errors).toEqual([]);
});

import { test as base } from "@playwright/test";
import { readFileSync } from "node:fs";

// Map tiles come from a local plain image, not OpenTopoMap: tests stay fast and don't load their free server
// (repeated runs got HTTP 429). Tests can still add page.route() for special tiles; page routes win.
const tile = readFileSync(`${__dirname}/fixtures/tile.png`);

export const test = base.extend({
  context: async ({ context }, use) => {
    let offline = false;
    const setOffline = context.setOffline.bind(context);
    context.setOffline = (v) => ((offline = v), setOffline(v));
    await context.route(/tile\.opentopomap\.org\//, (route) =>
      offline
        ? route.abort("internetdisconnected")
        : route.fulfill({ status: 200, contentType: "image/png", headers: { "Access-Control-Allow-Origin": "*" }, body: tile }),
    );
    await use(context);
  },
});
export { expect, type Page } from "@playwright/test";

// Offline support (production web build only, see src/features/offline/registerServiceWorker.web.ts).
// - App files: network first, cached copy when offline. Hashed bundles: cache first.
// - Map tiles: from "tiles-v1" (filled by the track download), else network.
const APP = "app-v1";
const TILES = "tiles-v1";
const TILE = /^https:\/\/[abc]\.tile\.opentopomap\.org\/(\d+\/\d+\/\d+\.png)$/;

// Install: cache the page and the files it references, so the app opens offline after one online visit.
self.addEventListener("install", (e) => e.waitUntil(precache().then(() => self.skipWaiting())));

async function precache() {
  const cache = await caches.open(APP);
  const res = await fetch("/", { cache: "no-cache" });
  const html = await res.clone().text();
  await cache.put("/", res);
  const urls = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1]);
  await Promise.all(urls.map((u) => cache.add(u).catch(() => {})));
}
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// The page sends the files it loaded before this worker took control.
self.addEventListener("message", (e) => {
  if (e.data?.type === "cache-app") e.waitUntil(caches.open(APP).then((c) => Promise.all(e.data.urls.map((u) => c.add(u).catch(() => {})))));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const tile = req.url.match(TILE);
  if (tile) return e.respondWith(caches.open(TILES).then((c) => c.match(`https://tile.opentopomap.org/${tile[1]}`)).then((hit) => hit || fetch(req)));
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/_expo/static/")) return e.respondWith(cacheFirst(req));
  e.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) (await caches.open(APP)).put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetchWithTimeout(req, 4000); // weak signal in the mountains: don't hang
    if (res.ok) (await caches.open(APP)).put(req, res.clone());
    return res;
  } catch (err) {
    const hit = (await caches.match(req)) || (req.mode === "navigate" && (await caches.match("/")));
    if (hit) return hit;
    throw err;
  }
}

function fetchWithTimeout(req, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(req).then(resolve, reject).finally(() => clearTimeout(t));
  });
}

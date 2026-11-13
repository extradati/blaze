/** Makes the web app open without a connection. Production builds only (it would fight Metro's reloads in dev). */
export function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production" || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
  navigator.serviceWorker.ready.then((reg) => {
    const urls = [location.origin + "/", ...performance.getEntriesByType("resource").map((e) => e.name)]
      .filter((u) => u.startsWith(location.origin));
    reg.active?.postMessage({ type: "cache-app", urls });
  });
}

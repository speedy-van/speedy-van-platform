/* SpeedyVan service worker — minimal offline shell + asset cache. */
const VERSION = "v1";
const SHELL_CACHE = `sv-shell-${VERSION}`;
const RUNTIME_CACHE = `sv-runtime-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const SHELL_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Network-first for HTML navigations with offline fallback.
// Cache-first for static assets (images, fonts, css, js).
// Bypass for API requests.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never cache API calls
  if (url.hostname.startsWith("api.") || url.pathname.startsWith("/api/")) return;

  // HTML navigations
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets (Next /_next/static, images, fonts, etc.)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    /\.(?:js|css|png|jpg|jpeg|svg|webp|avif|gif|ico|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            if (res.ok && res.type === "basic") {
              const copy = res.clone();
              caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
            }
            return res;
          })
      )
    );
  }
});

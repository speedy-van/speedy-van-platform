/* Cache only public pages and static assets; private journeys require a connection. */
const VERSION = "v6-public-pages-only";
const SHELL_CACHE = `sv-shell-${VERSION}`;
const RUNTIME_CACHE = `sv-runtime-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const SHELL_ASSETS = [OFFLINE_URL, "/manifest.json", "/logo.png?v=amber-20260921-1"];
const PUBLIC_PAGES = new Set(["/", "/privacy", "/terms", "/cookies", "/pricing"]);

function isPublicNavigation(url) {
  return !url.search && (
    PUBLIC_PAGES.has(url.pathname) ||
    /^\/(?:services|areas)\/[a-z0-9-]+$/.test(url.pathname)
  );
}

function canCache(response) {
  const policy = response.headers.get("cache-control") || "";
  const vary = response.headers.get("vary") || "";
  return response.status === 200 && response.type === "basic" && !response.redirected &&
    !/\b(?:private|no-store|no-cache)\b/i.test(policy) && !/(?:^|,)\s*(?:cookie|authorization|\*)\s*(?:,|$)/i.test(vary);
}

async function offlineResponse() {
  const shell = await caches.open(SHELL_CACHE);
  return (await shell.match(OFFLINE_URL)) || new Response(
    "You are offline. Reconnect before making a booking or payment.",
    { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => /^(?:sv-shell-|sv-runtime-)/.test(key) && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === "/api" || url.pathname.startsWith("/api/")) return;
  if (request.headers.has("authorization") || request.headers.has("range")) return;

  if (request.mode === "navigate") {
    const publicPage = isPublicNavigation(url);
    event.respondWith(fetch(request).then((response) => {
      if (publicPage && canCache(response) && /text\/html/i.test(response.headers.get("content-type") || "")) {
        const copy = response.clone();
        event.waitUntil(caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined));
      }
      return response;
    }).catch(async () => {
      if (publicPage) {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
      }
      return offlineResponse();
    }));
    return;
  }

  // Only known public asset directories and fixed shell assets may be cached.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/fonts/") ||
    ["/logo.png", "/favicon.ico", "/manifest.json"].includes(url.pathname)
  ) {
    event.respondWith(caches.open(RUNTIME_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (canCache(response) && !/text\/html/i.test(response.headers.get("content-type") || "")) {
        const copy = response.clone();
        event.waitUntil(cache.put(request, copy).catch(() => undefined));
      }
      return response;
    }));
  }
});

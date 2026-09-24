"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js after the page is interactive.
 * No-ops in dev (avoids stale caches) and on unsupported browsers.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (process.env.NODE_ENV !== "production" || isLocalhost) {
      const shouldReloadAfterCleanup = isLocalhost && Boolean(navigator.serviceWorker.controller);

      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        )
        .then(() =>
          "caches" in window
            ? caches
                .keys()
                .then((keys) =>
                  Promise.all(
                    keys
                      .filter((key) => key.startsWith("sv-"))
                      .map((key) => caches.delete(key))
                  )
                )
            : undefined
        )
        .then(() => {
          if (!shouldReloadAfterCleanup) return;
          if (sessionStorage.getItem("sv-sw-local-cleaned") === "1") return;
          sessionStorage.setItem("sv-sw-local-cleaned", "1");
          window.location.reload();
        })
        .catch(() => {
          /* ignore cleanup errors */
        });
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((registration) => registration.update().catch(() => undefined))
        .catch(() => {
          /* ignore registration errors */
        });
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null;
}

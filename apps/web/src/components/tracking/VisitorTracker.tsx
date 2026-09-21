"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { hasAnalyticsConsent } from "@/lib/analytics";
import { useCookieConsent } from "@/components/layout/CookieConsent";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const SESSION_KEY = "sv-visitor-session";

async function post(path: string, body: object) {
  if (!hasAnalyticsConsent()) return;
  try {
    await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch { /* Optional measurement must not interrupt navigation. */ }
}

export default function VisitorTracker() {
  const consent = useCookieConsent();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const landingPage = useRef(pathname);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "accepted") {
      // The server snapshot is null until the client reads a saved choice.
      if (hasAnalyticsConsent()) return;
      setSessionId(null);
      lastPage.current = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage may be unavailable. */ }
      return;
    }
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setSessionId(stored);
        return;
      }
    } catch { /* An in-memory session still works when storage is unavailable. */ }

    const controller = new AbortController();
    let active = true;
    async function initialise() {
      try {
        const response = await fetch(`${API_BASE}/tracking/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referrer: document.referrer ? new URL(document.referrer).origin : undefined,
            landingPage: landingPage.current ?? undefined,
            screenWidth: window.screen.width,
          }),
        });
        if (!response.ok) return;
        const result: unknown = await response.json();
        if (!active || !hasAnalyticsConsent() || !result || typeof result !== "object") return;
        const envelope = result as { success?: boolean; data?: { sessionId?: unknown } };
        const id = envelope.data?.sessionId;
        if (envelope.success !== true || typeof id !== "string" || !id) return;
        setSessionId(id);
        try { sessionStorage.setItem(SESSION_KEY, id); } catch { /* Keep the in-memory session. */ }
      } catch { /* A failed or cancelled session request is not a customer error. */ }
    }
    void initialise();
    return () => {
      active = false;
      controller.abort();
    };
  }, [consent]);

  useEffect(() => {
    if (consent !== "accepted" || !sessionId) return;
    const heartbeat = setInterval(() => {
      if (document.visibilityState === "visible") {
        void post("/tracking/heartbeat", { sessionId });
      }
    }, 30000);
    const onExit = () => { void post("/tracking/exit", { sessionId }); };
    window.addEventListener("pagehide", onExit);
    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("pagehide", onExit);
    };
  }, [consent, sessionId]);

  useEffect(() => {
    if (consent !== "accepted" || !sessionId || !pathname) return;
    const key = `${sessionId}:${pathname}`;
    if (lastPage.current === key) return;
    lastPage.current = key;
    void post("/tracking/event", {
      sessionId,
      type: "page_view",
      page: pathname,
      metadata: {},
    });
  }, [consent, pathname, sessionId]);

  return null;
}

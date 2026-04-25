"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const SESSION_KEY = "sv-visitor-session";

async function post(path: string, body: object) {
  try {
    await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {}
}

export default function VisitorTracker() {
  const sessionId = useRef<string | null>(null);
  const pathname = usePathname();
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      sessionId.current = stored;
      return;
    }

    // Init session
    post("/tracking/session", {
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
      landingPage: pathname,
      screenWidth: window.screen.width,
    }).then(async (res) => {
      // We need the response for the session ID — refetch with response capture
    });

    // Use fetch directly for init to capture sessionId
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/tracking/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referrer: document.referrer || null,
            landingPage: pathname,
            screenWidth: window.screen.width,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const sid = data?.sessionId ?? data?.id ?? null;
          if (sid) {
            sessionId.current = sid;
            sessionStorage.setItem(SESSION_KEY, sid);
          }
        }
      } catch {}
    })();

    // Heartbeat every 30s
    heartbeatRef.current = setInterval(() => {
      if (sessionId.current) post("/tracking/heartbeat", { sessionId: sessionId.current });
    }, 30000);

    // Exit beacon
    function onExit() {
      if (sessionId.current) post("/tracking/exit", { sessionId: sessionId.current });
    }
    window.addEventListener("beforeunload", onExit);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      window.removeEventListener("beforeunload", onExit);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page view on route change
  useEffect(() => {
    if (!sessionId.current) return;
    post("/tracking/event", {
      sessionId: sessionId.current,
      type: "PAGE_VIEW",
      page: pathname,
      element: null,
      metadata: {},
    });
  }, [pathname]);

  return null;
}

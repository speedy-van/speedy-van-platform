"use client";

import { getApiBaseUrl } from "@/lib/api-base";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isPublicAnalyticsPath } from "@/lib/analytics";
import { useCookieConsent } from "@/components/layout/CookieConsent";

const API_BASE = getApiBaseUrl();

const SESSION_KEY = "sv-visitor-session";
const HEARTBEAT_MS = 30_000;

type TrackingResult = {
  ok: boolean;
  missingSession: boolean;
};

function storedSessionId(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function saveSessionId(sessionId: string): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    // In-memory tracking still works when storage is unavailable.
  }
}

function clearStoredSession(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Optional measurement storage must never block consent changes.
  }
}

async function postTracking(path: string, body: object, signal?: AbortSignal): Promise<TrackingResult> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: signal ? false : true,
      signal,
    });
    return { ok: response.ok, missingSession: response.status === 404 };
  } catch {
    return { ok: false, missingSession: false };
  }
}

function readSessionResponse(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const envelope = value as { success?: unknown; data?: { sessionId?: unknown } };
  const id = envelope.data?.sessionId;
  return envelope.success === true && typeof id === "string" && id ? id : null;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const consent = useCookieConsent();
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const enabledRef = useRef(false);
  const lastPage = useRef<string | null>(null);
  const landingPage = useRef<string | null>(null);
  const creatingSession = useRef<Promise<string | null> | null>(null);
  const isPublicPath = useMemo(() => Boolean(pathname && isPublicAnalyticsPath(pathname)), [pathname]);
  const enabled = consent === "accepted" && isPublicPath;

  const setSessionId = useCallback((nextSessionId: string | null) => {
    sessionIdRef.current = nextSessionId;
    setSessionIdState(nextSessionId);
  }, []);

  const clearSession = useCallback(() => {
    creatingSession.current = null;
    lastPage.current = null;
    clearStoredSession();
    setSessionId(null);
  }, [setSessionId]);

  const createSession = useCallback(
    async (forceNew = false, signal?: AbortSignal): Promise<string | null> => {
      if (!enabledRef.current) return null;

      if (!forceNew) {
        const current = sessionIdRef.current;
        if (current) return current;

        const stored = storedSessionId();
        if (stored) {
          setSessionId(stored);
          return stored;
        }
      }

      if (creatingSession.current) return creatingSession.current;

      const sessionPromise = (async () => {
        try {
          const response = await fetch(`${API_BASE}/tracking/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
              userAgent: navigator.userAgent,
              referrer: document.referrer ? new URL(document.referrer).origin : undefined,
              landingPage: landingPage.current ?? pathname ?? undefined,
              screenWidth: window.screen.width,
            }),
          });
          if (!response.ok) return null;
          const id = readSessionResponse(await response.json());
          if (!id || !enabledRef.current) return null;
          saveSessionId(id);
          setSessionId(id);
          return id;
        } catch {
          return null;
        } finally {
          creatingSession.current = null;
        }
      })();

      creatingSession.current = sessionPromise;
      return sessionPromise;
    },
    [pathname, setSessionId],
  );

  const replaceMissingSession = useCallback(
    async (previousSessionId: string): Promise<string | null> => {
      if (sessionIdRef.current === previousSessionId) {
        clearSession();
      }
      return createSession(true);
    },
    [clearSession, createSession],
  );

  const sendHeartbeat = useCallback(
    async (allowRecovery = true) => {
      const current = sessionIdRef.current;
      if (!current || !enabledRef.current || document.visibilityState !== "visible") return;
      const result = await postTracking("/tracking/heartbeat", { sessionId: current });
      if (result.missingSession && allowRecovery) {
        const recovered = await replaceMissingSession(current);
        if (recovered) await sendHeartbeat(false);
      }
    },
    [replaceMissingSession],
  );

  const trackPageView = useCallback(
    async (page: string, allowRecovery = true) => {
      const current = sessionIdRef.current;
      if (!current || !enabledRef.current) return;

      const key = `${current}:${page}`;
      if (lastPage.current === key) return;
      lastPage.current = key;

      const result = await postTracking("/tracking/event", {
        sessionId: current,
        type: "page_view",
        page,
        metadata: {},
      });
      if (result.missingSession && allowRecovery) {
        const recovered = await replaceMissingSession(current);
        if (recovered) {
          lastPage.current = null;
          await trackPageView(page, false);
        }
      }
    },
    [replaceMissingSession],
  );

  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled) {
      if (consent !== "accepted") clearSession();
      return;
    }

    if (!landingPage.current && pathname) landingPage.current = pathname;
    const controller = new AbortController();
    void createSession(false, controller.signal);

    return () => controller.abort();
  }, [clearSession, consent, createSession, enabled, pathname]);

  useEffect(() => {
    if (!enabled || !sessionId || !pathname) return;
    void trackPageView(pathname);
  }, [enabled, pathname, sessionId, trackPageView]);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const heartbeat = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_MS);

    const onExit = () => {
      const current = sessionIdRef.current;
      if (!current) return;
      void postTracking("/tracking/exit", { sessionId: current, sentAt: new Date().toISOString() });
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      void sendHeartbeat();
      if (pathname) void trackPageView(pathname);
    };

    window.addEventListener("pagehide", onExit);
    window.addEventListener("pageshow", onVisible);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener("pagehide", onExit);
      window.removeEventListener("pageshow", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, pathname, sendHeartbeat, sessionId, trackPageView]);

  return null;
}

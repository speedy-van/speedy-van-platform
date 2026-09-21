import { hasAnalyticsConsent } from "@/lib/analytics";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const SESSION_KEY = "sv-visitor-session";

export function trackClick(element: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  let sessionId: string | null = null;
  try {
    sessionId = window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return;
  }
  if (!sessionId) return;

  void fetch(`${API_BASE}/tracking/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      type: "click",
      page: window.location.pathname,
      element,
      metadata,
    }),
    keepalive: true,
  }).catch(() => { /* Optional measurement must not interrupt the action. */ });
}

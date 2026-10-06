import { getApiBaseUrl } from "@/lib/api-base";
import { hasAnalyticsConsent } from "@/lib/analytics";

const API_BASE = getApiBaseUrl();

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
  })
    .then((response) => {
      if (response.status === 404) {
        try {
          window.sessionStorage.removeItem(SESSION_KEY);
        } catch {
          // The next page view or heartbeat will recover the optional session.
        }
      }
    })
    .catch(() => { /* Optional measurement must not interrupt the action. */ });
}

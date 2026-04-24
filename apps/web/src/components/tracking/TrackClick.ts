const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

const SESSION_KEY = "sv-visitor-session";

export function trackClick(element: string, metadata: Record<string, unknown> = {}) {
  const sessionId =
    typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
  if (!sessionId) return;

  fetch(`${API_BASE}/tracking/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      type: "CLICK",
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      element,
      metadata,
    }),
    keepalive: true,
  }).catch(() => {});
}

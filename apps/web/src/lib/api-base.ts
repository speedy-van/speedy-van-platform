export const DEFAULT_API_BASE = "/api";

function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}

export function getApiBaseUrl(): string {
  const configured = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL?.trim() : undefined;
  if (configured && configured.startsWith("/") && !configured.startsWith("//")) {
    return withoutTrailingSlash(configured);
  }

  return DEFAULT_API_BASE;
}

export function getLocationUnavailableMessage(): string | null {
  if (typeof window === "undefined") return null;
  if (!window.isSecureContext && !isLoopbackHost(window.location.hostname)) {
    return "Location access needs HTTPS. Open the live site or use localhost while testing.";
  }
  if (!("geolocation" in navigator)) {
    return "Location access is not available in this browser.";
  }
  return null;
}

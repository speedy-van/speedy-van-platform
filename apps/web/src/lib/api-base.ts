export const DEFAULT_API_BASE = "https://api.speedyvan.uk";
const DEV_API_PORT = "4000";

function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

function isLocalNetworkHost(hostname: string): boolean {
  return isLoopbackHost(hostname) || isPrivateIpv4(hostname) || hostname.endsWith(".local");
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured) return withoutTrailingSlash(configured);

  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "development" ? `http://localhost:${DEV_API_PORT}` : DEFAULT_API_BASE;
  }

  if (process.env.NODE_ENV === "development") {
    const { hostname, protocol } = window.location;
    if (isLoopbackHost(hostname)) return `http://localhost:${DEV_API_PORT}`;
    if (protocol === "http:" && isLocalNetworkHost(hostname)) return `http://${hostname}:${DEV_API_PORT}`;
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

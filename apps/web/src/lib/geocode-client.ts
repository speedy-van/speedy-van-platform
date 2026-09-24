import { DEFAULT_API_BASE, getApiBaseUrl } from "./api-base";

export interface GeocodeResult {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

export type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

export interface DrivingRouteResult {
  distanceMiles: number;
  durationMinutes?: number;
  routeGeometry?: RouteGeometry;
}

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

const GEOCODE_ERROR_MESSAGE = "Address lookup is unavailable. Please type your address.";

function isLocalHostname(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]") {
    return true;
  }

  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)) {
    const [a, b] = parts;
    return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }

  return hostname.endsWith(".local");
}

function shouldUseDefaultFallback(primary: string): boolean {
  if (primary === DEFAULT_API_BASE) return false;

  try {
    if (isLocalHostname(new URL(primary).hostname)) return false;
  } catch {
    return false;
  }

  if (typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return false;
  }

  return true;
}

function geocodeBases(): string[] {
  const primary = getApiBaseUrl();
  return shouldUseDefaultFallback(primary) ? [primary, DEFAULT_API_BASE] : [primary];
}

async function fetchGeocode<T>(path: string, options?: RequestInit): Promise<T> {
  let lastError = GEOCODE_ERROR_MESSAGE;

  for (const base of geocodeBases()) {
    try {
      const res = await fetch(`${base}${path}`, { cache: "no-store", ...options });
      const json = (await res.json()) as ApiEnvelope<T>;
      if (res.ok && json.success && json.data !== undefined) return json.data;
      console.warn("Geocode request failed", {
        status: res.status,
        code: json?.code,
        error: json?.error,
      });
      lastError = GEOCODE_ERROR_MESSAGE;
    } catch (err) {
      console.warn("Geocode request failed", err);
      lastError = GEOCODE_ERROR_MESSAGE;
    }
  }

  throw new Error(lastError);
}

export function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  return fetchGeocode<GeocodeResult>(`/geocode/reverse?${params.toString()}`);
}

export async function searchAddresses(query: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({ q: query });
  const data = await fetchGeocode<{ results?: GeocodeResult[] }>(`/geocode/search?${params.toString()}`);
  return data.results ?? [];
}

function isRouteGeometry(value: unknown): value is RouteGeometry {
  if (!value || typeof value !== "object") return false;
  const geometry = value as { type?: unknown; coordinates?: unknown };
  return (
    geometry.type === "LineString" &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      (coordinate) =>
        Array.isArray(coordinate) &&
        coordinate.length >= 2 &&
        typeof coordinate[0] === "number" &&
        typeof coordinate[1] === "number",
    )
  );
}

export async function fetchDrivingRoute(pickup: GeocodeResult, dropoff: GeocodeResult): Promise<DrivingRouteResult | null> {
  const data = await fetchGeocode<{ distanceMiles?: number; durationMinutes?: number; routeGeometry?: unknown }>("/geocode/directions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropoffLat: dropoff.lat,
      dropoffLng: dropoff.lng,
    }),
  });

  if (typeof data.distanceMiles !== "number") return null;

  return {
    distanceMiles: data.distanceMiles,
    durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : undefined,
    routeGeometry: isRouteGeometry(data.routeGeometry) ? data.routeGeometry : undefined,
  };
}

export async function fetchDrivingDistanceMiles(pickup: GeocodeResult, dropoff: GeocodeResult): Promise<number | null> {
  const route = await fetchDrivingRoute(pickup, dropoff);
  return route?.distanceMiles ?? null;
}

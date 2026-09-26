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

async function fetchGeocode<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`/api${path}`, { cache: "no-store", ...options });
    const json = (await res.json()) as ApiEnvelope<T>;
    if (res.ok && json.success && json.data !== undefined) return json.data;
    console.warn("Geocode request failed", {
      status: res.status,
      code: json?.code,
      error: json?.error,
    });
  } catch (err) {
    console.warn("Geocode request failed", err);
  }

  throw new Error(GEOCODE_ERROR_MESSAGE);
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

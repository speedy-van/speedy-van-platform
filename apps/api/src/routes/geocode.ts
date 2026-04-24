import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  GeocodeSearchSchema,
  DirectionsSchema,
  ok,
  fail,
  type GeocodeResult,
  type DirectionsResult,
} from "@speedy-van/shared";

const app = new Hono();

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.warn("[geocode] MAPBOX_TOKEN not set; geocoding endpoints will return 503.");
}

app.get("/search", zValidator("query", GeocodeSearchSchema), async (c) => {
  if (!MAPBOX_TOKEN) {
    return c.json(fail("Geocoding not configured", "MAPBOX_NOT_CONFIGURED"), 503);
  }
  const { q } = c.req.valid("query");
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
    `?country=gb&types=address,postcode,place&limit=5&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return c.json(fail("Geocoding failed", "MAPBOX_ERROR"), 502);
    const json = (await res.json()) as {
      features?: { place_name?: string; center?: [number, number]; context?: { id: string; text: string }[] }[];
    };
    const results: GeocodeResult[] =
      json.features?.map((f) => {
        const postcodeCtx = f.context?.find((c) => c.id.startsWith("postcode"));
        return {
          address: f.place_name ?? "",
          postcode: postcodeCtx?.text ?? "",
          lat: f.center?.[1] ?? 0,
          lng: f.center?.[0] ?? 0,
        };
      }) ?? [];
    return c.json(ok({ results }));
  } catch (err) {
    console.error("[geocode/search]", err);
    return c.json(fail("Geocoding error", "MAPBOX_ERROR"), 502);
  }
});

app.post("/directions", zValidator("json", DirectionsSchema), async (c) => {
  if (!MAPBOX_TOKEN) {
    return c.json(fail("Directions not configured", "MAPBOX_NOT_CONFIGURED"), 503);
  }
  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = c.req.valid("json");
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}` +
    `?geometries=geojson&overview=simplified&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return c.json(fail("Directions failed", "MAPBOX_ERROR"), 502);
    const json = (await res.json()) as {
      routes?: { distance: number; duration: number; geometry?: unknown }[];
    };
    const route = json.routes?.[0];
    if (!route) return c.json(fail("No route found", "NO_ROUTE"), 404);
    const result: DirectionsResult = {
      distanceMiles: route.distance / 1609.344,
      durationMinutes: route.duration / 60,
      routeGeometry: route.geometry,
    };
    return c.json(ok(result));
  } catch (err) {
    console.error("[geocode/directions]", err);
    return c.json(fail("Directions error", "MAPBOX_ERROR"), 502);
  }
});

export default app;

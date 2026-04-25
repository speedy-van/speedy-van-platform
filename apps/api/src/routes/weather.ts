import { Hono } from "hono";
import { ok, fail } from "@speedy-van/shared";
import { getWeatherForecast } from "../services/weather.service.js";

const app = new Hono();

/**
 * Public weather snapshot for a coordinate. Used by the booking UI to show
 * a friendly warning chip ("Heavy rain expected on your selected day") so
 * customers aren't surprised by the small weather surcharge.
 *
 * GET /weather/forecast?lat=&lng=
 */
app.get("/forecast", async (c) => {
  const lat = Number(c.req.query("lat"));
  const lng = Number(c.req.query("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return c.json(fail("Invalid coordinates", "INVALID_COORDS"), 400);
  }
  const result = await getWeatherForecast(lat, lng);
  if (!result) {
    // Return ok with null so the client can simply hide the chip.
    return c.json(ok({ available: false, condition: null, description: null, iconUrl: null }));
  }
  return c.json(ok({ available: true, ...result }));
});

export default app;

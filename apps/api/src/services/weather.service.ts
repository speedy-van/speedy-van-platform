// OpenWeatherMap 5-day forecast → surcharge mapping.
// Gracefully no-ops (returns 0) when OPENWEATHER_API_KEY is missing or the
// upstream call fails.

type WeatherCondition = "clear" | "rain" | "heavy_rain" | "snow" | "storm";

function mapWeatherIdToCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return "storm";       // thunderstorm
  if (id >= 300 && id < 500) return "rain";        // drizzle
  if (id >= 500 && id < 600) {
    if (id === 502 || id === 503 || id === 504) return "heavy_rain";
    return "rain";
  }
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "rain";        // atmosphere (fog/mist) — minor surcharge
  if (id === 800) return "clear";
  return "clear";
}

export async function getWeatherSurcharge(
  lat: number,
  lng: number,
  configValues: Record<string, Record<string, number>>,
): Promise<number> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return 0;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return 0;
    const json = (await res.json()) as { weather?: { id: number }[] };
    const id = json.weather?.[0]?.id;
    if (typeof id !== "number") return 0;
    const condition = mapWeatherIdToCondition(id);
    return configValues["weather"]?.[condition] ?? 0;
  } catch {
    return 0;
  }
}

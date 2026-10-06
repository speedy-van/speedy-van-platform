// OpenWeatherMap 5-day forecast -> surcharge mapping.
// Gracefully no-ops when OPENWEATHER_API_KEY is missing or the upstream call
// fails. Forecast responses are cached by rounded coordinates for 30 minutes.

export type WeatherCondition = "clear" | "rain" | "heavy_rain" | "snow" | "storm";

type ForecastDay = {
  condition: WeatherCondition;
  description: string;
  icon: string | null;
};

type ForecastCacheEntry = {
  loadedAt: number;
  days: Map<string, ForecastDay>;
};

const FORECAST_CACHE_TTL_MS = 30 * 60 * 1000;
const forecastCache = new Map<string, ForecastCacheEntry>();
const londonForecastDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function mapWeatherIdToCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return "storm"; // thunderstorm
  if (id >= 300 && id < 500) return "rain"; // drizzle
  if (id >= 500 && id < 600) {
    if (id === 502 || id === 503 || id === 504) return "heavy_rain";
    return "rain";
  }
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "rain"; // atmosphere (fog/mist)
  if (id === 800) return "clear";
  return "clear";
}

function conditionSeverity(condition: WeatherCondition): number {
  if (condition === "storm") return 5;
  if (condition === "snow") return 4;
  if (condition === "heavy_rain") return 3;
  if (condition === "rain") return 2;
  return 1;
}

function roundedCoordinate(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function forecastCacheKey(lat: number, lng: number): string {
  return `${roundedCoordinate(lat)},${roundedCoordinate(lng)}`;
}

function londonIsoDate(timestampMs: number): string {
  const parts = Object.fromEntries(londonForecastDate.formatToParts(new Date(timestampMs)).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function weatherAmount(
  configValues: Record<string, Record<string, number>>,
  condition: WeatherCondition,
): number {
  const amount = configValues["weather"]?.[condition] ?? 0;
  return Number.isFinite(amount) ? amount : 0;
}

function pickMoreSevere(existing: ForecastDay | undefined, next: ForecastDay): ForecastDay {
  if (!existing) return next;
  return conditionSeverity(next.condition) > conditionSeverity(existing.condition) ? next : existing;
}

async function readForecast(lat: number, lng: number): Promise<Map<string, ForecastDay>> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return new Map();

  const cacheKey = forecastCacheKey(lat, lng);
  const cached = forecastCache.get(cacheKey);
  if (cached && Date.now() - cached.loadedAt < FORECAST_CACHE_TTL_MS) {
    return new Map(cached.days);
  }

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 3000);

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${encodeURIComponent(key)}&units=metric`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      console.warn("[weather] forecast request failed", { status: res.status, lat: roundedCoordinate(lat), lng: roundedCoordinate(lng) });
      return new Map();
    }

    const json = (await res.json()) as {
      list?: {
        dt?: number;
        weather?: { id?: number; description?: string; icon?: string }[];
      }[];
    };
    const days = new Map<string, ForecastDay>();
    for (const item of json.list ?? []) {
      if (typeof item.dt !== "number") continue;
      const weather = item.weather?.[0];
      if (typeof weather?.id !== "number") continue;
      const condition = mapWeatherIdToCondition(weather.id);
      const day = londonIsoDate(item.dt * 1000);
      days.set(day, pickMoreSevere(days.get(day), {
        condition,
        description: weather.description ?? condition,
        icon: weather.icon ?? null,
      }));
    }

    forecastCache.set(cacheKey, { loadedAt: Date.now(), days });
    return new Map(days);
  } catch (error) {
    console.warn("[weather] forecast request failed", {
      lat: roundedCoordinate(lat),
      lng: roundedCoordinate(lng),
      error: error instanceof Error ? error.message : String(error),
    });
    return new Map();
  } finally {
    clearTimeout(timeout);
  }
}

export function clearWeatherForecastCache(): void {
  forecastCache.clear();
}

export async function getWeatherSurchargesByDate(
  lat: number,
  lng: number,
  configValues: Record<string, Record<string, number>>,
): Promise<Map<string, number>> {
  const forecast = await readForecast(lat, lng);
  const surcharges = new Map<string, number>();
  for (const [date, day] of forecast) {
    const amount = weatherAmount(configValues, day.condition);
    if (amount > 0) surcharges.set(date, amount);
  }
  return surcharges;
}

/**
 * Lightweight forecast lookup used by the public /weather/forecast route.
 * Returns null when the API key is absent so the UI can hide the warning chip.
 */
export async function getWeatherForecast(
  lat: number,
  lng: number,
): Promise<{ condition: WeatherCondition; description: string; iconUrl: string | null } | null> {
  const forecast = await readForecast(lat, lng);
  const days = Array.from(forecast.values());
  if (days.length === 0) return null;
  const strongest = days.reduce((best, day) => pickMoreSevere(best, day));
  return {
    condition: strongest.condition,
    description: strongest.description,
    iconUrl: strongest.icon ? `https://openweathermap.org/img/wn/${strongest.icon}@2x.png` : null,
  };
}

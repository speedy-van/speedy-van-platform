// Pricing engine.
//
// Reads pricing values from the DB-backed PricingConfig table (with a 5-minute
// in-memory cache) and falls back to DEFAULT_PRICING_CONFIG when a key is missing.

import { db } from "@speedy-van/db";
import {
  DEFAULT_PRICING_CONFIG,
  type PricingConfigCategory,
} from "@speedy-van/config";
import {
  type PriceTier,
  type PricingResult,
  type PriceLineItem,
  type DayPrice,
  TIME_SLOTS,
  CURRENCY,
  type PricingCalculateInput,
} from "@speedy-van/shared";
import { getWeatherSurcharge } from "./weather.service";

type ConfigCache = { values: Record<string, Record<string, number>>; loadedAt: number };
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: ConfigCache | null = null;

async function loadConfig(): Promise<Record<string, Record<string, number>>> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) return cache.values;

  const rows = await db.pricingConfig.findMany().catch(() => []);
  const values: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    if (!values[row.category]) values[row.category] = {};
    values[row.category]![row.key] = row.value;
  }
  cache = { values, loadedAt: Date.now() };
  return values;
}

export function clearPricingCache(): void {
  cache = null;
}

function readConfig(
  values: Record<string, Record<string, number>>,
  category: PricingConfigCategory,
  key: string,
): number {
  const dbValue = values[category]?.[key];
  if (typeof dbValue === "number") return dbValue;
  const defaults = DEFAULT_PRICING_CONFIG[category] as Record<string, number>;
  return defaults[key] ?? 0;
}

function isWeekend(date: Date): boolean {
  const d = date.getUTCDay();
  return d === 0 || d === 6;
}
function isPeakMonth(date: Date): boolean {
  const m = date.getUTCMonth(); // 0-based
  return m >= 5 && m <= 7; // Jun(5), Jul(6), Aug(7)
}
function isEndOfMonth(date: Date): boolean {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  const lastDay = new Date(next.getTime() - 86_400_000).getUTCDate();
  return date.getUTCDate() >= lastDay - 2;
}
function daysFromToday(date: Date, today: Date): number {
  const a = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const b = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((a - b) / 86_400_000);
}

function urgencyMultiplier(values: Record<string, Record<string, number>>, days: number): number {
  if (days <= 0) return readConfig(values, "urgency", "todayMultiplier");
  if (days === 1) return readConfig(values, "urgency", "tomorrowMultiplier");
  if (days === 2) return readConfig(values, "urgency", "twoDaysMultiplier");
  return 1.0;
}
function slotMultiplier(values: Record<string, Record<string, number>>, slot: string): number {
  if (slot === "morning") return readConfig(values, "slot", "morningMultiplier");
  if (slot === "evening") return readConfig(values, "slot", "eveningMultiplier");
  return readConfig(values, "slot", "afternoonMultiplier");
}
function variantMultiplier(values: Record<string, Record<string, number>>, variant?: string): number {
  if (!variant) return 1.0;
  const v = variant.toLowerCase();
  const map: Record<string, string> = {
    "1-bedroom": "bedroom1Multiplier",
    "2-bedroom": "bedroom2Multiplier",
    "3-bedroom": "bedroom3Multiplier",
    "4-bedroom": "bedroom4Multiplier",
    "5-bedroom": "bedroom5PlusMultiplier",
    "5+-bedroom": "bedroom5PlusMultiplier",
    "small-business": "businessSmallMultiplier",
    "medium-business": "businessMediumMultiplier",
    "large-business": "businessLargeMultiplier",
  };
  const key = map[v];
  return key ? readConfig(values, "variant", key) : 1.0;
}

function computeDistanceCost(values: Record<string, Record<string, number>>, miles: number): number {
  const free = readConfig(values, "distance", "freeMiles");
  const rate = readConfig(values, "distance", "perMileRate");
  const discountStart = readConfig(values, "distance", "longDistanceDiscountStart");
  const discountFactor = readConfig(values, "distance", "longDistanceDiscountFactor");
  const billable = Math.max(0, miles - free);
  if (billable <= discountStart) return billable * rate;
  return discountStart * rate + (billable - discountStart) * rate * discountFactor;
}

function computeFloorCost(
  values: Record<string, Record<string, number>>,
  floor: number,
  hasLift: boolean,
): number {
  if (floor <= 0) return 0;
  const per = readConfig(values, "floor", "perFloorSurcharge");
  const noLift = readConfig(values, "floor", "noLiftPenaltyMultiplier");
  const base = floor * per;
  return hasLift ? base : base * (noLift || 1);
}

function computeAddons(
  values: Record<string, Record<string, number>>,
  helpersCount: number,
  needsPacking: boolean,
  needsAssembly: boolean,
): { lineItems: PriceLineItem[]; total: number } {
  const lineItems: PriceLineItem[] = [];
  let total = 0;
  if (helpersCount > 0) {
    const perHelper = readConfig(values, "addon", "helperPerHourPerHelper");
    const cost = helpersCount * perHelper;
    lineItems.push({ label: `${helpersCount} extra helper(s)`, amount: cost, type: "addon" });
    total += cost;
  }
  if (needsPacking) {
    const cost = readConfig(values, "addon", "packingFlat");
    lineItems.push({ label: "Packing service", amount: cost, type: "addon" });
    total += cost;
  }
  if (needsAssembly) {
    const cost = readConfig(values, "addon", "assemblyFlat");
    lineItems.push({ label: "Assembly service", amount: cost, type: "addon" });
    total += cost;
  }
  return { lineItems, total };
}

function tierFor(price: number, sorted: number[]): PriceTier {
  if (sorted.length === 0) return "yellow";
  const third = Math.floor(sorted.length / 3);
  const lowCutoff = sorted[third] ?? sorted[0]!;
  const highCutoff = sorted[Math.max(0, sorted.length - third - 1)] ?? sorted[sorted.length - 1]!;
  if (price <= lowCutoff) return "green";
  if (price >= highCutoff) return "red";
  return "yellow";
}

export async function calculatePrice(input: PricingCalculateInput): Promise<PricingResult> {
  const values = await loadConfig();

  // Static (date-independent) line items first
  const base = readConfig(values, "base", "serviceBasePrice");
  const variantMul = variantMultiplier(values, input.serviceVariant);
  const baseAdjusted = Math.round(base * variantMul * 100) / 100;

  const distanceCost = Math.round(computeDistanceCost(values, input.distanceMiles) * 100) / 100;
  const pickupFloorCost = Math.round(
    computeFloorCost(values, input.pickupFloor, input.pickupHasLift) * 100,
  ) / 100;
  const dropoffFloorCost = Math.round(
    computeFloorCost(values, input.dropoffFloor, input.dropoffHasLift) * 100,
  ) / 100;

  const addons = computeAddons(
    values,
    input.helpersCount,
    input.needsPacking,
    input.needsAssembly,
  );

  // Weather surcharge (best-effort)
  const weatherSurcharge =
    input.pickupLat !== undefined && input.pickupLng !== undefined
      ? await getWeatherSurcharge(input.pickupLat, input.pickupLng, values)
      : 0;

  const staticLineItems: PriceLineItem[] = [
    { label: "Base service", amount: baseAdjusted, type: "base" },
    { label: `Distance (${input.distanceMiles.toFixed(1)} mi)`, amount: distanceCost, type: "surcharge" },
    ...(pickupFloorCost > 0
      ? [
          {
            label: `Pickup floor ${input.pickupFloor}${input.pickupHasLift ? " (lift)" : " (no lift)"}`,
            amount: pickupFloorCost,
            type: "surcharge" as const,
          },
        ]
      : []),
    ...(dropoffFloorCost > 0
      ? [
          {
            label: `Dropoff floor ${input.dropoffFloor}${input.dropoffHasLift ? " (lift)" : " (no lift)"}`,
            amount: dropoffFloorCost,
            type: "surcharge" as const,
          },
        ]
      : []),
    ...addons.lineItems,
    ...(weatherSurcharge > 0
      ? [{ label: "Weather surcharge", amount: weatherSurcharge, type: "surcharge" as const }]
      : []),
  ];

  const staticSubtotal =
    Math.round(
      (baseAdjusted + distanceCost + pickupFloorCost + dropoffFloorCost + addons.total + weatherSurcharge) * 100,
    ) / 100;

  // 14-day x 3-slot price calendar
  const today = new Date();
  const days: DayPrice[] = [];
  const allPrices: number[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + i));
    const urgency = urgencyMultiplier(values, daysFromToday(d, today));
    const weekend = isWeekend(d) ? readConfig(values, "weekend", "multiplier") : 1.0;
    const peak = isPeakMonth(d) ? readConfig(values, "season", "peakMonthMultiplier") : 1.0;
    const eom = isEndOfMonth(d) ? readConfig(values, "season", "endOfMonthMultiplier") : 1.0;

    const slots = TIME_SLOTS.map((slot) => {
      const slotMul = slotMultiplier(values, slot);
      const total = Math.round(staticSubtotal * urgency * weekend * peak * eom * slotMul * 100) / 100;
      allPrices.push(total);
      return { slot, price: total, tier: "yellow" as PriceTier };
    });

    days.push({ date: d.toISOString().slice(0, 10), slots });
  }

  // Apply tier coloring across all 42 prices
  const sorted = [...allPrices].sort((a, b) => a - b);
  for (const day of days) {
    for (const slot of day.slots) {
      slot.tier = tierFor(slot.price, sorted);
    }
  }

  return {
    days,
    staticLineItems,
    staticSubtotal,
    currency: CURRENCY.code,
    symbol: CURRENCY.symbol,
  };
}

// Used by booking creation to verify the client-supplied total against a server
// recomputation for a specific date+slot.
export async function calculatePriceForSlot(
  input: PricingCalculateInput,
  date: Date,
  slot: "morning" | "afternoon" | "evening",
): Promise<number> {
  const result = await calculatePrice(input);
  const iso = date.toISOString().slice(0, 10);
  const day = result.days.find((d) => d.date === iso);
  const slotPrice = day?.slots.find((s) => s.slot === slot)?.price;
  return slotPrice ?? result.staticSubtotal;
}

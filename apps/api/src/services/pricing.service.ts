// Pricing engine.
//
// Reads pricing values from the DB-backed PricingConfig table (with a 5-minute
// in-memory cache). Documented defaults apply only to missing keys after a
// successful configuration read, never to a database outage.

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
  PRICE_TIER,
  computeTotalVolumeM3,
} from "@speedy-van/shared";
import { getWeatherSurchargesByDate } from "./weather.service";
import { issueQuoteToken } from "../lib/quote-token";

const CALENDAR_DAYS = 14;

type ConfigCache = { values: Record<string, Record<string, number>>; loadedAt: number };
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: ConfigCache | null = null;
const londonCalendarDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function currentBookingDate(now: Date): Date {
  const parts = Object.fromEntries(londonCalendarDate.formatToParts(now).map((part) => [part.type, part.value]));
  // Represent the London civil date at UTC midnight for date-only arithmetic.
  // This is not a conversion of the actual London midnight instant.
  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
}

async function loadConfig(): Promise<Record<string, Record<string, number>>> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) return cache.values;

  const rows = await db.pricingConfig.findMany().catch((cause: unknown) => {
    throw new Error("PRICING_CONFIG_UNAVAILABLE", { cause });
  });

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
const SERVICE_BASE_PRICE_KEY: Record<string, string> = {
  "house-removals": "houseRemovalsBasePrice",
  "house-removal": "houseRemovalsBasePrice",
  "long-distance-removals": "houseRemovalsBasePrice",
  "furniture": "furnitureBasePrice",
  "furniture-delivery": "furnitureBasePrice",
  "storage": "storageBasePrice",
  "office": "officeBasePrice",
  "office-removal": "officeBasePrice",
  "other": "otherBasePrice",
  "man-and-van": "otherBasePrice",
  "flat-removals": "otherBasePrice",
  "small-moves": "otherBasePrice",
  "student-move": "studentMoveBasePrice",
  "ikea-delivery": "ikeaDeliveryBasePrice",
  "rubbish-removal": "rubbishRemovalBasePrice",
  "piano-moving": "pianoMovingBasePrice",
  "same-day-delivery": "sameDayDeliveryBasePrice",
  "packing-service": "packingServiceBasePrice",
};

function serviceBasePrice(values: Record<string, Record<string, number>>, serviceType: string): number {
  const key = SERVICE_BASE_PRICE_KEY[serviceType] ?? "serviceBasePrice";
  return readConfig(values, "base", key);
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

function selectedItemMetrics(selectedItems: PricingCalculateInput["selectedItems"]): { totalQuantity: number; totalVolumeM3: number } {
  const items = (selectedItems ?? []).filter((item) => Number.isInteger(item.quantity) && item.quantity > 0);
  return {
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalVolumeM3: computeTotalVolumeM3(items),
  };
}

function computeStandardDistanceCost(values: Record<string, Record<string, number>>, miles: number): number {
  const free = readConfig(values, "distance", "freeMiles");
  const rate = readConfig(values, "distance", "perMileRate");
  const discountStart = readConfig(values, "distance", "longDistanceDiscountStart");
  const discountFactor = readConfig(values, "distance", "longDistanceDiscountFactor");
  const billable = Math.max(0, miles - free);
  if (billable <= discountStart) return billable * rate;
  return discountStart * rate + (billable - discountStart) * rate * discountFactor;
}

function computeLargeInventoryDistanceCost(
  values: Record<string, Record<string, number>>,
  miles: number,
  totalQuantity: number,
): number {
  const tenMilePrice = readConfig(values, "inventoryDistance", "tenMilePrice");
  const twentyMilePrice = readConfig(values, "inventoryDistance", "twentyMilePrice");
  const thirtyMilePrice = readConfig(values, "inventoryDistance", "thirtyMilePrice");

  let base = 0;
  if (miles <= 0) {
    base = 0;
  } else if (miles <= 10) {
    base = tenMilePrice;
  } else if (miles <= 20) {
    base = tenMilePrice + ((miles - 10) / 10) * (twentyMilePrice - tenMilePrice);
  } else if (miles <= 30) {
    base = twentyMilePrice + ((miles - 20) / 10) * (thirtyMilePrice - twentyMilePrice);
  } else {
    const postThirtyRate = (thirtyMilePrice - twentyMilePrice) / 10;
    base = thirtyMilePrice + (miles - 30) * postThirtyRate;
  }

  const baseItemCount = readConfig(values, "inventoryDistance", "baseItemCount");
  const extraItemStep = readConfig(values, "inventoryDistance", "extraItemMultiplierStep");
  const extraItemCap = readConfig(values, "inventoryDistance", "extraItemMultiplierCap");
  const extraItemUplift = Math.min(Math.max(0, totalQuantity - baseItemCount) * extraItemStep, extraItemCap);
  return base * (1 + extraItemUplift);
}

function computeDistanceCost(
  values: Record<string, Record<string, number>>,
  miles: number,
  selectedItems: PricingCalculateInput["selectedItems"],
): number {
  const standardCost = computeStandardDistanceCost(values, miles);
  const { totalQuantity, totalVolumeM3 } = selectedItemMetrics(selectedItems);
  const itemThreshold = readConfig(values, "inventoryDistance", "largeItemThreshold");
  const volumeThreshold = readConfig(values, "inventoryDistance", "largeVolumeM3Threshold");

  if (totalQuantity <= itemThreshold || totalVolumeM3 < volumeThreshold) {
    return standardCost;
  }

  return Math.max(
    standardCost,
    computeLargeInventoryDistanceCost(values, miles, totalQuantity),
  );
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

const FREE_CARRY_METRES = 10;

function computeAccessCost(
  values: Record<string, Record<string, number>>,
  pickupCarryMetres: number,
  dropoffCarryMetres: number,
  hasNarrowAccess: boolean,
  hasPermitZone: boolean,
): { lineItems: PriceLineItem[]; total: number } {
  const lineItems: PriceLineItem[] = [];
  let total = 0;

  const perMetre = readConfig(values, "access", "carryPerMetreRate") || 0.5;
  const narrowFlat = readConfig(values, "access", "narrowAccessFlat") || 25;
  const permitFlat = readConfig(values, "access", "permitZoneFlat") || 20;

  const pickupBillableMetres = Math.max(0, pickupCarryMetres - FREE_CARRY_METRES);
  if (pickupBillableMetres > 0) {
    const cost = Math.round(pickupBillableMetres * perMetre * 100) / 100;
    lineItems.push({ label: `Pickup carry (${pickupCarryMetres}m from parking)`, amount: cost, type: "surcharge" });
    total += cost;
  }

  const dropoffBillableMetres = Math.max(0, dropoffCarryMetres - FREE_CARRY_METRES);
  if (dropoffBillableMetres > 0) {
    const cost = Math.round(dropoffBillableMetres * perMetre * 100) / 100;
    lineItems.push({ label: `Dropoff carry (${dropoffCarryMetres}m from parking)`, amount: cost, type: "surcharge" });
    total += cost;
  }

  if (hasNarrowAccess) {
    lineItems.push({ label: "Narrow access", amount: narrowFlat, type: "surcharge" });
    total += narrowFlat;
  }

  if (hasPermitZone) {
    lineItems.push({ label: "Permit zone parking", amount: permitFlat, type: "surcharge" });
    total += permitFlat;
  }

  return { lineItems, total };
}

function computeInventoryCost(
  values: Record<string, Record<string, number>>,
  selectedItems: PricingCalculateInput["selectedItems"],
): { lineItems: PriceLineItem[]; total: number } {
  const items = (selectedItems ?? []).filter((item) => Number.isInteger(item.quantity) && item.quantity > 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity <= 0) return { lineItems: [], total: 0 };

  const totalVolumeM3 = computeTotalVolumeM3(items);
  const includedItems = readConfig(values, "inventory", "includedItems");
  const includedVolumeM3 = readConfig(values, "inventory", "includedVolumeM3");
  const perItemRate = readConfig(values, "inventory", "perItemRate");
  const perCubicMetreRate = readConfig(values, "inventory", "perCubicMetreRate");
  const billableItems = Math.max(0, totalQuantity - includedItems);
  const billableVolumeM3 = Math.max(0, totalVolumeM3 - includedVolumeM3);
  const standardTotal = billableItems * perItemRate + billableVolumeM3 * perCubicMetreRate;

  const largeItemThreshold = readConfig(values, "largeInventory", "itemThreshold");
  const largeVolumeThreshold = readConfig(values, "largeInventory", "volumeM3Threshold");
  const isLargeInventory = totalQuantity > largeItemThreshold && totalVolumeM3 >= largeVolumeThreshold;
  const largeTotal = isLargeInventory
    ? Math.max(
        readConfig(values, "largeInventory", "minimumLoadCharge"),
        totalQuantity * readConfig(values, "largeInventory", "perItemRate") +
          totalVolumeM3 * readConfig(values, "largeInventory", "perCubicMetreRate"),
      )
    : 0;
  const total = Math.round(Math.max(standardTotal, largeTotal) * 100) / 100;

  if (total <= 0) return { lineItems: [], total: 0 };

  const volumeLabel = totalVolumeM3 >= 1 ? totalVolumeM3.toFixed(1) : totalVolumeM3.toFixed(2);
  return {
    lineItems: [{
      label: `Inventory (${totalQuantity} item${totalQuantity === 1 ? "" : "s"}, ${volumeLabel} m3)`,
      amount: total,
      type: "surcharge",
    }],
    total,
  };
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
  if (sorted.length === 0) return PRICE_TIER.STANDARD;
  const third = Math.floor(sorted.length / 3);
  const lowCutoff = sorted[third] ?? sorted[0]!;
  const highCutoff = sorted[Math.max(0, sorted.length - third - 1)] ?? sorted[sorted.length - 1]!;
  if (price <= lowCutoff) return PRICE_TIER.GREEN;
  if (price >= highCutoff) return PRICE_TIER.RED;
  return PRICE_TIER.STANDARD;
}

export async function calculatePrice(input: PricingCalculateInput): Promise<PricingResult> {
  const values = await loadConfig();

  // Static (date-independent) line items first
  const base = serviceBasePrice(values, input.serviceType);
  const variantMul = variantMultiplier(values, input.serviceVariant);
  const baseAdjusted = Math.round(base * variantMul * 100) / 100;

  const distanceCost = Math.round(computeDistanceCost(values, input.distanceMiles, input.selectedItems) * 100) / 100;
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

  const access = computeAccessCost(
    values,
    input.pickupCarryMetres ?? 0,
    input.dropoffCarryMetres ?? 0,
    input.hasNarrowAccess ?? false,
    input.hasPermitZone ?? false,
  );
  const inventory = computeInventoryCost(values, input.selectedItems);

  // Weather surcharge (best-effort, per forecast date)
  const weatherSurcharges =
    input.pickupLat !== undefined && input.pickupLng !== undefined
      ? await getWeatherSurchargesByDate(input.pickupLat, input.pickupLng, values)
      : new Map<string, number>();

  const staticLineItems: PriceLineItem[] = [
    { label: "Base service", amount: baseAdjusted, type: "base" },
    { label: `Distance (${input.distanceMiles.toFixed(1)} mi)`, amount: distanceCost, type: "surcharge" },
    ...(pickupFloorCost > 0
      ? [{ label: `Pickup floor ${input.pickupFloor}${input.pickupHasLift ? " (lift)" : " (no lift)"}`, amount: pickupFloorCost, type: "surcharge" as const }]
      : []),
    ...(dropoffFloorCost > 0
      ? [{ label: `Dropoff floor ${input.dropoffFloor}${input.dropoffHasLift ? " (lift)" : " (no lift)"}`, amount: dropoffFloorCost, type: "surcharge" as const }]
      : []),
    ...inventory.lineItems,
    ...access.lineItems,
    ...addons.lineItems,
  ];

  const staticSubtotal =
    Math.round(
      (baseAdjusted + distanceCost + pickupFloorCost + dropoffFloorCost + inventory.total + access.total + addons.total) * 100,
    ) / 100;

  // 14-day x 3-slot price calendar
  const today = currentBookingDate(new Date());
  const days: DayPrice[] = [];
  const allPrices: number[] = [];

  for (let i = 0; i < CALENDAR_DAYS; i++) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + i));
    const date = d.toISOString().slice(0, 10);
    const weatherSurcharge = weatherSurcharges.get(date) ?? 0;
    const daySubtotal = Math.round((staticSubtotal + weatherSurcharge) * 100) / 100;
    const urgency = urgencyMultiplier(values, daysFromToday(d, today));
    const weekend = isWeekend(d) ? readConfig(values, "weekend", "multiplier") : 1.0;
    const peak = isPeakMonth(d) ? readConfig(values, "season", "peakMonthMultiplier") : 1.0;
    const eom = isEndOfMonth(d) ? readConfig(values, "season", "endOfMonthMultiplier") : 1.0;

    const slots = TIME_SLOTS.map((slot) => {
      const slotMul = slotMultiplier(values, slot);
      const total = Math.round(daySubtotal * urgency * weekend * peak * eom * slotMul * 100) / 100;
      allPrices.push(total);
      return { slot, price: total, tier: PRICE_TIER.STANDARD as PriceTier };
    });

    days.push({
      date,
      slots,
      ...(weatherSurcharge > 0
        ? { lineItems: [{ label: "Weather surcharge", amount: weatherSurcharge, type: "surcharge" as const }] }
        : {}),
    });
  }

  // Apply tier coloring across all prices
  const sorted = [...allPrices].sort((a, b) => a - b);
  for (const day of days) {
    for (const slot of day.slots) {
      slot.tier = tierFor(slot.price, sorted);
    }
  }

  // Find cheapest day (T4)
  let cheapestDay: string | undefined;
  let cheapestPrice = Infinity;
  for (const day of days) {
    for (const slot of day.slots) {
      if (slot.price < cheapestPrice) {
        cheapestPrice = slot.price;
        cheapestDay = day.date;
      }
    }
  }

  // Issue signed quote token (T2)
  const quoteToken = issueQuoteToken({
    price: staticSubtotal,
    staticSubtotal,
    serviceType: input.serviceType,
    distanceMiles: input.distanceMiles,
    expiresAt: 0, // set inside issueQuoteToken
  });
  const quoteExpiresAt = Date.now() + 30 * 60 * 1000;

  return {
    days,
    staticLineItems,
    staticSubtotal,
    currency: CURRENCY.code,
    symbol: CURRENCY.symbol,
    cheapestDay,
    quoteToken,
    quoteExpiresAt,
  };
}

// Used by booking creation to verify the client-supplied total against a server
// recomputation for a specific date+slot. Access fields default to 0/false
// if omitted so existing callers keep working.
export async function calculatePriceForSlot(
  input: PricingCalculateInput,
  date: Date,
  slot: "morning" | "afternoon" | "evening",
): Promise<number> {
  if (!Number.isFinite(date.getTime())) throw new Error("SELECTED_SLOT_UNAVAILABLE");
  const result = await calculatePrice(input);
  const iso = date.toISOString().slice(0, 10);
  const day = result.days.find((d) => d.date === iso);
  const slotPrice = day?.slots.find((s) => s.slot === slot)?.price;
  if (typeof slotPrice !== "number" || !Number.isFinite(slotPrice) || slotPrice <= 0) {
    throw new Error("SELECTED_SLOT_UNAVAILABLE");
  }
  return slotPrice;
}

import type { PriceLineItem, TimeSlot } from "@/lib/booking-store";

export interface SlotData {
  slot: TimeSlot;
  price: number;
  tier: "green" | "yellow" | "red";
}

export interface DayPrice {
  date: string;
  slots: SlotData[];
  lineItems?: PriceLineItem[];
}

export interface PricingResult {
  days: DayPrice[];
  staticLineItems: PriceLineItem[];
  staticSubtotal: number;
  currency: string;
  symbol: string;
  cheapestDay?: string;
  quoteToken?: string;
  quoteExpiresAt?: number;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

/** Never render an unpriced slot, a malformed date or a non-GBP amount as a quote. */
export function parsePricingResult(value: unknown): PricingResult | null {
  const result = record(value);
  if (!result || !Array.isArray(result.days) || !Array.isArray(result.staticLineItems) ||
      typeof result.staticSubtotal !== "number" || !Number.isFinite(result.staticSubtotal) || result.staticSubtotal < 0 ||
      result.currency !== "GBP" || typeof result.symbol !== "string") return null;

  const dates = new Set<string>();
  for (const value of result.days) {
    const day = record(value);
    if (!day || typeof day.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
        !Number.isFinite(Date.parse(`${day.date}T12:00:00Z`)) ||
        new Date(`${day.date}T12:00:00Z`).toISOString().slice(0, 10) !== day.date ||
        dates.has(day.date) || !Array.isArray(day.slots)) return null;
    dates.add(day.date);
    const slots = new Set<string>();
    for (const value of day.slots) {
      const slot = record(value);
      if (!slot || typeof slot.slot !== "string" || !["morning", "afternoon", "evening"].includes(slot.slot) ||
          slots.has(slot.slot) || typeof slot.price !== "number" || !Number.isFinite(slot.price) || slot.price <= 0 ||
          !["green", "yellow", "red"].includes(String(slot.tier))) return null;
      slots.add(slot.slot);
    }
    if (day.lineItems !== undefined) {
      if (!Array.isArray(day.lineItems)) return null;
      for (const value of day.lineItems) {
        const item = record(value);
        if (!item || typeof item.label !== "string" || typeof item.type !== "string" ||
            typeof item.amount !== "number" || !Number.isFinite(item.amount)) return null;
      }
    }
  }
  for (const value of result.staticLineItems) {
    const item = record(value);
    if (!item || typeof item.label !== "string" || typeof item.type !== "string" ||
        typeof item.amount !== "number" || !Number.isFinite(item.amount)) return null;
  }
  const pricing = result as unknown as PricingResult;
  const cheapestDay = typeof result.cheapestDay === "string" ? result.cheapestDay : undefined;
  const quoteToken = typeof result.quoteToken === "string" ? result.quoteToken : undefined;
  const quoteExpiresAt = typeof result.quoteExpiresAt === "number" ? result.quoteExpiresAt : undefined;
  return { ...pricing, days: pricing.days.filter((day) => day.slots.length > 0), cheapestDay, quoteToken, quoteExpiresAt };
}

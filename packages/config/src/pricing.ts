// Default values used to seed PricingConfig and as fallbacks when DB rows are missing.

export const DEFAULT_PRICING_CONFIG = {
  distance: {
    freeMiles: 5,
    perMileRate: 1.5,
    longDistanceDiscountStart: 20,
    longDistanceDiscountFactor: 0.85,
  },
  floor: {
    perFloorSurcharge: 8,
    noLiftPenaltyMultiplier: 1.5,
    groundFloorThreshold: 0,
  },
  urgency: {
    todayMultiplier: 1.4,
    tomorrowMultiplier: 1.2,
    twoDaysMultiplier: 1.1,
  },
  slot: {
    morningMultiplier: 1.05,
    afternoonMultiplier: 1.0,
    eveningMultiplier: 1.1,
  },
  weekend: { multiplier: 1.15 },
  season: {
    peakMonthMultiplier: 1.1, // Jun/Jul/Aug
    endOfMonthMultiplier: 1.08,
  },
  weather: {
    clear: 0,
    rain: 5,
    heavy_rain: 10,
    snow: 20,
    storm: 25,
  },
  addon: {
    helperPerHourPerHelper: 18,
    packingFlat: 35,
    assemblyFlat: 25,
  },
  variant: {
    bedroom1Multiplier: 1.0,
    bedroom2Multiplier: 1.2,
    bedroom3Multiplier: 1.45,
    bedroom4Multiplier: 1.7,
    bedroom5PlusMultiplier: 2.0,
    businessSmallMultiplier: 1.0,
    businessMediumMultiplier: 1.4,
    businessLargeMultiplier: 1.8,
  },
  base: {
    serviceBasePrice: 49,
  },
} as const;

export type PricingConfigCategory = keyof typeof DEFAULT_PRICING_CONFIG;

export interface PricingConfigRow {
  category: string;
  key: string;
  value: number;
  description?: string;
}

export const DEFAULT_PRICING_CONFIG_ROWS: PricingConfigRow[] = Object.entries(
  DEFAULT_PRICING_CONFIG,
).flatMap(([category, values]) =>
  Object.entries(values as Record<string, number>).map(([key, value]) => ({
    category,
    key,
    value: Number(value),
  })),
);

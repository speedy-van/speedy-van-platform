// Van capacity engine — pure functions, no React, no I/O.
// PLACEHOLDER volumes — replace with your fleet's actual figures before
// the fit-guarantee goes live.

export type VanTier = "small" | "medium" | "large";

export interface VanSpec {
  tier: VanTier;
  label: string;
  usableM3: number;   // PLACEHOLDER — replace with actual usable load volume
  payloadKg: number;  // PLACEHOLDER — replace with actual payload rating
}

export const VAN_SPECS: Record<VanTier, VanSpec> = {
  small: {
    tier: "small",
    label: "Small van (Transit-size)",
    usableM3: 6.5,    // PLACEHOLDER
    payloadKg: 900,   // PLACEHOLDER
  },
  medium: {
    tier: "medium",
    label: "Luton van",
    usableM3: 14.0,   // PLACEHOLDER
    payloadKg: 1100,  // PLACEHOLDER
  },
  large: {
    tier: "large",
    label: "Luton XL with tail-lift",
    usableM3: 18.0,   // PLACEHOLDER
    payloadKg: 1250,  // PLACEHOLDER
  },
};

const TIER_ORDER: VanTier[] = ["small", "medium", "large"];

// Item volume estimates in m³ — approximate household averages.
const ITEM_VOLUMES_M3: Record<string, number> = {
  // Sofas / seating
  "sofa-3-seater": 1.4,
  "sofa-2-seater": 1.0,
  "loveseat-2-seat-fabric-63inch": 1.0,
  "chesterfield-sofa-2-seat-antique-tan": 1.2,
  "chesterfield-sofa-berkeley-traditional": 1.4,
  "chesterfield-sofa-4-seat-traditional": 2.0,
  "sofa-3-seat-couch-storage-layer": 1.5,
  "sofa-3-seat-fabric-modern-lestar": 1.4,
  "sleeper-sofa-3in1-small-tufted": 1.4,
  "sleeper-sofa-3in1-convertible-howcool": 1.8,
  "recliner-sofa-leather-power-edward": 1.6,
  "recliner-sofa-3-seat-leather-tufted": 1.9,
  "recliner-sofa-set-2-piece-power": 2.4,
  "sectional-4-seat-l-shaped-convertible": 2.4,
  "sectional-4-seat-convertible-storage": 2.6,
  "sectional-6-seat-convertible-modular": 3.2,
  "single-sofa-chair-1-seat-fabric": 0.6,
  "single-sofa-chair-1-seat-modern": 0.6,
  "armchair-1-seat-accent-chair": 0.6,
  "armchair": 0.6,
  // Beds
  "king-bed": 1.5,
  "double-bed": 1.2,
  "single-bed": 0.8,
  "bunk-bed": 1.6,
  // Wardrobes / storage
  "wardrobe-double": 1.8,
  "wardrobe-single": 0.9,
  "chest-of-drawers": 0.5,
  "bookcase": 0.6,
  // Tables
  "dining-table": 0.9,
  "coffee-table": 0.3,
  "desk": 0.6,
  // White goods
  "washing-machine": 0.6,
  "fridge-freezer": 0.7,
  "dishwasher": 0.5,
  "tumble-dryer": 0.5,
  // TV / electronics
  "tv-large": 0.4,
  "tv-small": 0.2,
  // Boxes
  "box-small": 0.04,
  "box-medium": 0.07,
  "box-large": 0.12,
  "box-xl": 0.18,
};

const DEFAULT_ITEM_VOLUME_M3 = 0.3;

export function itemVolumeM3(itemId?: string, name?: string): number {
  const direct = itemId ? ITEM_VOLUMES_M3[itemId] : undefined;
  if (direct !== undefined) return direct;

  const value = `${itemId ?? ""} ${name ?? ""}`.toLowerCase();
  if (!value.trim()) return DEFAULT_ITEM_VOLUME_M3;

  if (/(sectional|corner|l shaped|l-shaped|6[ -]?seat|six seater)/.test(value)) return 3.0;
  if (/(4[ -]?seat|four seater|chesterfield-sofa-4)/.test(value)) return 2.0;
  if (/(3[ -]?seat|3-seater|three seater|three-seat|sofa-3)/.test(value)) return 1.4;
  if (/(2[ -]?seat|2-seater|two seater|two-seat|loveseat)/.test(value)) return 1.0;
  if (/(armchair|accent chair|single sofa|1[ -]?seat)/.test(value)) return 0.6;
  if (/(sofa|couch|settee|recliner)/.test(value)) return 1.2;

  return DEFAULT_ITEM_VOLUME_M3;
}

export interface VolumeItem {
  itemId?: string;
  name?: string;
  quantity: number;
}

export function computeTotalVolumeM3(items: VolumeItem[]): number {
  return items.reduce((sum, item) => {
    const vol = itemVolumeM3(item.itemId, item.name);
    return sum + vol * item.quantity;
  }, 0);
}

export function computeFillRatio(items: VolumeItem[], tier: VanTier): number {
  const spec = VAN_SPECS[tier];
  const total = computeTotalVolumeM3(items);
  return total / spec.usableM3;
}

export const UPGRADE_THRESHOLD = 0.85;

export function suggestVanUpgrade(items: VolumeItem[], currentTier: VanTier): VanTier | null {
  const fill = computeFillRatio(items, currentTier);
  if (fill <= UPGRADE_THRESHOLD) return null;
  const idx = TIER_ORDER.indexOf(currentTier);
  if (idx === -1 || idx >= TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1]!;
}

export function defaultVanTierForService(serviceSlug: string): VanTier {
  if (["house-removals", "long-distance-removals", "office-removal"].includes(serviceSlug)) return "large";
  if (["furniture", "furniture-delivery", "ikea-delivery", "piano-moving"].includes(serviceSlug)) return "medium";
  return "small";
}

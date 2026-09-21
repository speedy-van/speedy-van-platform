import { ITEMS_CATALOG, type CatalogItem } from "./items-catalog";

export type ItemFamilySlug =
  | "sofas-armchairs"
  | "beds-mattresses"
  | "wardrobes-drawers"
  | "tables-desks"
  | "chairs"
  | "appliances"
  | "boxes-bags"
  | "tvs-electronics";

export interface CatalogRecord extends CatalogItem {
  categorySlug: string;
  categoryName: string;
  categoryIcon: string;
}

export interface ItemFamily {
  slug: ItemFamilySlug;
  label: string;
  shortLabel: string;
  description: string;
  aliases: string[];
  iconLabel: string;
  imageItemId: string;
  variantIds: string[];
}

export interface ItemVariantPresentation {
  itemId: string;
  family: ItemFamilySlug;
  label: string;
  description: string;
  aliases: string[];
}

export interface PresentedCatalogRecord {
  record: CatalogRecord;
  label: string;
  family?: ItemFamily;
  variant?: ItemVariantPresentation;
  aliases: string[];
}

export interface SearchResult extends PresentedCatalogRecord {
  score: number;
  reason: "exact" | "alias" | "name" | "fuzzy";
}

type VariantSpec = Omit<ItemVariantPresentation, "aliases"> & {
  aliases?: string[];
};

export const ITEM_FAMILIES: ItemFamily[] = [
  {
    slug: "sofas-armchairs",
    label: "Sofas & Armchairs",
    shortLabel: "Sofas",
    description: "Sofas by seat count, corners, recliners and sofa beds.",
    aliases: ["sofa", "couch", "settee", "loveseat", "armchair", "recliner", "sectional"],
    iconLabel: "SO",
    imageItemId: "sofa-3-seat-fabric-modern-lestar",
    variantIds: [
      "loveseat-2-seat-fabric-63inch",
      "sofa-3-seat-fabric-modern-lestar",
      "sectional-4-seat-l-shaped-convertible",
      "sectional-6-seat-convertible-modular",
      "recliner-sofa-3-seat-leather-tufted",
      "sleeper-sofa-3in1-convertible-howcool",
      "armchair-1-seat-accent-chair",
      "single-sofa-chair-1-seat-fabric",
    ],
  },
  {
    slug: "beds-mattresses",
    label: "Beds & Mattresses",
    shortLabel: "Beds",
    description: "Bed frames by size, with mattress records kept separate where present.",
    aliases: ["bed", "bed frame", "mattress", "bunk bed", "ottoman bed"],
    iconLabel: "BD",
    imageItemId: "double-bed-frame-cavill-fabric-grey",
    variantIds: [
      "single-bed-frame-wooden-3ft-white",
      "small-double-bed-frame-2-storage-drawers",
      "double-bed-frame-cavill-fabric-grey",
      "double-bed-frame-harper-storage-mattress",
      "king-bed-frame-cavill-fabric-grey",
      "super-king-bed-frame-upholstered-6ft",
      "ottoman-bed-frame-upholstered-king-linen-fabric",
      "bunk-bed-frame-paddington-kids-white",
    ],
  },
  {
    slug: "wardrobes-drawers",
    label: "Wardrobes & Drawers",
    shortLabel: "Wardrobes",
    description: "Wardrobes by size and type, plus drawer units.",
    aliases: ["wardrobe", "closet", "armoire", "drawers", "dresser", "chest of drawers"],
    iconLabel: "WD",
    imageItemId: "wardrobe-double-door-hodedah-two-drawers-hanging-rod",
    variantIds: [
      "wardrobe-single-door-space-saving-bedroom-storage-unit",
      "wardrobe-double-door-hodedah-two-drawers-hanging-rod",
      "wardrobe-triple-door-quarte-modern-3-door-2-drawers",
      "sliding-door-wardrobe-smartstandard-56-x80",
      "corner-wardrobe-polygon-hanging-storage-closet-cabinet",
      "mirrored-wardrobe-better-home-products-wood-double-sliding",
      "portable-wardrobe-calmootey-closet-organizers-clothing",
      "chest-drawers-mahogany",
    ],
  },
  {
    slug: "tables-desks",
    label: "Tables & Desks",
    shortLabel: "Tables",
    description: "Dining tables, coffee tables, side tables and office desks.",
    aliases: ["table", "desk", "coffee table", "dining table", "side table", "console table"],
    iconLabel: "TB",
    imageItemId: "dining-table-extendable-55inch",
    variantIds: [
      "coffee-table-modern-povison-living-room",
      "side-table-round-2-tier-fantersi",
      "console-table-59inch-drawers-williamspace",
      "round-dining-table-48inch",
      "dining-table-extendable-55inch",
      "dining-table-set-6seater-modern",
      "office-desk-nsdirect-modern-computer-63-inch-large",
      "office-desk-logan-antigua-66-u-shaped-executive-hutch",
    ],
  },
  {
    slug: "chairs",
    label: "Chairs",
    shortLabel: "Chairs",
    description: "Dining, office, accent, rocking and high chairs.",
    aliases: ["chair", "chairs", "stool", "bench", "office chair", "dining chair", "high chair"],
    iconLabel: "CH",
    imageItemId: "accent-chair-mid-century-eluchang",
    variantIds: [
      "dining-chairs-walnut-leather-set2",
      "dining-chairs-mid-century-set6",
      "office-chair-felixking-ergonomic-headrest-desk",
      "office-chair-contemporary-leather-executive-husky",
      "accent-chair-mid-century-eluchang",
      "armchair-rolled-accent-set-2",
      "rocking-chair-nursery-ergonomic-papasan",
      "high-chair-feeding-position",
    ],
  },
  {
    slug: "appliances",
    label: "Appliances",
    shortLabel: "Appliances",
    description: "Fridges, freezers, washing machines, dishwashers and ovens.",
    aliases: [
      "appliance",
      "fridge",
      "refrigerator",
      "freezer",
      "washing machine",
      "washer",
      "dishwasher",
      "oven",
      "stove",
      "microwave",
    ],
    iconLabel: "AP",
    imageItemId: "refrigerator-top-freezer-7-5cuft",
    variantIds: [
      "mini-fridge-compact-single-door",
      "refrigerator-top-freezer-7-5cuft",
      "american-fridge-freezer-bosch",
      "upright-freezer-compact-3cuft-apartment",
      "chest-freezer-7cuft-white-frigidaire",
      "washing-machine-standard-dimensions",
      "dishwasher-portable-vs-builtin",
      "microwave-countertop-1-1cuft-1000watt",
    ],
  },
  {
    slug: "boxes-bags",
    label: "Boxes & Bags",
    shortLabel: "Boxes",
    description: "Moving boxes, storage boxes, luggage and travel bags.",
    aliases: ["box", "boxes", "bag", "bags", "luggage", "suitcase", "storage box"],
    iconLabel: "BX",
    imageItemId: "moving-boxes-uboxes-with-handles-10-premium",
    variantIds: [
      "moving-boxes-uboxes-with-handles-10-premium",
      "moving-boxes-8-best-top-moving-house-boxes",
      "moving-boxes-uboxes-1-room-economy-kit-15-boxes",
      "storage-boxes-fabric-household-essentials",
      "travel-bag-litvyak-duffle-50l-canvas",
      "suitcase-luggage-extra-large-33-lightweight-4-wheel-abs-hard-shell",
      "travel-luggage-bags-brake-spinner-wheels",
      "garment-bag-60-deluxe-travel-wallybags",
    ],
  },
  {
    slug: "tvs-electronics",
    label: "TVs & Electronics",
    shortLabel: "Electronics",
    description: "TVs by size plus monitors, computers, consoles and audio.",
    aliases: ["tv", "television", "electronics", "monitor", "computer", "console", "speaker", "soundbar"],
    iconLabel: "TV",
    imageItemId: "television-50inch-smart-4k-google",
    variantIds: [
      "television-32inch-smart-led-hd",
      "television-43inch-samsung-crystal",
      "television-50inch-smart-4k-google",
      "television-55inch-lg-oled-c4",
      "television-65inch-best-2025",
      "computer-monitor-27inch-hp",
      "desktop-computer-hp-tower",
      "gaming-console-ps5-xbox-series",
    ],
  },
];

const CURATED_VARIANTS: VariantSpec[] = [
  { itemId: "loveseat-2-seat-fabric-63inch", family: "sofas-armchairs", label: "2-seat sofa", description: "Compact sofa or loveseat.", aliases: ["two seater", "2 seater", "couch", "settee"] },
  { itemId: "sofa-3-seat-fabric-modern-lestar", family: "sofas-armchairs", label: "3-seat sofa", description: "Standard three-seat fabric sofa.", aliases: ["three seater", "3 seater", "couch", "settee"] },
  { itemId: "sectional-4-seat-l-shaped-convertible", family: "sofas-armchairs", label: "Corner sofa", description: "L-shaped sofa, around four seats.", aliases: ["corner couch", "sectional"] },
  { itemId: "sectional-6-seat-convertible-modular", family: "sofas-armchairs", label: "Large corner sofa", description: "Modular corner sofa, around six seats.", aliases: ["large sectional", "big sofa"] },
  { itemId: "recliner-sofa-3-seat-leather-tufted", family: "sofas-armchairs", label: "Recliner sofa", description: "Three-seat reclining sofa.", aliases: ["reclining sofa"] },
  { itemId: "sleeper-sofa-3in1-convertible-howcool", family: "sofas-armchairs", label: "Sofa bed", description: "Convertible sofa bed.", aliases: ["sleeper sofa", "pull out sofa"] },
  { itemId: "armchair-1-seat-accent-chair", family: "sofas-armchairs", label: "Armchair", description: "Single armchair or accent chair.", aliases: ["accent chair", "single chair"] },
  { itemId: "single-sofa-chair-1-seat-fabric", family: "sofas-armchairs", label: "Single sofa chair", description: "Single-seat sofa chair.", aliases: ["single sofa", "one seat sofa"] },

  { itemId: "single-bed-frame-wooden-3ft-white", family: "beds-mattresses", label: "Single bed frame", description: "3 ft bed frame.", aliases: ["single bed"] },
  { itemId: "small-double-bed-frame-2-storage-drawers", family: "beds-mattresses", label: "Small double bed frame", description: "Small double frame with drawers.", aliases: ["small double bed"] },
  { itemId: "double-bed-frame-cavill-fabric-grey", family: "beds-mattresses", label: "Double bed frame", description: "Double bed frame only.", aliases: ["double bed"] },
  { itemId: "double-bed-frame-harper-storage-mattress", family: "beds-mattresses", label: "Double bed frame with mattress", description: "Combined frame and mattress record.", aliases: ["double mattress", "mattress"] },
  { itemId: "king-bed-frame-cavill-fabric-grey", family: "beds-mattresses", label: "King bed frame", description: "King-size bed frame.", aliases: ["king bed"] },
  { itemId: "super-king-bed-frame-upholstered-6ft", family: "beds-mattresses", label: "Super king bed frame", description: "6 ft upholstered frame.", aliases: ["super king bed"] },
  { itemId: "ottoman-bed-frame-upholstered-king-linen-fabric", family: "beds-mattresses", label: "Ottoman bed frame", description: "Lift-up storage bed frame.", aliases: ["storage bed"] },
  { itemId: "bunk-bed-frame-paddington-kids-white", family: "beds-mattresses", label: "Bunk bed frame", description: "Kids bunk bed frame.", aliases: ["bunk bed"] },

  { itemId: "wardrobe-single-door-space-saving-bedroom-storage-unit", family: "wardrobes-drawers", label: "Single wardrobe", description: "Small wardrobe; lighter handling.", aliases: ["single closet"] },
  { itemId: "wardrobe-double-door-hodedah-two-drawers-hanging-rod", family: "wardrobes-drawers", label: "Double wardrobe", description: "Two-door wardrobe with drawers.", aliases: ["double closet"] },
  { itemId: "wardrobe-triple-door-quarte-modern-3-door-2-drawers", family: "wardrobes-drawers", label: "Triple wardrobe", description: "Three-door wardrobe; bulky item.", aliases: ["triple closet"] },
  { itemId: "sliding-door-wardrobe-smartstandard-56-x80", family: "wardrobes-drawers", label: "Sliding-door wardrobe", description: "Sliding door wardrobe.", aliases: ["sliding closet"] },
  { itemId: "corner-wardrobe-polygon-hanging-storage-closet-cabinet", family: "wardrobes-drawers", label: "Corner wardrobe", description: "Corner wardrobe or closet cabinet.", aliases: ["corner closet"] },
  { itemId: "mirrored-wardrobe-better-home-products-wood-double-sliding", family: "wardrobes-drawers", label: "Mirrored wardrobe", description: "Wardrobe with mirrored doors.", aliases: ["mirror wardrobe", "mirrored closet"] },
  { itemId: "portable-wardrobe-calmootey-closet-organizers-clothing", family: "wardrobes-drawers", label: "Portable wardrobe", description: "Light clothing storage unit.", aliases: ["portable closet"] },
  { itemId: "chest-drawers-mahogany", family: "wardrobes-drawers", label: "Chest of drawers", description: "Drawer chest or dresser.", aliases: ["dresser", "drawers"] },

  { itemId: "coffee-table-modern-povison-living-room", family: "tables-desks", label: "Coffee table", description: "Living room coffee table.", aliases: ["low table"] },
  { itemId: "side-table-round-2-tier-fantersi", family: "tables-desks", label: "Side table", description: "Small side or end table.", aliases: ["end table"] },
  { itemId: "console-table-59inch-drawers-williamspace", family: "tables-desks", label: "Console table", description: "Console table with drawers.", aliases: ["hall table"] },
  { itemId: "round-dining-table-48inch", family: "tables-desks", label: "Round dining table", description: "Round dining table.", aliases: ["dining table"] },
  { itemId: "dining-table-extendable-55inch", family: "tables-desks", label: "Extendable dining table", description: "Extendable dining table.", aliases: ["extendable table"] },
  { itemId: "dining-table-set-6seater-modern", family: "tables-desks", label: "6-seat dining set", description: "Dining table set for six.", aliases: ["dining set"] },
  { itemId: "office-desk-nsdirect-modern-computer-63-inch-large", family: "tables-desks", label: "Office desk", description: "Large computer desk.", aliases: ["computer desk"] },
  { itemId: "office-desk-logan-antigua-66-u-shaped-executive-hutch", family: "tables-desks", label: "Large office desk", description: "Executive desk with hutch.", aliases: ["executive desk"] },

  { itemId: "dining-chairs-walnut-leather-set2", family: "chairs", label: "Dining chairs, set of 2", description: "Two dining chairs.", aliases: ["pair of chairs"] },
  { itemId: "dining-chairs-mid-century-set6", family: "chairs", label: "Dining chairs, set of 6", description: "Six dining chairs.", aliases: ["six chairs"] },
  { itemId: "office-chair-felixking-ergonomic-headrest-desk", family: "chairs", label: "Office chair", description: "Desk chair with headrest.", aliases: ["desk chair"] },
  { itemId: "office-chair-contemporary-leather-executive-husky", family: "chairs", label: "Executive office chair", description: "Larger leather office chair.", aliases: ["executive chair"] },
  { itemId: "accent-chair-mid-century-eluchang", family: "chairs", label: "Accent chair", description: "Single accent chair.", aliases: ["occasional chair"] },
  { itemId: "armchair-rolled-accent-set-2", family: "chairs", label: "Armchairs, set of 2", description: "Two rolled armchairs.", aliases: ["two armchairs"] },
  { itemId: "rocking-chair-nursery-ergonomic-papasan", family: "chairs", label: "Rocking chair", description: "Nursery or lounge rocking chair.", aliases: ["rocker"] },
  { itemId: "high-chair-feeding-position", family: "chairs", label: "High chair", description: "Child high chair.", aliases: ["baby chair"] },

  { itemId: "mini-fridge-compact-single-door", family: "appliances", label: "Mini fridge", description: "Compact fridge.", aliases: ["small refrigerator"] },
  { itemId: "refrigerator-top-freezer-7-5cuft", family: "appliances", label: "Fridge freezer", description: "Standard fridge freezer.", aliases: ["refrigerator freezer"] },
  { itemId: "american-fridge-freezer-bosch", family: "appliances", label: "American fridge freezer", description: "Large fridge freezer.", aliases: ["large refrigerator"] },
  { itemId: "upright-freezer-compact-3cuft-apartment", family: "appliances", label: "Upright freezer", description: "Compact upright freezer.", aliases: ["freezer"] },
  { itemId: "chest-freezer-7cuft-white-frigidaire", family: "appliances", label: "Chest freezer", description: "7 cu ft chest freezer.", aliases: ["freezer chest"] },
  { itemId: "washing-machine-standard-dimensions", family: "appliances", label: "Washing machine", description: "Standard washing machine.", aliases: ["washer"] },
  { itemId: "dishwasher-portable-vs-builtin", family: "appliances", label: "Dishwasher", description: "Dishwasher appliance.", aliases: ["portable dishwasher"] },
  { itemId: "microwave-countertop-1-1cuft-1000watt", family: "appliances", label: "Microwave", description: "Countertop microwave.", aliases: ["microwave oven"] },

  { itemId: "moving-boxes-uboxes-with-handles-10-premium", family: "boxes-bags", label: "Moving boxes, small set", description: "Box set with handles.", aliases: ["small boxes"] },
  { itemId: "moving-boxes-8-best-top-moving-house-boxes", family: "boxes-bags", label: "Moving boxes, medium set", description: "Medium moving box set.", aliases: ["medium boxes"] },
  { itemId: "moving-boxes-uboxes-1-room-economy-kit-15-boxes", family: "boxes-bags", label: "Moving boxes, room kit", description: "One-room moving box kit.", aliases: ["room boxes"] },
  { itemId: "storage-boxes-fabric-household-essentials", family: "boxes-bags", label: "Storage boxes", description: "Fabric storage boxes.", aliases: ["storage box"] },
  { itemId: "travel-bag-litvyak-duffle-50l-canvas", family: "boxes-bags", label: "Travel bag", description: "Canvas duffle bag.", aliases: ["duffle bag"] },
  { itemId: "suitcase-luggage-extra-large-33-lightweight-4-wheel-abs-hard-shell", family: "boxes-bags", label: "Large suitcase", description: "Extra-large suitcase.", aliases: ["luggage"] },
  { itemId: "travel-luggage-bags-brake-spinner-wheels", family: "boxes-bags", label: "Luggage set", description: "Travel luggage set.", aliases: ["suitcases"] },
  { itemId: "garment-bag-60-deluxe-travel-wallybags", family: "boxes-bags", label: "Garment bag", description: "Light garment bag.", aliases: ["clothes bag"] },

  { itemId: "television-32inch-smart-led-hd", family: "tvs-electronics", label: "TV, 32 inch", description: "32 inch TV.", aliases: ["television"] },
  { itemId: "television-43inch-samsung-crystal", family: "tvs-electronics", label: "TV, 43 inch", description: "43 inch TV.", aliases: ["television"] },
  { itemId: "television-50inch-smart-4k-google", family: "tvs-electronics", label: "TV, 50 inch", description: "50 inch TV.", aliases: ["television"] },
  { itemId: "television-55inch-lg-oled-c4", family: "tvs-electronics", label: "TV, 55 inch", description: "55 inch TV.", aliases: ["television"] },
  { itemId: "television-65inch-best-2025", family: "tvs-electronics", label: "TV, 65 inch", description: "65 inch TV.", aliases: ["television"] },
  { itemId: "computer-monitor-27inch-hp", family: "tvs-electronics", label: "Computer monitor", description: "27 inch monitor.", aliases: ["monitor", "screen"] },
  { itemId: "desktop-computer-hp-tower", family: "tvs-electronics", label: "Desktop computer", description: "Desktop tower.", aliases: ["pc", "computer"] },
  { itemId: "gaming-console-ps5-xbox-series", family: "tvs-electronics", label: "Games console", description: "Console such as PS5 or Xbox.", aliases: ["game console"] },
];

export const CATALOG_RECORDS: CatalogRecord[] = ITEMS_CATALOG.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    categorySlug: category.slug,
    categoryName: category.name,
    categoryIcon: category.icon,
  })),
);

export const CATALOG_RECORD_BY_ID = new Map(CATALOG_RECORDS.map((item) => [item.slug, item]));
export const ITEM_FAMILY_BY_SLUG = new Map(ITEM_FAMILIES.map((family) => [family.slug, family]));
export const ITEM_VARIANT_BY_ID = new Map(
  CURATED_VARIANTS.map((variant) => [
    variant.itemId,
    { ...variant, aliases: variant.aliases ?? [] } satisfies ItemVariantPresentation,
  ]),
);

const CATEGORY_BY_SLUG = new Map(ITEMS_CATALOG.map((category) => [category.slug, category]));

const STOP_WORDS = new Set([
  "best",
  "guide",
  "tested",
  "reviewed",
  "comparison",
  "dimensions",
  "measure",
  "types",
  "consumer",
  "modern",
  "luxury",
  "home",
  "house",
  "furniture",
  "products",
  "ideas",
  "inspire",
  "with",
  "and",
  "the",
]);

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^\d+$/.test(word)) return word;
      if (word.toLowerCase() === "tv") return "TV";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function labelFromSlug(record: CatalogRecord): string {
  const slug = record.slug.toLowerCase();
  const tv = slug.match(/television-(\d+)inch/);
  if (tv) return `TV, ${tv[1]} inch`;

  const monitor = slug.match(/computer-monitor-(\d+)inch/);
  if (monitor) return `Monitor, ${monitor[1]} inch`;

  if (slug.includes("american-fridge-freezer")) return "American fridge freezer";
  if (slug.includes("mini-fridge")) return "Mini fridge";
  if (slug.includes("refrigerator") || slug.includes("fridge-freezer")) return "Fridge freezer";
  if (slug.includes("washing-machine")) return "Washing machine";
  if (slug.includes("dishwasher")) return "Dishwasher";
  if (slug.includes("microwave")) return "Microwave";
  if (slug.includes("wardrobe-single")) return "Single wardrobe";
  if (slug.includes("wardrobe-double")) return "Double wardrobe";
  if (slug.includes("wardrobe-triple")) return "Triple wardrobe";
  if (slug.includes("sliding-door-wardrobe")) return "Sliding-door wardrobe";
  if (slug.includes("chest-drawers")) return "Chest of drawers";
  if (slug.includes("office-chair")) return "Office chair";
  if (slug.includes("office-desk")) return "Office desk";

  const words = slug
    .replace(/(\d+)inch/g, "$1 inch")
    .replace(/(\d+)ft/g, "$1 ft")
    .split("-")
    .filter((word) => word && !STOP_WORDS.has(word));

  return titleCase(words.slice(0, 6).join(" "));
}

export function getDisplayLabel(record: CatalogRecord): string {
  return ITEM_VARIANT_BY_ID.get(record.slug)?.label ?? labelFromSlug(record);
}

export function getFamilyForRecord(record: CatalogRecord): ItemFamily | undefined {
  const curated = ITEM_VARIANT_BY_ID.get(record.slug);
  if (curated) return ITEM_FAMILY_BY_SLUG.get(curated.family);

  const value = normalize(`${record.slug} ${record.name} ${record.categoryName}`);
  let familySlug: ItemFamilySlug | undefined;

  if (hasAny(value, [/\bsofa\b/, /\bcouch\b/, /\bsettee\b/, /\bsectional\b/, /\bloveseat\b/])) {
    familySlug = "sofas-armchairs";
  } else if (hasAny(value, [/\bbed frame\b/, /\bbed\b/, /\bmattress\b/, /\bbunk\b/, /\bbedroom\b/])) {
    familySlug = "beds-mattresses";
  } else if (hasAny(value, [/\bwardrobe\b/, /\bcloset\b/, /\barmoire\b/, /\bdresser\b/, /\bdrawers\b/, /\bchest drawers\b/])) {
    familySlug = "wardrobes-drawers";
  } else if (hasAny(value, [/\btable\b/, /\bdesk\b/])) {
    familySlug = "tables-desks";
  } else if (hasAny(value, [/\bchair\b/, /\bstool\b/, /\bbench\b/])) {
    familySlug = "chairs";
  } else if (hasAny(value, [/\bfridge\b/, /\brefrigerator\b/, /\bfreezer\b/, /\bwashing machine\b/, /\bdishwasher\b/, /\boven\b/, /\bstove\b/, /\bmicrowave\b/])) {
    familySlug = "appliances";
  } else if (hasAny(value, [/\bbox\b/, /\bboxes\b/, /\bbag\b/, /\bbags\b/, /\bluggage\b/, /\bsuitcase\b/])) {
    familySlug = "boxes-bags";
  } else if (hasAny(value, [/\btv\b/, /\btelevision\b/, /\bmonitor\b/, /\bcomputer\b/, /\bconsole\b/, /\bsoundbar\b/, /\bspeaker\b/, /\blaptop\b/, /\btablet\b/])) {
    familySlug = "tvs-electronics";
  }

  return familySlug ? ITEM_FAMILY_BY_SLUG.get(familySlug) : undefined;
}

export function getAliasesForRecord(record: CatalogRecord): string[] {
  const curated = ITEM_VARIANT_BY_ID.get(record.slug);
  const aliases = new Set<string>([
    ...(curated?.aliases ?? []),
    record.categoryName,
  ]);

  const value = normalize(`${record.slug} ${record.name}`);
  if (value.includes("sofa") || value.includes("loveseat") || value.includes("sectional")) {
    aliases.add("couch");
    aliases.add("settee");
    aliases.add("sofa");
  }
  if (value.includes("armchair")) {
    aliases.add("armchair");
    aliases.add("chair");
  }
  if (value.includes("bed frame")) {
    aliases.add("bed");
    aliases.add("bed frame");
  }
  if (value.includes("mattress")) {
    aliases.add("mattress");
  }
  if (value.includes("wardrobe") || value.includes("armoire") || value.includes("closet")) {
    aliases.add("closet");
    aliases.add("wardrobe");
  }
  if (value.includes("television")) {
    aliases.add("tv");
    aliases.add("television");
  }
  if (value.includes("refrigerator")) {
    aliases.add("fridge");
    aliases.add("refrigerator");
  }
  if (value.includes("fridge")) {
    aliases.add("refrigerator");
    aliases.add("fridge");
  }
  if (value.includes("chest drawers") || value.includes("dresser")) {
    aliases.add("chest of drawers");
    aliases.add("dresser");
    aliases.add("drawers");
  }
  if (value.includes("washing machine")) {
    aliases.add("washer");
  }
  if (value.includes("box") || value.includes("boxes")) {
    aliases.add("moving boxes");
  }
  if (value.includes("luggage") || value.includes("suitcase")) {
    aliases.add("bags");
    aliases.add("luggage");
  }

  return Array.from(aliases);
}

export function presentRecord(record: CatalogRecord): PresentedCatalogRecord {
  const variant = ITEM_VARIANT_BY_ID.get(record.slug);
  const family = getFamilyForRecord(record);
  return {
    record,
    label: getDisplayLabel(record),
    family,
    variant,
    aliases: getAliasesForRecord(record),
  };
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const substitution = previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min(previous[j]! + 1, current[j - 1]! + 1, substitution);
    }
    for (let j = 0; j <= b.length; j++) previous[j] = current[j]!;
  }

  return previous[b.length]!;
}

function fuzzyWordMatch(words: string[], token: string): boolean {
  if (token.length < 5) return false;
  return words.some((word) => word.length >= 5 && editDistance(word, token) <= 1);
}

export function searchCatalogRecords(query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const queryTokens = normalizedQuery.split(" ");

  return CATALOG_RECORDS.map((record) => {
    const presented = presentRecord(record);
    const label = normalize(presented.label);
    const sourceName = normalize(record.name);
    const sourceSlug = normalize(record.slug);
    const aliases = presented.aliases.map(normalize);
    const aliasExact = aliases.some((alias) => alias === normalizedQuery);
    const aliasIncludes = aliases.some((alias) => alias.includes(normalizedQuery) || normalizedQuery.includes(alias));
    const fullText = normalize([presented.label, record.name, record.slug, record.categoryName, ...presented.aliases].join(" "));

    let score = 0;
    let reason: SearchResult["reason"] = "fuzzy";

    if (label === normalizedQuery || sourceName === normalizedQuery || sourceSlug === normalizedQuery) {
      score = 1000;
      reason = "exact";
    } else if (label.startsWith(normalizedQuery) || sourceName.startsWith(normalizedQuery)) {
      score = 920;
      reason = "exact";
    } else if (aliasExact) {
      score = 840;
      reason = "alias";
    } else if (label.includes(normalizedQuery) || sourceName.includes(normalizedQuery) || sourceSlug.includes(normalizedQuery)) {
      score = 740;
      reason = "name";
    } else if (aliasIncludes) {
      score = 680;
      reason = "alias";
    } else if (queryTokens.every((token) => fullText.includes(token))) {
      score = 560;
      reason = "name";
    } else if (queryTokens.every((token) => fuzzyWordMatch(fullText.split(" "), token))) {
      score = 260;
      reason = "fuzzy";
    }

    if (score > 0) {
      if (presented.variant) score += 35;
      if (presented.family) score += 10;
    }

    return score > 0 ? { ...presented, score, reason } : null;
  })
    .filter((result): result is SearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

export function getCategoryOptions() {
  return Array.from(CATEGORY_BY_SLUG.values()).map((category) => ({
    slug: category.slug,
    label: category.name,
    count: category.items.length,
    icon: category.icon,
  }));
}

export function getRecordsForCategory(categorySlug: string): CatalogRecord[] {
  return CATALOG_RECORDS.filter((record) => record.categorySlug === categorySlug);
}

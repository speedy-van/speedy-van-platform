import type { InventoryMode } from "./room-inventory";
import { SERVICES, getBookableService } from "./services";

export type BookingIntentId =
  | "house-removals"
  | "flat-removals"
  | "man-and-van"
  | "furniture"
  | "storage"
  | "student-move"
  | "small-moves"
  | "office"
  | "business"
  | "packing-service"
  | "other";

export interface BookingServiceOption {
  id: BookingIntentId;
  label: string;
  description: string;
  serviceSlug: string;
  imageSlug: string;
  inventoryMode: InventoryMode;
  pathBadge: string;
  scopeBadge: string;
  journeyTitle: string;
  journeyDescription: string;
  pickupTitle: string;
  dropoffTitle: string;
  pickupPlaceholder: string;
  dropoffPlaceholder: string;
  inventoryTitle: string;
  inventoryDescription: string;
  inventoryCta: string;
  summaryNote: string;
}

export const BOOKING_SERVICE_OPTIONS: BookingServiceOption[] = [
  {
    id: "house-removals",
    label: "House removals",
    description: "Home moves, flats and larger household loads.",
    serviceSlug: "house-removal",
    imageSlug: "house-removal",
    inventoryMode: "rooms",
    pathBadge: "Room-by-room inventory",
    scopeBadge: "Full move planning",
    journeyTitle: "Plan the home move",
    journeyDescription:
      "Confirm the route and access first, then build a room-by-room inventory so the quote reflects the size of the home.",
    pickupTitle: "Current home",
    dropoffTitle: "New home",
    pickupPlaceholder: "e.g. 15 Byres Road, Glasgow",
    dropoffPlaceholder: "e.g. 47 Princes Street, Edinburgh",
    inventoryTitle: "Home contents",
    inventoryDescription:
      "Choose the property size and add rooms, boxes, furniture, and any extra moving help needed.",
    inventoryCta: "date and time",
    summaryNote: "Priced for a larger home move with room planning.",
  },
  {
    id: "furniture",
    label: "Furniture",
    description: "Sofas, beds, wardrobes and bulky item delivery.",
    serviceSlug: "furniture-delivery",
    imageSlug: "furniture-delivery",
    inventoryMode: "items",
    pathBadge: "Bulky item list",
    scopeBadge: "Collection and delivery",
    journeyTitle: "Plan the furniture delivery",
    journeyDescription:
      "Confirm where the item is collected from, where it is going, and any stairs or lift access at both ends.",
    pickupTitle: "Collection",
    dropoffTitle: "Delivery",
    pickupPlaceholder: "e.g. shop, seller, storage unit, or home address",
    dropoffPlaceholder: "e.g. delivery address",
    inventoryTitle: "Furniture items",
    inventoryDescription:
      "Add the bulky pieces being moved, then include dismantling, assembly, packing, or extra helpers if needed.",
    inventoryCta: "date and time",
    summaryNote: "Priced for furniture or bulky-item transport.",
  },
  {
    id: "storage",
    label: "Storage",
    description: "Transport to or from storage. Storage space is not sold here.",
    serviceSlug: "man-and-van",
    imageSlug: "storage",
    inventoryMode: "items",
    pathBadge: "Storage run",
    scopeBadge: "Unit access matters",
    journeyTitle: "Plan the storage run",
    journeyDescription:
      "Confirm the storage facility or home address at each end, including floors, lifts, and access limits.",
    pickupTitle: "Collection point",
    dropoffTitle: "Storage or delivery point",
    pickupPlaceholder: "e.g. home address or storage facility",
    dropoffPlaceholder: "e.g. storage unit or final address",
    inventoryTitle: "Storage load",
    inventoryDescription:
      "Add boxes, bags, furniture, or loose items so the van size and loading time are priced correctly.",
    inventoryCta: "date and time",
    summaryNote: "Priced as a storage transport job, not storage rental.",
  },
  {
    id: "office",
    label: "Office",
    description: "Desks, chairs, files and boxed office equipment.",
    serviceSlug: "office-removal",
    imageSlug: "office-removal",
    inventoryMode: "items",
    pathBadge: "Office inventory",
    scopeBadge: "Downtime-aware",
    journeyTitle: "Plan the office move",
    journeyDescription:
      "Confirm office addresses, loading access, and building constraints before adding desks, chairs, equipment, and crates.",
    pickupTitle: "Current workplace",
    dropoffTitle: "New workplace",
    pickupPlaceholder: "e.g. current office or workplace address",
    dropoffPlaceholder: "e.g. new office or workplace address",
    inventoryTitle: "Office items",
    inventoryDescription:
      "Add desks, chairs, files, boxes, equipment, and any extra helpers needed for the relocation.",
    inventoryCta: "date and time",
    summaryNote: "Priced for an office relocation with item and access planning.",
  },
  {
    id: "other",
    label: "Other",
    description: "Flexible man-and-van help for anything that does not fit above.",
    serviceSlug: "man-and-van",
    imageSlug: "other",
    inventoryMode: "items",
    pathBadge: "Flexible item list",
    scopeBadge: "General transport",
    journeyTitle: "Plan the van job",
    journeyDescription:
      "Confirm the route, access, and what is moving so the quote can match the actual job.",
    pickupTitle: "Pickup",
    dropoffTitle: "Delivery",
    pickupPlaceholder: "e.g. pickup address",
    dropoffPlaceholder: "e.g. drop-off address",
    inventoryTitle: "Items to move",
    inventoryDescription:
      "Add the items, boxes, or notes that describe the job, then include any extra help needed.",
    inventoryCta: "date and time",
    summaryNote: "Priced as flexible man-and-van transport.",
  },
];

const CONTEXTUAL_BOOKING_SERVICE_OPTIONS: BookingServiceOption[] = [
  {
    id: "flat-removals",
    label: "Flat removals",
    description: "Studios, apartments, shared flats and upper-floor moves.",
    serviceSlug: "man-and-van",
    imageSlug: "flat-removals",
    inventoryMode: "rooms",
    pathBadge: "Flat inventory",
    scopeBadge: "Stairs and lifts",
    journeyTitle: "Plan the flat move",
    journeyDescription:
      "Confirm the collection and delivery access first, including floors, lifts, shared stairs and loading distance.",
    pickupTitle: "Current flat",
    dropoffTitle: "New flat",
    pickupPlaceholder: "e.g. flat, stair, floor and street address",
    dropoffPlaceholder: "e.g. new flat or delivery address",
    inventoryTitle: "Flat contents",
    inventoryDescription:
      "Choose the flat size and add rooms, boxes, furniture, dismantling or extra help needed for the move.",
    inventoryCta: "date and time",
    summaryNote: "Priced for a flat move with room and access planning.",
  },
  {
    id: "man-and-van",
    label: "Man and van",
    description: "Flexible van-with-driver help for smaller loads.",
    serviceSlug: "man-and-van",
    imageSlug: "man-and-van",
    inventoryMode: "items",
    pathBadge: "Flexible item list",
    scopeBadge: "Van with driver",
    journeyTitle: "Plan the man and van job",
    journeyDescription:
      "Confirm the route, access and what is moving so the quote can match the actual load and lifting help.",
    pickupTitle: "Pickup",
    dropoffTitle: "Delivery",
    pickupPlaceholder: "e.g. pickup address",
    dropoffPlaceholder: "e.g. drop-off address",
    inventoryTitle: "Items to move",
    inventoryDescription:
      "Add furniture, boxes, bags, appliances or notes that describe the job, then include any extra help needed.",
    inventoryCta: "date and time",
    summaryNote: "Priced as man and van transport with item inventory.",
  },
  {
    id: "student-move",
    label: "Student moves",
    description: "Halls, shared flats, suitcases, boxes and storage stops.",
    serviceSlug: "student-move",
    imageSlug: "student-move",
    inventoryMode: "items",
    pathBadge: "Student load",
    scopeBadge: "Term timing",
    journeyTitle: "Plan the student move",
    journeyDescription:
      "Confirm halls, flat, family-home or storage addresses, including check-in windows, floors and access at both ends.",
    pickupTitle: "Collection address",
    dropoffTitle: "Delivery address",
    pickupPlaceholder: "e.g. halls, shared flat, family home or storage unit",
    dropoffPlaceholder: "e.g. new accommodation, storage or home address",
    inventoryTitle: "Student belongings",
    inventoryDescription:
      "Add boxes, suitcases, small furniture, bikes or screens, then include storage or extra helper needs.",
    inventoryCta: "date and time",
    summaryNote: "Priced for student belongings, accommodation timing and storage context.",
  },
  {
    id: "small-moves",
    label: "Small moves",
    description: "Single rooms, partial loads and a few bulky items.",
    serviceSlug: "man-and-van",
    imageSlug: "man-and-van",
    inventoryMode: "rooms",
    pathBadge: "Small-load planner",
    scopeBadge: "Partial move",
    journeyTitle: "Plan the small move",
    journeyDescription:
      "Confirm the route and access, then list the room, bulky items or part load so the quote reflects the actual work.",
    pickupTitle: "Collection point",
    dropoffTitle: "Delivery point",
    pickupPlaceholder: "e.g. room, home, storage unit or seller address",
    dropoffPlaceholder: "e.g. delivery address",
    inventoryTitle: "Small move contents",
    inventoryDescription:
      "Add the room contents, boxes, bulky pieces or storage items and any extra lifting help needed.",
    inventoryCta: "date and time",
    summaryNote: "Priced for a smaller move while preserving the specific service context.",
  },
  {
    id: "business",
    label: "Business removals",
    description: "Shops, studios, commercial furniture and business equipment.",
    serviceSlug: "office-removal",
    imageSlug: "business-removals",
    inventoryMode: "items",
    pathBadge: "Business inventory",
    scopeBadge: "Commercial access",
    journeyTitle: "Plan the business move",
    journeyDescription:
      "Confirm the commercial premises, service entrance, access window and destination before adding stock, displays, furniture or equipment.",
    pickupTitle: "Current business address",
    dropoffTitle: "New business address",
    pickupPlaceholder: "e.g. shop, studio, clinic, unit, or business address",
    dropoffPlaceholder: "e.g. new premises or delivery address",
    inventoryTitle: "Business items",
    inventoryDescription:
      "Add commercial furniture, boxed stock, display pieces, shelving, equipment and any extra moving help needed.",
    inventoryCta: "date and time",
    summaryNote: "Priced for a business or commercial relocation using item and access details.",
  },
  {
    id: "packing-service",
    label: "Packing service",
    description: "Packing help when included with a suitable move.",
    serviceSlug: "packing-service",
    imageSlug: "packing-service",
    inventoryMode: "rooms",
    pathBadge: "Packing scope",
    scopeBadge: "Add-on planning",
    journeyTitle: "Plan the packing and move",
    journeyDescription:
      "Confirm the route and access first, then identify which rooms, fragile items or furniture preparation need packing help.",
    pickupTitle: "Property to pack",
    dropoffTitle: "Move destination",
    pickupPlaceholder: "e.g. current home, flat or office address",
    dropoffPlaceholder: "e.g. destination address",
    inventoryTitle: "Packing scope",
    inventoryDescription:
      "Add the rooms, boxes, fragile items and furniture preparation that need packing or dismantling help.",
    inventoryCta: "date and time",
    summaryNote: "Priced for packing support as part of a suitable moving job.",
  },
];

const ALL_BOOKING_SERVICE_OPTIONS = [
  ...BOOKING_SERVICE_OPTIONS,
  ...CONTEXTUAL_BOOKING_SERVICE_OPTIONS,
];

const OPTION_BY_ID = new Map(ALL_BOOKING_SERVICE_OPTIONS.map((option) => [option.id, option]));

const INTENT_ALIASES: Record<string, BookingIntentId> = {
  house: "house-removals",
  "house-removals": "house-removals",
  "house-removal": "house-removals",
  "long-distance-removals": "house-removals",
  "packing-service": "packing-service",
  "flat-removals": "flat-removals",
  "man-and-van": "man-and-van",
  "small-moves": "small-moves",
  "student-move": "student-move",
  furniture: "furniture",
  "furniture-delivery": "furniture",
  "ikea-delivery": "furniture",
  storage: "storage",
  "storage-transport": "storage",
  office: "office",
  "office-removal": "office",
  business: "business",
  "business-removals": "business",
  "commercial-removals": "business",
  "commercial-relocation": "business",
  other: "other",
  "piano-moving": "other",
  "same-day-delivery": "other",
  "same-day": "other",
  "rubbish-removal": "other",
};

export function normalizeBookingIntentId(value?: string | null): BookingIntentId | null {
  if (!value) return null;
  return INTENT_ALIASES[value] ?? null;
}

export function getBookingServiceOption(id?: string | null): BookingServiceOption | null {
  const normalized = normalizeBookingIntentId(id);
  return normalized ? OPTION_BY_ID.get(normalized) ?? null : null;
}

export function getBookingServiceOptionForState(
  entryServiceSlug?: string | null,
  serviceSlug?: string | null,
): BookingServiceOption | null {
  return getBookingServiceOption(entryServiceSlug) ?? getBookingServiceOption(serviceSlug);
}

export function getBookingServiceStartingFrom(option: BookingServiceOption): number | null {
  return SERVICES.find((service) => service.slug === option.serviceSlug)?.startingFrom ?? null;
}

export function getBookingHrefForService(serviceSlug?: string | null): string {
  return serviceSlug && resolveBookingService(serviceSlug)
    ? `/book?service=${encodeURIComponent(serviceSlug)}`
    : "/book";
}

/** Resolve the existing public service links and the homepage service choices. */
export function resolveBookingService(value?: string | null) {
  if (!value) return null;
  const service = SERVICES.find((candidate) => candidate.slug === value);
  const option = getBookingServiceOption(value);
  if (!service && !option) return null;

  if (!service && option) {
    return {
      serviceSlug: option.serviceSlug,
      serviceName: option.label,
      entryServiceSlug: option.id,
      inventoryMode: option.inventoryMode,
    };
  }

  const bookable = getBookableService(service!);
  const bookingOption = option ?? getBookingServiceOption(bookable.slug);
  const roomPlanner = ["house-removal", "flat-removals", "long-distance-removals", "small-moves"].includes(value);
  return {
    serviceSlug: bookable.slug,
    serviceName: service!.name,
    entryServiceSlug: bookingOption?.id ?? value,
    inventoryMode: roomPlanner ? "rooms" as const : bookingOption?.inventoryMode ?? "items" as const,
  };
}

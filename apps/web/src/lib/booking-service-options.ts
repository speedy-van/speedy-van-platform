import type { InventoryMode } from "./room-inventory";
import { SERVICES } from "./services";

export type BookingIntentId = "house-removals" | "furniture" | "storage" | "office" | "other";

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
    description: "Small office moves and business relocations.",
    serviceSlug: "office-removal",
    imageSlug: "office-removal",
    inventoryMode: "items",
    pathBadge: "Business inventory",
    scopeBadge: "Downtime-aware",
    journeyTitle: "Plan the office move",
    journeyDescription:
      "Confirm business addresses, loading access, and building constraints before adding desks, chairs, equipment, and crates.",
    pickupTitle: "Current workplace",
    dropoffTitle: "New workplace",
    pickupPlaceholder: "e.g. office, clinic, studio, or shop address",
    dropoffPlaceholder: "e.g. new office or business address",
    inventoryTitle: "Office items",
    inventoryDescription:
      "Add desks, chairs, files, boxes, equipment, and any extra helpers needed for the relocation.",
    inventoryCta: "date and time",
    summaryNote: "Priced for a business relocation or office move.",
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

const OPTION_BY_ID = new Map(BOOKING_SERVICE_OPTIONS.map((option) => [option.id, option]));

const INTENT_ALIASES: Record<string, BookingIntentId> = {
  "house-removals": "house-removals",
  "house-removal": "house-removals",
  "long-distance-removals": "house-removals",
  furniture: "furniture",
  "furniture-delivery": "furniture",
  storage: "storage",
  office: "office",
  "office-removal": "office",
  other: "other",
  "man-and-van": "other",
  "flat-removals": "other",
  "small-moves": "other",
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

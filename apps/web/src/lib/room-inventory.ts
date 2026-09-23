import {
  CATALOG_RECORD_BY_ID,
  presentRecord,
  type CatalogRecord,
} from "./item-presentation";

export type InventoryMode = "items" | "rooms";
export type BedroomCount = "studio" | "1" | "2" | "3" | "4" | "5+";
export type InventoryRoomKind =
  | "studio"
  | "bedroom"
  | "living"
  | "kitchen"
  | "boxes"
  | "dining"
  | "office"
  | "garage"
  | "garden"
  | "unassigned";

export interface InventoryRoom {
  id: string;
  label: string;
  kind: InventoryRoomKind;
  index?: number;
  optional?: boolean;
  skipped?: boolean;
}

export interface RoomSuggestionChoice {
  itemId: string;
  label?: string;
}

export interface RoomSuggestion {
  id: string;
  label: string;
  helperText?: string;
  defaultQty: number;
  initiallyChecked?: boolean;
  choices: RoomSuggestionChoice[];
}

export const BEDROOM_OPTIONS: { value: BedroomCount; label: string }[] = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 bedroom" },
  { value: "2", label: "2 bedrooms" },
  { value: "3", label: "3 bedrooms" },
  { value: "4", label: "4 bedrooms" },
  { value: "5+", label: "5+ bedrooms" },
];

export const OPTIONAL_ROOM_DEFS: InventoryRoom[] = [
  { id: "dining-room", label: "Dining room", kind: "dining", optional: true },
  { id: "home-office", label: "Home office", kind: "office", optional: true },
  { id: "garage", label: "Garage", kind: "garage", optional: true },
  { id: "garden", label: "Garden", kind: "garden", optional: true },
];

export const UNASSIGNED_ROOM: InventoryRoom = {
  id: "unassigned",
  label: "Unassigned items",
  kind: "unassigned",
};

export function exactBedroomsFor(count: BedroomCount | "", exact: number): number {
  if (count === "studio") return 0;
  if (count === "5+") return Math.max(5, Math.min(10, Math.trunc(exact || 5)));
  const parsed = Number(count);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function bedroomCountToPricingVariant(count: BedroomCount | ""): string {
  if (count === "5+") return "5+-bedroom";
  if (count === "4") return "4-bedroom";
  if (count === "3") return "3-bedroom";
  if (count === "2") return "2-bedroom";
  if (count === "1" || count === "studio") return "1-bedroom";
  return "";
}

function withExistingState(room: InventoryRoom, existing: Map<string, InventoryRoom>): InventoryRoom {
  const saved = existing.get(room.id);
  return saved ? { ...room, skipped: saved.skipped } : room;
}

export function buildRoomsForBedrooms(
  bedroomCount: BedroomCount | "",
  exactBedroomCount: number,
  existingRooms: InventoryRoom[] = [],
): InventoryRoom[] {
  if (!bedroomCount) return existingRooms;

  const existing = new Map(existingRooms.map((room) => [room.id, room]));
  const rooms: InventoryRoom[] = [];

  if (bedroomCount === "studio") {
    rooms.push(
      withExistingState(
        { id: "studio-living-sleeping", label: "Living/sleeping area", kind: "studio" },
        existing,
      ),
    );
  } else {
    const bedroomTotal = exactBedroomsFor(bedroomCount, exactBedroomCount);
    for (let index = 1; index <= bedroomTotal; index += 1) {
      rooms.push(
        withExistingState(
          { id: `bedroom-${index}`, label: `Bedroom ${index}`, kind: "bedroom", index },
          existing,
        ),
      );
    }
    rooms.push(withExistingState({ id: "living-room", label: "Living room", kind: "living" }, existing));
  }

  rooms.push(
    withExistingState({ id: "kitchen", label: "Kitchen", kind: "kitchen" }, existing),
    withExistingState({ id: "boxes-other", label: "Boxes & other items", kind: "boxes" }, existing),
  );

  for (const optionalRoom of OPTIONAL_ROOM_DEFS) {
    if (existing.has(optionalRoom.id)) {
      rooms.push(withExistingState(optionalRoom, existing));
    }
  }

  return rooms;
}

export function getRecordChoice(choice: RoomSuggestionChoice): CatalogRecord | undefined {
  return CATALOG_RECORD_BY_ID.get(choice.itemId);
}

export function labelForChoice(choice: RoomSuggestionChoice): string {
  const record = getRecordChoice(choice);
  return choice.label ?? (record ? presentRecord(record).label : choice.itemId);
}

const BED_FRAME_CHOICES: RoomSuggestionChoice[] = [
  { itemId: "single-bed-frame-wooden-3ft-white" },
  { itemId: "small-double-bed-frame-2-storage-drawers" },
  { itemId: "double-bed-frame-cavill-fabric-grey" },
  { itemId: "king-bed-frame-cavill-fabric-grey" },
  { itemId: "super-king-bed-frame-upholstered-6ft" },
  { itemId: "ottoman-bed-frame-upholstered-king-linen-fabric" },
  { itemId: "bunk-bed-frame-paddington-kids-white" },
];

const BEDROOM_SUGGESTIONS: RoomSuggestion[] = [
  {
    id: "bed-frame",
    label: "Bed frame",
    helperText: "Choose the actual bed size before adding.",
    defaultQty: 1,
    choices: BED_FRAME_CHOICES,
  },
  {
    id: "bed-frame-mattress-bundle",
    label: "Bed frame with mattress bundle",
    helperText: "Use this instead of separate bed frame items if it matches your item.",
    defaultQty: 1,
    initiallyChecked: false,
    choices: [{ itemId: "double-bed-frame-harper-storage-mattress" }],
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    defaultQty: 1,
    choices: [
      { itemId: "wardrobe-single-door-space-saving-bedroom-storage-unit" },
      { itemId: "wardrobe-double-door-hodedah-two-drawers-hanging-rod" },
      { itemId: "wardrobe-triple-door-quarte-modern-3-door-2-drawers" },
      { itemId: "sliding-door-wardrobe-smartstandard-56-x80" },
      { itemId: "mirrored-wardrobe-better-home-products-wood-double-sliding" },
    ],
  },
  { id: "chest-drawers", label: "Chest of drawers", defaultQty: 1, choices: [{ itemId: "chest-drawers-mahogany" }] },
  { id: "bedside-table", label: "Bedside table", defaultQty: 1, choices: [{ itemId: "side-table-round-2-tier-fantersi" }] },
  { id: "dressing-table", label: "Dressing table", defaultQty: 1, choices: [{ itemId: "console-table-59inch-drawers-williamspace" }] },
  { id: "mirror", label: "Mirror", defaultQty: 1, choices: [{ itemId: "mirror-silver-beveled-39x28-rectangle" }] },
];

const LIVING_SUGGESTIONS: RoomSuggestion[] = [
  { id: "sofa", label: "Sofa", defaultQty: 1, choices: [
    { itemId: "loveseat-2-seat-fabric-63inch" },
    { itemId: "sofa-3-seat-fabric-modern-lestar" },
    { itemId: "sectional-4-seat-l-shaped-convertible" },
    { itemId: "sectional-6-seat-convertible-modular" },
    { itemId: "sleeper-sofa-3in1-convertible-howcool" },
  ] },
  { id: "armchair", label: "Armchair", defaultQty: 1, choices: [{ itemId: "armchair-1-seat-accent-chair" }] },
  { id: "coffee-table", label: "Coffee table", defaultQty: 1, choices: [{ itemId: "coffee-table-modern-povison-living-room" }] },
  { id: "tv", label: "TV", defaultQty: 1, choices: [
    { itemId: "television-32inch-smart-led-hd" },
    { itemId: "television-43inch-samsung-crystal" },
    { itemId: "television-50inch-smart-4k-google" },
    { itemId: "television-55inch-lg-oled-c4" },
    { itemId: "television-65inch-best-2025" },
  ] },
  { id: "tv-stand", label: "TV stand", defaultQty: 1, choices: [{ itemId: "tv-stand-65inch-enhomee-large" }] },
  { id: "bookcase", label: "Bookcase", defaultQty: 1, choices: [{ itemId: "bookcase-5-shelf-wooden-standing" }] },
];

const KITCHEN_SUGGESTIONS: RoomSuggestion[] = [
  { id: "fridge-freezer", label: "Fridge freezer", defaultQty: 1, choices: [
    { itemId: "refrigerator-top-freezer-7-5cuft" },
    { itemId: "american-fridge-freezer-bosch" },
    { itemId: "mini-fridge-compact-single-door" },
  ] },
  { id: "washing-machine", label: "Washing machine", defaultQty: 1, choices: [{ itemId: "washing-machine-standard-dimensions" }] },
  { id: "dishwasher", label: "Dishwasher", defaultQty: 1, initiallyChecked: false, choices: [{ itemId: "dishwasher-portable-vs-builtin" }] },
  { id: "microwave", label: "Microwave", defaultQty: 1, choices: [{ itemId: "microwave-countertop-1-1cuft-1000watt" }] },
  { id: "kitchen-boxes", label: "Packed kitchen boxes", defaultQty: 4, choices: [{ itemId: "moving-boxes-uboxes-with-handles-10-premium" }] },
];

const BOXES_SUGGESTIONS: RoomSuggestion[] = [
  { id: "moving-boxes", label: "Moving boxes", defaultQty: 8, choices: [
    { itemId: "moving-boxes-uboxes-with-handles-10-premium" },
    { itemId: "moving-boxes-8-best-top-moving-house-boxes" },
    { itemId: "moving-boxes-uboxes-1-room-economy-kit-15-boxes" },
  ] },
  { id: "suitcases", label: "Suitcases or bags", defaultQty: 2, choices: [
    { itemId: "suitcase-luggage-extra-large-33-lightweight-4-wheel-abs-hard-shell" },
    { itemId: "travel-bag-litvyak-duffle-50l-canvas" },
  ] },
  { id: "storage-boxes", label: "Storage boxes", defaultQty: 2, choices: [{ itemId: "storage-boxes-fabric-household-essentials" }] },
];

const DINING_SUGGESTIONS: RoomSuggestion[] = [
  { id: "dining-table", label: "Dining table", defaultQty: 1, choices: [
    { itemId: "round-dining-table-48inch" },
    { itemId: "dining-table-extendable-55inch" },
    { itemId: "dining-table-set-6seater-modern" },
  ] },
  { id: "dining-chairs", label: "Dining chairs", defaultQty: 1, choices: [
    { itemId: "dining-chairs-walnut-leather-set2" },
    { itemId: "dining-chairs-mid-century-set6" },
  ] },
];

const OFFICE_SUGGESTIONS: RoomSuggestion[] = [
  { id: "office-desk", label: "Office desk", defaultQty: 1, choices: [
    { itemId: "office-desk-nsdirect-modern-computer-63-inch-large" },
    { itemId: "office-desk-logan-antigua-66-u-shaped-executive-hutch" },
  ] },
  { id: "office-chair", label: "Office chair", defaultQty: 1, choices: [{ itemId: "office-chair-felixking-ergonomic-headrest-desk" }] },
  { id: "monitor", label: "Monitor", defaultQty: 1, choices: [{ itemId: "computer-monitor-27inch-hp" }] },
  { id: "desktop", label: "Desktop computer", defaultQty: 1, choices: [{ itemId: "desktop-computer-hp-tower" }] },
];

const GARAGE_SUGGESTIONS: RoomSuggestion[] = [
  { id: "storage-boxes", label: "Storage boxes", defaultQty: 3, choices: [{ itemId: "storage-boxes-fabric-household-essentials" }] },
  { id: "tool-storage", label: "Storage trunk", defaultQty: 1, choices: [{ itemId: "storage-trunk-signature-design-ashley-kettleby" }] },
];

const GARDEN_SUGGESTIONS: RoomSuggestion[] = [
  { id: "outdoor-storage", label: "Outdoor storage box", defaultQty: 1, choices: [{ itemId: "outdoor-storage-box-100-gallon" }] },
  { id: "plant-stand", label: "Plant stand", defaultQty: 1, choices: [{ itemId: "plant-stand-indoor-outdoor" }] },
];

export function getSuggestionsForRoom(room: InventoryRoom): RoomSuggestion[] {
  if (room.kind === "studio") {
    return [
      ...BEDROOM_SUGGESTIONS.slice(0, 4),
      ...LIVING_SUGGESTIONS.slice(0, 4),
      ...BOXES_SUGGESTIONS.slice(0, 1),
    ];
  }
  if (room.kind === "bedroom") return BEDROOM_SUGGESTIONS;
  if (room.kind === "living") return LIVING_SUGGESTIONS;
  if (room.kind === "kitchen") return KITCHEN_SUGGESTIONS;
  if (room.kind === "boxes") return BOXES_SUGGESTIONS;
  if (room.kind === "dining") return DINING_SUGGESTIONS;
  if (room.kind === "office") return OFFICE_SUGGESTIONS;
  if (room.kind === "garage") return GARAGE_SUGGESTIONS;
  if (room.kind === "garden") return GARDEN_SUGGESTIONS;
  return [];
}

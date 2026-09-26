"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaBoxOpen, FaChair, FaCouch, FaPlusCircle, FaTable, FaTv, FaDoorOpen } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import type { SelectedItem } from "@/lib/booking-store";
import {
  CATALOG_RECORDS,
  CATALOG_RECORD_BY_ID,
  getCategoryOptions,
  getRecordsForCategory,
  presentRecord,
  searchCatalogRecords,
  type CatalogRecord,
  type SearchResult,
} from "@/lib/item-presentation";
import {
  BEDROOM_OPTIONS,
  OPTIONAL_ROOM_DEFS,
  UNASSIGNED_ROOM,
  buildRoomsForBedrooms,
  exactBedroomsFor,
  getSuggestionsForRoom,
  labelForChoice,
  type BedroomCount,
  type InventoryMode,
  type InventoryRoom,
} from "@/lib/room-inventory";

interface ItemPickerProps {
  items: SelectedItem[];
  onChange: (items: SelectedItem[]) => void;
  serviceSlug?: string;
  entryServiceSlug?: string;
  inventoryMode?: InventoryMode;
  onInventoryModeChange?: (mode: InventoryMode) => void;
  bedroomCount?: BedroomCount | "";
  exactBedroomCount?: number;
  rooms?: InventoryRoom[];
  onBedroomConfigChange?: (
    bedroomCount: BedroomCount | "",
    exactBedroomCount: number,
    rooms: InventoryRoom[],
  ) => void;
  onRoomsChange?: (rooms: InventoryRoom[]) => void;
}

interface PendingBedroomChange {
  bedroomCount: BedroomCount | "";
  exactBedroomCount: number;
  rooms: InventoryRoom[];
  affectedRoomIds: string[];
}

interface SuggestionDraftItem {
  suggestionId: string;
  checked: boolean;
  quantity: number;
  itemId: string;
}

type AnyVanQuickGroupSlug =
  | "sofas"
  | "wardrobes"
  | "boxes"
  | "tables"
  | "televisions"
  | "chairs"
  | "custom";

interface AnyVanQuickItem {
  itemId: string;
  label: string;
}

interface AnyVanQuickGroup {
  slug: AnyVanQuickGroupSlug;
  label: string;
  Icon: IconType;
  items: AnyVanQuickItem[];
}

const MAX_VISIBLE_SEARCH_RESULTS = 6;
const MAX_VISIBLE_ROOM_RESULTS = 8;
const MAX_VISIBLE_SUGGESTIONS = 6;
const MAX_VISIBLE_QUICK_ITEMS = 5;
const MAX_QTY = 99;

const ROOM_PLANNER_SERVICE_SLUGS = new Set(["house-removal", "man-and-van", "student-move"]);
const ROOM_PLANNER_ENTRY_SLUGS = new Set([
  "house-removal",
  "flat-removals",
  "long-distance-removals",
  "small-moves",
]);

const ANYVAN_QUICK_GROUPS: AnyVanQuickGroup[] = [
  {
    slug: "sofas",
    label: "Sofas",
    Icon: FaCouch,
    items: [
      { itemId: "loveseat-2-seat-fabric-63inch", label: "Two Seater Sofa" },
      { itemId: "sofa-3-seat-fabric-modern-lestar", label: "Three Seater Sofa" },
      { itemId: "chesterfield-sofa-4-seat-traditional", label: "Four Seater Sofa" },
      { itemId: "sectional-4-seat-l-shaped-convertible", label: "L Shaped Sofa" },
      { itemId: "recliner-sofa-leather-power-edward", label: "Two Seater Reclining Sofa" },
      { itemId: "recliner-sofa-3-seat-leather-tufted", label: "Three Seater Reclining Sofa" },
      { itemId: "sleeper-sofa-3in1-small-tufted", label: "Two Seater Sofa Bed" },
      { itemId: "sleeper-sofa-3in1-convertible-howcool", label: "Three Seater Sofa Bed" },
      { itemId: "sectional-4-seat-convertible-storage", label: "Corner Sofa Bed" },
    ],
  },
  {
    slug: "wardrobes",
    label: "Wardrobes",
    Icon: FaDoorOpen,
    items: [
      { itemId: "wardrobe-single-door-space-saving-bedroom-storage-unit", label: "Single Wardrobe" },
      { itemId: "wardrobe-double-door-hodedah-two-drawers-hanging-rod", label: "Double Wardrobe" },
      { itemId: "wardrobe-triple-door-quarte-modern-3-door-2-drawers", label: "Triple Wardrobe" },
      { itemId: "sliding-door-wardrobe-smartstandard-56-x80", label: "Sliding Wardrobe" },
      { itemId: "corner-wardrobe-polygon-hanging-storage-closet-cabinet", label: "Corner Wardrobe" },
      { itemId: "mirrored-wardrobe-better-home-products-wood-double-sliding", label: "Mirrored Wardrobe" },
    ],
  },
  {
    slug: "boxes",
    label: "Boxes",
    Icon: FaBoxOpen,
    items: [
      { itemId: "moving-boxes-uboxes-with-handles-10-premium", label: "Small Box Set" },
      { itemId: "moving-boxes-8-best-top-moving-house-boxes", label: "Medium Box Set" },
      { itemId: "moving-boxes-uboxes-1-room-economy-kit-15-boxes", label: "Room Box Kit" },
      { itemId: "storage-boxes-fabric-household-essentials", label: "Storage Boxes" },
      { itemId: "suitcase-luggage-extra-large-33-lightweight-4-wheel-abs-hard-shell", label: "Suitcase" },
      { itemId: "travel-bag-litvyak-duffle-50l-canvas", label: "Travel Bag" },
    ],
  },
  {
    slug: "tables",
    label: "Tables",
    Icon: FaTable,
    items: [
      { itemId: "coffee-table-modern-povison-living-room", label: "Coffee Table" },
      { itemId: "side-table-round-2-tier-fantersi", label: "Side Table" },
      { itemId: "console-table-59inch-drawers-williamspace", label: "Console Table" },
      { itemId: "dining-table-extendable-55inch", label: "Dining Table" },
      { itemId: "round-dining-table-48inch", label: "Round Dining Table" },
      { itemId: "dining-table-set-6seater-modern", label: "Six Seater Dining Set" },
      { itemId: "office-desk-nsdirect-modern-computer-63-inch-large", label: "Office Desk" },
    ],
  },
  {
    slug: "televisions",
    label: "Televisions",
    Icon: FaTv,
    items: [
      { itemId: "television-32inch-smart-led-hd", label: "32 Inch Television" },
      { itemId: "television-43inch-samsung-crystal", label: "43 Inch Television" },
      { itemId: "television-50inch-smart-4k-google", label: "50 Inch Television" },
      { itemId: "television-55inch-lg-oled-c4", label: "55 Inch Television" },
      { itemId: "television-65inch-best-2025", label: "65 Inch Television" },
      { itemId: "computer-monitor-27inch-hp", label: "Computer Monitor" },
    ],
  },
  {
    slug: "chairs",
    label: "Chairs",
    Icon: FaChair,
    items: [
      { itemId: "armchair-1-seat-accent-chair", label: "Armchair" },
      { itemId: "armchair-rolled-accent-set-2", label: "Two Armchairs" },
      { itemId: "dining-chairs-walnut-leather-set2", label: "Dining Chairs (Set of 2)" },
      { itemId: "dining-chairs-mid-century-set6", label: "Dining Chairs (Set of 6)" },
      { itemId: "office-chair-felixking-ergonomic-headrest-desk", label: "Office Chair" },
      { itemId: "rocking-chair-nursery-ergonomic-papasan", label: "Rocking Chair" },
      { itemId: "high-chair-feeding-position", label: "High Chair" },
    ],
  },
  {
    slug: "custom",
    label: "Add Your Own Item",
    Icon: FaPlusCircle,
    items: [],
  },
];

function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_QTY, Math.trunc(value)));
}

function makeRoomLineId(roomId: string, itemId: string): string {
  return `${roomId}:${itemId}`;
}

function selectedItemKey(item: SelectedItem, index: number): string {
  if (item.lineId) return item.lineId;
  if (item.roomId && item.itemId) return makeRoomLineId(item.roomId, item.itemId);
  if (item.itemId) return `unassigned:${item.itemId}`;
  return `legacy:${item.name}:${index}`;
}

function mergeDuplicateItems(items: SelectedItem[]): SelectedItem[] {
  const merged = new Map<string, SelectedItem>();

  for (const item of items) {
    const key = item.roomId && item.itemId
      ? makeRoomLineId(item.roomId, item.itemId)
      : item.lineId ?? item.itemId ?? item.name;
    const existing = merged.get(key);
    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: clampQuantity(existing.quantity + item.quantity),
      });
    } else {
      merged.set(key, item);
    }
  }

  return Array.from(merged.values());
}

function QuantityControls({
  quantity,
  itemName,
  onSetQuantity,
  disabled,
}: {
  quantity: number;
  itemName: string;
  onSetQuantity: (quantity: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2" aria-label="Quantity">
      <button
        type="button"
        onClick={() => onSetQuantity(quantity - 1)}
        disabled={disabled || quantity <= 0}
        className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/8 text-lg font-bold text-white/75 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Remove one ${itemName}`}
      >
        -
      </button>
      <span className="min-w-8 text-center text-base font-bold text-white" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onSetQuantity(quantity + 1)}
        disabled={disabled || quantity >= MAX_QTY}
        className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500 text-lg font-bold text-black transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Add one ${itemName}`}
      >
        +
      </button>
    </div>
  );
}

function InlineQuantityControls({
  quantity,
  itemName,
  onSetQuantity,
}: {
  quantity: number;
  itemName: string;
  onSetQuantity: (quantity: number) => void;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-amber-500/30" style={{ background: "rgba(245,158,11,0.08)" }} aria-label="Quantity">
      <button
        type="button"
        onClick={() => onSetQuantity(quantity - 1)}
        disabled={quantity <= 0}
        className="flex h-11 w-11 items-center justify-center text-sm font-bold text-white/75 transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Remove one ${itemName}`}
      >
        −
      </button>
      <span className="min-w-8 border-x border-amber-500/20 text-center text-sm font-bold text-amber-400" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onSetQuantity(quantity + 1)}
        disabled={quantity >= MAX_QTY}
        className="flex h-11 w-11 items-center justify-center bg-amber-500 text-sm font-bold text-black transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Add one ${itemName}`}
      >
        +
      </button>
    </div>
  );
}

function QuickAddRow({
  label,
  unavailableLabel,
  quantity,
  onSetQuantity,
  contextLabel,
}: {
  label: string;
  unavailableLabel?: string;
  quantity: number;
  onSetQuantity: (quantity: number) => void;
  contextLabel?: string;
}) {
  const unavailable = Boolean(unavailableLabel);

  return (
    <div
      className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/8 px-4 py-2 transition last:border-b-0"
      style={quantity > 0 ? { background: "rgba(245,158,11,0.08)" } : undefined}
    >
      <div className="min-w-0">
        <p className="break-words text-[13px] font-medium leading-snug text-white/85">{label}</p>
        {contextLabel && !unavailable && (
          <p className="mt-0.5 break-words text-[11px] font-semibold text-amber-400/70">
            Adds to {contextLabel}
          </p>
        )}
      </div>
      {unavailable ? (
        <span className="rounded-md px-3 py-2 text-xs font-semibold text-white/25" style={{ background: "rgba(255,255,255,0.04)" }}>
          {unavailableLabel}
        </span>
      ) : quantity > 0 ? (
        <InlineQuantityControls itemName={label} quantity={quantity} onSetQuantity={onSetQuantity} />
      ) : (
        <button
          type="button"
          onClick={() => onSetQuantity(1)}
          className="min-h-10 rounded-lg px-3 text-xs font-bold text-amber-400 transition hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label={`Add ${label}`}
        >
          +add
        </button>
      )}
    </div>
  );
}

export function ItemPicker({
  items,
  onChange,
  serviceSlug = "",
  entryServiceSlug = "",
  inventoryMode = "items",
  onInventoryModeChange,
  bedroomCount = "",
  exactBedroomCount = 5,
  rooms = [],
  onBedroomConfigChange,
  onRoomsChange,
}: ItemPickerProps) {
  const [activeQuickGroupSlug, setActiveQuickGroupSlug] =
    useState<AnyVanQuickGroupSlug | null>(null);
  const [showAllQuickItems, setShowAllQuickItems] = useState(false);
  const [search, setSearch] = useState("");
  const [showAllSearch, setShowAllSearch] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [showAllRoomItems, setShowAllRoomItems] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [pendingBedroomChange, setPendingBedroomChange] = useState<PendingBedroomChange | null>(null);
  const [suggestionDraft, setSuggestionDraft] = useState<SuggestionDraftItem[] | null>(null);
  const latestItems = useRef(items);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const entrySlug = entryServiceSlug || serviceSlug;
  const roomPlannerAvailable =
    ROOM_PLANNER_SERVICE_SLUGS.has(serviceSlug) || ROOM_PLANNER_ENTRY_SLUGS.has(entrySlug);
  const roomMode = roomPlannerAvailable && inventoryMode === "rooms";

  useEffect(() => {
    latestItems.current = items;
  }, [items]);

  useEffect(() => {
    if (activeRoomId) {
      panelRef.current?.focus();
    }
  }, [activeRoomId]);

  useEffect(() => {
    if (!roomMode || !bedroomCount || rooms.length > 0 || !onBedroomConfigChange) return;
    onBedroomConfigChange(
      bedroomCount,
      exactBedroomCount,
      buildRoomsForBedrooms(bedroomCount, exactBedroomCount, rooms),
    );
  }, [bedroomCount, exactBedroomCount, onBedroomConfigChange, roomMode, rooms]);

  const roomIdsKey = rooms.map((room) => room.id).join("|");
  const unassignedItems = useMemo(() => items.filter((item) => !item.roomId), [items]);
  const roomsWithLegacy = useMemo(
    () => (unassignedItems.length > 0 ? [...rooms, UNASSIGNED_ROOM] : rooms),
    [rooms, unassignedItems.length],
  );

  useEffect(() => {
    if (!roomMode) return;
    const nextRoom = roomsWithLegacy.find((room) => room.id === activeRoomId) ?? roomsWithLegacy[0] ?? null;
    if (nextRoom?.id !== activeRoomId) {
      setActiveRoomId(nextRoom?.id ?? null);
    }
  }, [activeRoomId, roomIdsKey, roomMode, roomsWithLegacy]);

  const selectedByClassicId = useMemo(() => {
    const map = new Map<string, SelectedItem>();
    for (const item of items) {
      if (!item.roomId && item.itemId) map.set(item.itemId, item);
    }
    return map;
  }, [items]);

  const selectedByRoomLine = useMemo(() => {
    const map = new Map<string, SelectedItem>();
    for (const item of items) {
      if (item.roomId && item.itemId) {
        map.set(makeRoomLineId(item.roomId, item.itemId), item);
      }
    }
    return map;
  }, [items]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalLines = items.length;
  const activeQuickGroup = activeQuickGroupSlug
    ? ANYVAN_QUICK_GROUPS.find((group) => group.slug === activeQuickGroupSlug) ?? null
    : null;
  const activeRoom = roomsWithLegacy.find((room) => room.id === activeRoomId) ?? null;
  const searchQuery = search.trim();
  const searchResults = useMemo(() => searchCatalogRecords(searchQuery), [searchQuery]);
  const visibleSearchResults = showAllSearch
    ? searchResults
    : searchResults.slice(0, MAX_VISIBLE_SEARCH_RESULTS);
  const categoryOptions = useMemo(() => getCategoryOptions(), []);
  const roomRecords = useMemo(
    () => (activeCategorySlug ? getRecordsForCategory(activeCategorySlug).map(presentRecord) : []),
    [activeCategorySlug],
  );
  const visibleRoomRecords = showAllRoomItems
    ? roomRecords
    : roomRecords.slice(0, MAX_VISIBLE_ROOM_RESULTS);
  const suggestions = activeRoom ? getSuggestionsForRoom(activeRoom) : [];
  const visibleSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, MAX_VISIBLE_SUGGESTIONS);

  function getQty(itemId: string, room?: InventoryRoom | null): number {
    if (room?.id && room.id !== UNASSIGNED_ROOM.id) {
      return selectedByRoomLine.get(makeRoomLineId(room.id, itemId))?.quantity ?? 0;
    }
    return selectedByClassicId.get(itemId)?.quantity ?? 0;
  }

  function setQty(record: CatalogRecord, label: string, requestedQty: number, room?: InventoryRoom | null) {
    const quantity = clampQuantity(requestedQty);
    let next: SelectedItem[];

    if (room?.id && room.id !== UNASSIGNED_ROOM.id) {
      const lineId = makeRoomLineId(room.id, record.slug);
      next = latestItems.current.filter((item) => {
        if (item.lineId === lineId) return false;
        return !(item.roomId === room.id && item.itemId === record.slug);
      });
      if (quantity > 0) {
        next.push({
          lineId,
          roomId: room.id,
          roomName: room.label,
          itemId: record.slug,
          name: label,
          quantity,
        });
      }
    } else {
      next = latestItems.current.filter((item) => item.roomId || item.itemId !== record.slug);
      if (quantity > 0) {
        next.push({ itemId: record.slug, name: label, quantity });
      }
    }

    latestItems.current = next;
    onChange(next);
  }

  function updateExistingItem(item: SelectedItem, index: number, requestedQty: number) {
    const quantity = clampQuantity(requestedQty);
    const key = selectedItemKey(item, index);
    const next = latestItems.current
      .map((candidate, candidateIndex) => {
        if (selectedItemKey(candidate, candidateIndex) !== key) return candidate;
        return quantity > 0 ? { ...candidate, quantity } : null;
      })
      .filter((candidate): candidate is SelectedItem => Boolean(candidate));
    latestItems.current = next;
    onChange(next);
  }

  function removeExistingItem(item: SelectedItem, index: number) {
    updateExistingItem(item, index, 0);
  }

  function roomItemCount(room: InventoryRoom): number {
    return room.id === UNASSIGNED_ROOM.id
      ? unassignedItems.reduce((acc, item) => acc + item.quantity, 0)
      : items.filter((item) => item.roomId === room.id).reduce((acc, item) => acc + item.quantity, 0);
  }

  function applyBedroomConfig(nextCount: BedroomCount | "", nextExact: number, nextRooms: InventoryRoom[]) {
    onBedroomConfigChange?.(nextCount, nextExact, nextRooms);
    const nextActive = nextRooms.find((room) => room.id === activeRoomId) ?? nextRooms[0] ?? null;
    setActiveRoomId(nextActive?.id ?? null);
    setSuggestionDraft(null);
  }

  function requestBedroomConfig(nextCount: BedroomCount | "", rawExact: number) {
    const nextExact = nextCount === "5+" ? Math.max(5, Math.min(10, Math.trunc(rawExact || 5))) : rawExact;
    const nextRooms = buildRoomsForBedrooms(nextCount, nextExact, rooms);
    const nextIds = new Set(nextRooms.map((room) => room.id));
    const affectedRoomIds = rooms
      .filter((room) => !nextIds.has(room.id) && roomItemCount(room) > 0)
      .map((room) => room.id);

    if (affectedRoomIds.length > 0) {
      setPendingBedroomChange({
        bedroomCount: nextCount,
        exactBedroomCount: nextExact,
        rooms: nextRooms,
        affectedRoomIds,
      });
      return;
    }

    applyBedroomConfig(nextCount, nextExact, nextRooms);
  }

  function finishPendingBedroomChange(strategy: "move" | "remove") {
    if (!pendingBedroomChange) return;
    const affected = new Set(pendingBedroomChange.affectedRoomIds);
    let nextItems = latestItems.current;

    if (strategy === "remove") {
      nextItems = nextItems.filter((item) => !item.roomId || !affected.has(item.roomId));
    } else {
      const targetRoom = pendingBedroomChange.rooms.find((room) => room.id === "boxes-other");
      if (targetRoom) {
        nextItems = mergeDuplicateItems(
          nextItems.map((item) => {
            if (!item.roomId || !affected.has(item.roomId)) return item;
            return {
              ...item,
              roomId: targetRoom.id,
              roomName: targetRoom.label,
              lineId: item.itemId ? makeRoomLineId(targetRoom.id, item.itemId) : item.lineId,
            };
          }),
        );
      }
    }

    latestItems.current = nextItems;
    onChange(nextItems);
    applyBedroomConfig(
      pendingBedroomChange.bedroomCount,
      pendingBedroomChange.exactBedroomCount,
      pendingBedroomChange.rooms,
    );
    setPendingBedroomChange(null);
  }

  function addOptionalRoom(room: InventoryRoom) {
    if (rooms.some((existing) => existing.id === room.id)) return;
    const nextRooms = [...rooms, room];
    onRoomsChange?.(nextRooms);
    setActiveRoomId(room.id);
  }

  function updateRoom(roomId: string, patch: Partial<InventoryRoom>) {
    const nextRooms = rooms.map((room) => (room.id === roomId ? { ...room, ...patch } : room));
    onRoomsChange?.(nextRooms);
  }

  function openSuggestionPreview() {
    setSuggestionDraft(
      suggestions
        .filter((suggestion) => suggestion.choices.some((choice) => CATALOG_RECORD_BY_ID.has(choice.itemId)))
        .map((suggestion) => {
          const firstAvailable = suggestion.choices.find((choice) => CATALOG_RECORD_BY_ID.has(choice.itemId));
          return {
            suggestionId: suggestion.id,
            checked: suggestion.initiallyChecked !== false,
            quantity: suggestion.defaultQty,
            itemId: firstAvailable?.itemId ?? suggestion.choices[0]?.itemId ?? "",
          };
        })
        .filter((draft) => draft.itemId),
    );
  }

  function updateSuggestionDraft(suggestionId: string, patch: Partial<SuggestionDraftItem>) {
    setSuggestionDraft((current) =>
      current?.map((entry) =>
        entry.suggestionId === suggestionId ? { ...entry, ...patch } : entry,
      ) ?? null,
    );
  }

  function confirmSuggestionDraft(room: InventoryRoom) {
    if (!suggestionDraft) return;
    const next = [...latestItems.current];

    for (const draft of suggestionDraft) {
      if (!draft.checked || draft.quantity <= 0) continue;
      const suggestion = suggestions.find((entry) => entry.id === draft.suggestionId);
      const record = CATALOG_RECORD_BY_ID.get(draft.itemId);
      if (!suggestion || !record) continue;
      const lineId = makeRoomLineId(room.id, record.slug);
      const label = presentRecord(record).label;
      const existing = next.find((item) => item.roomId === room.id && item.itemId === record.slug);
      if (existing) {
        existing.quantity = Math.max(existing.quantity, clampQuantity(draft.quantity));
        existing.lineId = lineId;
        existing.roomName = room.label;
      } else {
        next.push({
          lineId,
          roomId: room.id,
          roomName: room.label,
          itemId: record.slug,
          name: label,
          quantity: clampQuantity(draft.quantity),
        });
      }
    }

    const merged = mergeDuplicateItems(next);
    latestItems.current = merged;
    onChange(merged);
    setSuggestionDraft(null);
  }

  function renderQuickRow(item: AnyVanQuickItem, room?: InventoryRoom | null, key = item.itemId) {
    const record = CATALOG_RECORD_BY_ID.get(item.itemId);
    return (
      <QuickAddRow
        key={key}
        label={item.label}
        unavailableLabel={record ? undefined : "Unavailable"}
        quantity={record ? getQty(record.slug, room) : 0}
        contextLabel={room?.id !== UNASSIGNED_ROOM.id ? room?.label : undefined}
        onSetQuantity={(qty) => {
          if (record) setQty(record, item.label, qty, room);
        }}
      />
    );
  }

  function renderSearchRow(entry: SearchResult, room?: InventoryRoom | null) {
    return renderQuickRow({ itemId: entry.record.slug, label: entry.label }, room, entry.record.slug);
  }

  function renderSearchResults(room?: InventoryRoom | null) {
    if (!searchQuery) return null;

    return (
      <div className="space-y-4" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white/90">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="min-h-11 rounded-lg border border-white/10 px-3 text-sm font-semibold text-white/60 hover:bg-white/4"
          >
            Clear search
          </button>
        </div>

        {searchResults.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/4 p-4 text-sm text-white/60">
            <p className="font-semibold text-white/90">No matching items found.</p>
            <p className="mt-1">Try another item name or browse more items.</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              {visibleSearchResults.map((entry) => renderSearchRow(entry, room))}
            </div>
            {searchResults.length > visibleSearchResults.length && (
              <button
                type="button"
                onClick={() => setShowAllSearch(true)}
                className="min-h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white/75 hover:bg-white/10"
              >
                Show {searchResults.length - visibleSearchResults.length} more match
                {searchResults.length - visibleSearchResults.length !== 1 ? "es" : ""}
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  function renderCatalogBrowse(room?: InventoryRoom | null) {
    const activeCategory = categoryOptions.find((category) => category.slug === activeCategorySlug);

    return (
      <div className="space-y-3 rounded-lg border border-white/10 bg-white/4 p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categoryOptions.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => {
                setActiveCategorySlug(category.slug);
                setShowAllRoomItems(false);
              }}
              className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                activeCategorySlug === category.slug
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
              }`}
            >
              <span className="block break-words">{category.label}</span>
            </button>
          ))}
        </div>

        {activeCategory ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase text-white/45">{activeCategory.label}</h3>
              {roomRecords.length > visibleRoomRecords.length && !showAllRoomItems && (
                <button
                  type="button"
                  onClick={() => setShowAllRoomItems(true)}
                  className="min-h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white/60 hover:bg-white/10"
                >
                  Show all {roomRecords.length}
                </button>
              )}
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              {visibleRoomRecords.map((entry) =>
                renderQuickRow({ itemId: entry.record.slug, label: entry.label }, room, entry.record.slug),
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 bg-white/3 p-4 text-sm text-white/45">
            Choose a category to add more items.
          </div>
        )}
      </div>
    );
  }

  function toggleQuickGroup(group: AnyVanQuickGroup) {
    const nextGroupSlug = activeQuickGroupSlug === group.slug ? null : group.slug;
    setActiveQuickGroupSlug(nextGroupSlug);
    setShowAllQuickItems(false);
    setShowAllRoomItems(false);

    if (nextGroupSlug === "custom" && !activeCategorySlug) {
      setActiveCategorySlug(categoryOptions[0]?.slug ?? null);
    }
  }

  function renderAnyVanQuickAdd(room?: InventoryRoom | null) {
    const quickItems = activeQuickGroup && activeQuickGroup.slug !== "custom"
      ? showAllQuickItems
        ? activeQuickGroup.items
        : activeQuickGroup.items.slice(0, MAX_VISIBLE_QUICK_ITEMS)
      : [];
    const hiddenQuickItems = activeQuickGroup && activeQuickGroup.slug !== "custom"
      ? Math.max(0, activeQuickGroup.items.length - quickItems.length)
      : 0;
    const dropdownHeight = activeQuickGroup && activeQuickGroup.slug !== "custom"
      ? Math.max(190, quickItems.length * 38 + (hiddenQuickItems > 0 ? 42 : 10))
      : 0;

    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-white/75">
          Or quickly add from our list of popular items below:
        </p>
        <div className="relative grid grid-cols-2 gap-2 overflow-visible sm:grid-cols-3">
          {ANYVAN_QUICK_GROUPS.map((group, index) => {
            const selected = activeQuickGroupSlug === group.slug;
            const Icon = group.Icon;
            const desktopAlign = index % 3 === 2 ? "sm:left-auto sm:right-0" : "sm:left-0 sm:right-auto";
            return (
              <div
                key={group.slug}
                className={`relative ${selected ? "z-20" : "z-0"} ${
                  selected && group.slug !== "custom" ? "max-sm:col-span-2" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleQuickGroup(group)}
                  className={`grid min-h-12 w-full grid-cols-[18px_minmax(0,1fr)_16px] items-center gap-2 rounded border px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    selected
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
                  }`}
                  aria-expanded={selected}
                >
                  <Icon className={`h-4 w-4 ${selected ? "text-white" : "text-amber-500"}`} aria-hidden="true" />
                  <span className="min-w-0 break-words">{group.label}</span>
                  {group.slug === "custom" ? (
                    <span aria-hidden="true" />
                  ) : (
                    <FiChevronDown
                      className={`h-4 w-4 justify-self-end transition ${selected ? "rotate-180 text-white" : "text-white/30"}`}
                      aria-hidden="true"
                    />
                  )}
                </button>

                {selected && group.slug !== "custom" && (
                  <div
                    className={`mt-2 w-full overflow-hidden rounded border border-white/10 bg-white/5 shadow-2xl backdrop-blur sm:absolute sm:top-[calc(100%+8px)] sm:mt-0 ${desktopAlign}`}
                  >
                    {quickItems.map((item) => renderQuickRow(item, room))}
                    {hiddenQuickItems > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllQuickItems(true)}
                        className="min-h-11 w-full border-t border-white/10 bg-white/4 px-4 text-left text-xs font-bold text-amber-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        Show {hiddenQuickItems} more
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {activeQuickGroup && activeQuickGroup.slug !== "custom" && (
            <div style={{ height: dropdownHeight }} aria-hidden="true" className="hidden sm:col-span-3 sm:block" />
          )}
        </div>

        {activeQuickGroup?.slug === "custom" && renderCatalogBrowse(room)}
      </div>
    );
  }

  function renderConfirmedItems(room?: InventoryRoom | null) {
    const roomItems = room
      ? room.id === UNASSIGNED_ROOM.id
        ? unassignedItems
        : items.filter((item) => item.roomId === room.id)
      : items;

    if (roomItems.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/4 p-4 text-sm text-white/45">
          No confirmed items yet.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {roomItems.map((item, index) => {
          const sourceIndex = items.findIndex((candidate, candidateIndex) =>
            selectedItemKey(candidate, candidateIndex) === selectedItemKey(item, index),
          );
          const effectiveIndex = sourceIndex >= 0 ? sourceIndex : index;
          return (
            <div
              key={selectedItemKey(item, index)}
              className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              <div className="min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-white">{item.name}</p>
                    {item.roomName && !room && (
                      <p className="text-xs font-semibold text-white/45">{item.roomName}</p>
                    )}
                    {item.itemId && <p className="break-all text-[11px] text-white/30">{item.itemId}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingItem(item, effectiveIndex)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white/30 hover:bg-white/4 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label={`Remove ${item.name}`}
                  >
                    x
                  </button>
                </div>
                <QuantityControls
                  itemName={item.name}
                  quantity={item.quantity}
                  onSetQuantity={(qty) => updateExistingItem(item, effectiveIndex, qty)}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderSuggestionPreview(room: InventoryRoom) {
    if (!suggestionDraft) return null;

    return (
      <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-white">Review suggested items</h4>
          <button
            type="button"
            onClick={() => setSuggestionDraft(null)}
            className="min-h-11 rounded-lg px-3 text-sm font-semibold text-white/60" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
          >
            Cancel
          </button>
        </div>
        <div className="space-y-2">
          {suggestionDraft.map((draft) => {
            const suggestion = suggestions.find((entry) => entry.id === draft.suggestionId);
            if (!suggestion) return null;
            const selectedRecord = CATALOG_RECORD_BY_ID.get(draft.itemId);
            return (
              <div key={draft.suggestionId} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.checked}
                    onChange={(event) => updateSuggestionDraft(draft.suggestionId, { checked: event.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-white/15 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">{suggestion.label}</span>
                    {suggestion.helperText && (
                      <span className="mt-0.5 block text-xs text-white/45">{suggestion.helperText}</span>
                    )}
                  </span>
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_112px]">
                  <select
                    value={draft.itemId}
                    onChange={(event) => updateSuggestionDraft(draft.suggestionId, { itemId: event.target.value })}
                    disabled={!draft.checked}
                    className="min-h-11 w-full rounded-lg border border-white/15 px-3 text-sm text-white disabled:opacity-40" style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    {suggestion.choices
                      .filter((choice) => CATALOG_RECORD_BY_ID.has(choice.itemId))
                      .map((choice) => (
                        <option key={choice.itemId} value={choice.itemId}>
                          {labelForChoice(choice)}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    max={MAX_QTY}
                    value={draft.quantity}
                    onChange={(event) =>
                      updateSuggestionDraft(draft.suggestionId, {
                        quantity: clampQuantity(Number(event.target.value)),
                      })
                    }
                    disabled={!draft.checked}
                    className="min-h-11 w-full rounded-lg border border-white/15 px-3 text-sm text-white disabled:opacity-40" style={{ background: "rgba(255,255,255,0.07)" }}
                    aria-label={`${suggestion.label} quantity`}
                  />
                </div>
                {selectedRecord && (
                  <p className="mt-1 break-all text-[11px] text-white/30">{selectedRecord.slug}</p>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => confirmSuggestionDraft(room)}
          className="min-h-11 w-full rounded-xl bg-amber-500/20 px-4 text-sm font-bold text-amber-400 ring-1 ring-amber-500/30 hover:bg-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Add checked items to {room.label}
        </button>
      </div>
    );
  }

  if (CATALOG_RECORDS.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-semibold">Items are unavailable right now.</p>
        <p className="mt-1">Please retry, or continue and add item notes later.</p>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setActiveQuickGroupSlug(null);
            setShowAllQuickItems(false);
            setActiveCategorySlug(null);
          }}
          className="mt-3 min-h-11 rounded-lg bg-amber-500 px-4 text-sm font-bold text-white hover:bg-amber-500/100"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="item-search" className="block text-xl font-bold text-white">
          What are you moving?
        </label>
        {totalItems > 0 && (
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
            {totalItems} item{totalItems !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      {roomPlannerAvailable && (
        <div className="rounded-xl border border-white/10 bg-white/4 p-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onInventoryModeChange?.("rooms")}
              className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                roomMode
                  ? "border-amber-500 bg-amber-500/20 text-amber-400"
                  : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
              }`}
            >
              Room-by-room
            </button>
            <button
              type="button"
              onClick={() => onInventoryModeChange?.("items")}
              className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                !roomMode
                  ? "border-amber-500 bg-amber-500/20 text-amber-400"
                  : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
              }`}
            >
              Item list
            </button>
          </div>
        </div>
      )}

      {roomMode ? (
        <div className="space-y-4">
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">How many bedrooms are you moving from?</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BEDROOM_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => requestBedroomConfig(option.value, option.value === "5+" ? exactBedroomCount : 5)}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    bedroomCount === option.value
                      ? "border-amber-500 bg-amber-500/20 text-amber-400"
                      : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {bedroomCount === "5+" && (
              <label className="block text-sm font-semibold text-white/75">
                Exact bedrooms
                <input
                  type="number"
                  min={5}
                  max={10}
                  value={exactBedroomsFor("5+", exactBedroomCount)}
                  onChange={(event) => requestBedroomConfig("5+", Number(event.target.value))}
                  className="mt-1 min-h-11 w-full rounded-xl border border-white/15 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </label>
            )}
          </section>

          {pendingBedroomChange && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="font-bold">Some selected items are in rooms that would be removed.</p>
              <p className="mt-1">
                Move those items to Boxes & other items, remove them, or keep the current room count.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => finishPendingBedroomChange("move")}
                  className="min-h-11 rounded-lg bg-stone-950 px-3 text-sm font-bold text-white"
                >
                  Move items
                </button>
                <button
                  type="button"
                  onClick={() => finishPendingBedroomChange("remove")}
                  className="min-h-11 rounded-lg border border-rose-200 bg-white px-3 text-sm font-bold text-rose-700 hover:bg-rose-50"
                >
                  Remove items
                </button>
                <button
                  type="button"
                  onClick={() => setPendingBedroomChange(null)}
                  className="min-h-11 rounded-lg border border-white/10 bg-white px-3 text-sm font-bold text-white/75 hover:bg-white/4"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {rooms.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Rooms">
                  {roomsWithLegacy.map((room) => {
                    const count = roomItemCount(room);
                    return (
                      <button
                        key={room.id}
                        type="button"
                        role="tab"
                        aria-selected={activeRoomId === room.id}
                        onClick={() => {
                          setActiveRoomId(room.id);
                          setSearch("");
                          setSuggestionDraft(null);
                        }}
                        className={`min-h-14 rounded-xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                          activeRoomId === room.id
                            ? "border-amber-500 bg-amber-500/20 text-amber-400"
                            : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
                        }`}
                      >
                        <span className="block break-words text-sm font-bold">{room.label}</span>
                        <span className="text-xs opacity-75">
                          {room.skipped ? "Skipped" : count > 0 ? `${count} selected` : "No items"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2">
                  {OPTIONAL_ROOM_DEFS.filter((room) => !rooms.some((existing) => existing.id === room.id)).map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => addOptionalRoom(room)}
                      className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white/75 hover:bg-white/10"
                    >
                      Add {room.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeRoom && (
                <div
                  ref={panelRef}
                  tabIndex={-1}
                  className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{activeRoom.label}</h3>
                      <p className="text-sm text-white/45">
                        {activeRoom.id === UNASSIGNED_ROOM.id
                          ? "Legacy draft items without a saved room."
                          : `${roomItemCount(activeRoom)} confirmed item${roomItemCount(activeRoom) !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                    {activeRoom.id !== UNASSIGNED_ROOM.id && (
                      <button
                        type="button"
                        onClick={() => updateRoom(activeRoom.id, { skipped: !activeRoom.skipped })}
                        className="min-h-11 rounded-lg border border-white/10 px-3 text-sm font-bold text-white/75 hover:bg-white/4"
                      >
                        {activeRoom.skipped ? "Use room" : "Skip room"}
                      </button>
                    )}
                  </div>

                  {activeRoom.skipped ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/4 p-4 text-sm text-white/45">
                      This room is skipped. Existing confirmed items are still listed below.
                    </div>
                  ) : (
                    <>
                      {suggestions.length > 0 && (
                        <section className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-white">Suggested for {activeRoom.label}</h4>
                            <button
                              type="button"
                              onClick={openSuggestionPreview}
                              className="min-h-11 rounded-lg bg-amber-500/20 px-4 text-sm font-bold text-amber-400 ring-1 ring-amber-500/30 hover:bg-amber-500/30"
                            >
                              Add suggested items
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {visibleSuggestions.map((suggestion) => {
                              const firstChoice = suggestion.choices.find((choice) => CATALOG_RECORD_BY_ID.has(choice.itemId));
                              return (
                                <div
                                  key={suggestion.id}
                                  className="min-w-0 rounded-xl border border-white/10 bg-white/4 p-3"
                                >
                                  <p className="break-words text-sm font-bold text-white">{suggestion.label}</p>
                                  <p className="mt-1 text-xs text-white/45">
                                    {suggestion.choices.length > 1 ? `${suggestion.choices.length} variants` : labelForChoice(firstChoice ?? suggestion.choices[0]!)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          {suggestions.length > visibleSuggestions.length && (
                            <button
                              type="button"
                              onClick={() => setShowAllSuggestions(true)}
                              className="min-h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white/75 hover:bg-white/10"
                            >
                              Show more suggestions
                            </button>
                          )}
                          {renderSuggestionPreview(activeRoom)}
                        </section>
                      )}

                      <div className="relative">
                        <svg
                          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                          />
                        </svg>
                        <input
                          id="item-search"
                          type="search"
                          value={search}
                          onChange={(event) => {
                            setSearch(event.target.value);
                            setShowAllSearch(false);
                          }}
                          placeholder="Enter your item(s) here e.g. Sofa"
                          className="booking-search-input min-h-11 w-full rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      {renderSearchResults(activeRoom)}
                      {!searchQuery && renderAnyVanQuickAdd(activeRoom)}
                    </>
                  )}

                  <section className="space-y-2">
                    <h4 className="text-sm font-bold text-white">Confirmed in {activeRoom.label}</h4>
                    {renderConfirmedItems(activeRoom)}
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              id="item-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowAllSearch(false);
              }}
              placeholder="Enter your item(s) here e.g. Sofa"
              className="booking-search-input min-h-11 w-full rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {renderSearchResults(null)}
          {!searchQuery && renderAnyVanQuickAdd(null)}
        </div>
      )}

      {totalItems > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">
                {totalItems} item{totalItems !== 1 ? "s" : ""} selected
              </p>
              <p className="truncate text-xs text-white/45">
                {items.slice(0, 2).map((item) => `${item.roomName ? `${item.roomName}: ` : ""}${item.name} x ${item.quantity}`).join(", ")}
                {totalLines > 2 ? `, +${totalLines - 2} more` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReviewOpen((current) => !current)}
              className="min-h-11 shrink-0 rounded-lg bg-amber-500/20 px-4 text-sm font-bold text-amber-400 ring-1 ring-amber-500/30"
              aria-expanded={reviewOpen}
            >
              Review items
            </button>
          </div>

          {reviewOpen && (
            <div className="mt-3 max-h-72 overflow-y-auto border-t border-slate-100 pt-3">
              {roomMode ? (
                <div className="space-y-3">
                  {roomsWithLegacy
                    .filter((room) => roomItemCount(room) > 0)
                    .map((room) => (
                      <section key={room.id} className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-white/45">{room.label}</h4>
                        {renderConfirmedItems(room)}
                      </section>
                    ))}
                </div>
              ) : (
                renderConfirmedItems(null)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

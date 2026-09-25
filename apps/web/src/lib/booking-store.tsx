"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BedroomCount, InventoryMode, InventoryRoom } from "./room-inventory";
import { resolveBookingService } from "./booking-service-options";

export const BOOKING_DRAFT_STORAGE_KEY = "sv_booking_draft_v1";
export const BOOKING_DRAFT_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// ─── Types ─────────────────────────────────────────────────────────────────

export type TimeSlot = "morning" | "afternoon" | "evening";
export type PropertyType = "house" | "flat" | "bungalow" | "office" | "studio" | "";

export interface AddressResult {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

export interface SelectedItem {
  lineId?: string;
  itemId?: string;
  name: string;
  quantity: number;
  roomId?: string;
  roomName?: string;
}

export interface PriceLineItem {
  label: string;
  amount: number;
  type: string;
}

export type QuoteStatus = "incomplete" | "loading" | "valid" | "stale" | "failed";

export interface BookingState {
  // Step 1 – Service
  serviceSlug: string;
  serviceName: string;
  serviceVariant: string;
  entryServiceSlug: string;

  // Step 2 – Addresses + items
  pickup: AddressResult | null;
  pickupPropertyType: PropertyType;
  pickupFloor: number;
  pickupHasLift: boolean;
  dropoff: AddressResult | null;
  dropoffPropertyType: PropertyType;
  dropoffFloor: number;
  dropoffHasLift: boolean;
  distanceMiles: number;
  items: SelectedItem[];
  inventoryMode: InventoryMode;
  bedroomCount: BedroomCount | "";
  exactBedroomCount: number;
  inventoryRooms: InventoryRoom[];

  // Step 3 – Schedule
  selectedDate: string; // YYYY-MM-DD
  selectedTimeSlot: TimeSlot | "";
  helpersCount: number;
  needsPacking: boolean;
  needsAssembly: boolean;

  // Step 4 – Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Pricing
  clientTotal: number;
  clientSecret: string; // from /booking/create
  bookingId: string;
  bookingRef: string;
  priceBreakdown: PriceLineItem[];
  quoteStatus: QuoteStatus;
  quoteError: string;
  checkoutLocked: boolean;

  // Navigation
  step: 1 | 2 | 3 | 4 | 5;
}

export type RestorableBookingState = Partial<BookingState> & {
  serviceSlug: string;
  step: 2 | 3 | 4 | 5;
};

export interface BookingDraftEnvelope {
  savedAt: number;
  state: RestorableBookingState;
}

function isRestorableStep(value: unknown): value is RestorableBookingState["step"] {
  return value === 2 || value === 3 || value === 4 || value === 5;
}

export function parseBookingDraft(raw: string | null, now = Date.now()): BookingDraftEnvelope | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      savedAt?: unknown;
      state?: Partial<BookingState>;
    };
    const savedAt = typeof parsed.savedAt === "number" ? parsed.savedAt : NaN;
    const state = parsed.state;
    const serviceSlug = typeof state?.serviceSlug === "string" ? state.serviceSlug.trim() : "";

    if (!Number.isFinite(savedAt) || now - savedAt > BOOKING_DRAFT_TTL_MS) return null;
    if (!state || !serviceSlug || !isRestorableStep(state.step)) return null;

    return {
      savedAt,
      state: {
        ...state,
        serviceSlug,
        step: state.step,
      },
    };
  } catch {
    return null;
  }
}

export const INITIAL_BOOKING_STATE: BookingState = {
  serviceSlug: "",
  serviceName: "",
  serviceVariant: "",
  entryServiceSlug: "",
  pickup: null,
  pickupPropertyType: "",
  pickupFloor: 0,
  pickupHasLift: false,
  dropoff: null,
  dropoffPropertyType: "",
  dropoffFloor: 0,
  dropoffHasLift: false,
  distanceMiles: 0,
  items: [],
  inventoryMode: "items",
  bedroomCount: "",
  exactBedroomCount: 5,
  inventoryRooms: [],
  selectedDate: "",
  selectedTimeSlot: "",
  helpersCount: 0,
  needsPacking: false,
  needsAssembly: false,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  clientTotal: 0,
  clientSecret: "",
  bookingId: "",
  bookingRef: "",
  priceBreakdown: [],
  quoteStatus: "incomplete",
  quoteError: "",
  checkoutLocked: false,
  step: 1,
};

// ─── Actions ────────────────────────────────────────────────────────────────

export type BookingAction =
  | { type: "APPLY_SERVICE_ENTRY"; slug: string }
  | { type: "SET_SERVICE"; slug: string; name: string; sourceSlug?: string }
  | { type: "SET_VARIANT"; variant: string }
  | { type: "SET_ENTRY_SERVICE"; slug: string }
  | { type: "SET_PICKUP"; value: AddressResult }
  | { type: "CLEAR_PICKUP" }
  | { type: "SET_DROPOFF"; value: AddressResult }
  | { type: "CLEAR_DROPOFF" }
  | { type: "SET_PICKUP_PROPERTY_TYPE"; value: PropertyType }
  | { type: "SET_PICKUP_FLOOR"; value: number }
  | { type: "SET_PICKUP_LIFT"; value: boolean }
  | { type: "SET_DROPOFF_PROPERTY_TYPE"; value: PropertyType }
  | { type: "SET_DROPOFF_FLOOR"; value: number }
  | { type: "SET_DROPOFF_LIFT"; value: boolean }
  | { type: "SET_DISTANCE"; value: number }
  | { type: "SET_ITEMS"; items: SelectedItem[] }
  | { type: "SET_INVENTORY_MODE"; mode: InventoryMode }
  | { type: "SET_BEDROOM_COUNT"; bedroomCount: BedroomCount | ""; exactBedroomCount: number }
  | { type: "SET_INVENTORY_ROOMS"; rooms: InventoryRoom[] }
  | { type: "SET_DATE"; date: string }
  | { type: "SET_SLOT"; slot: TimeSlot }
  | { type: "SET_HELPERS"; count: number }
  | { type: "SET_PACKING"; value: boolean }
  | { type: "SET_ASSEMBLY"; value: boolean }
  | { type: "SET_CUSTOMER"; name: string; email: string; phone: string }
  | { type: "SET_PRICE"; total: number }
  | { type: "SET_BREAKDOWN"; items: PriceLineItem[] }
  | { type: "SET_QUOTE_STATUS"; status: QuoteStatus; error?: string }
  | { type: "SET_BOOKING"; bookingId: string; bookingRef: string; clientSecret: string; total: number }
  | { type: "START_CHECKOUT" }
  | { type: "CHECKOUT_REJECTED" }
  | { type: "CHECKOUT_COMPLETE" }
  | { type: "SET_STEP"; step: 1 | 2 | 3 | 4 | 5 }
  | { type: "RESET_UPSELLS" }
  | { type: "RESTORE"; state: BookingState }
  | { type: "RESET" };

function invalidateQuote(state: BookingState): BookingState {
  return {
    ...state,
    selectedDate: "",
    selectedTimeSlot: "",
    clientTotal: 0,
    clientSecret: "",
    bookingId: "",
    bookingRef: "",
    priceBreakdown: [],
    quoteStatus: state.clientTotal > 0 || state.selectedDate ? "stale" : "incomplete",
    quoteError: "",
  };
}

function serviceEntryIdentity(service: Pick<BookingState, "serviceSlug" | "entryServiceSlug" | "serviceName">): string {
  const entry = resolveBookingService(service.entryServiceSlug);
  const canonical = resolveBookingService(service.serviceSlug);
  const name = service.serviceName.trim().toLowerCase();
  // Public aliases share a booking service; distinct flat/small/intercity intents retain their names.
  const isDefaultName = [entry?.serviceName, canonical?.serviceName]
    .some((candidate) => candidate?.trim().toLowerCase() === name);
  return [service.serviceSlug, entry?.entryServiceSlug ?? service.entryServiceSlug, isDefaultName ? "" : name].join(":");
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  // An unresolved checkout must survive Back/Edit, query initialisation and late quotes.
  if (state.checkoutLocked && !["SET_BOOKING", "CHECKOUT_REJECTED", "CHECKOUT_COMPLETE"].includes(action.type)) {
    return state;
  }
  switch (action.type) {
    case "APPLY_SERVICE_ENTRY": {
      const service = resolveBookingService(action.slug);
      if (!service || serviceEntryIdentity(state) === serviceEntryIdentity(service)) return state;
      return { ...INITIAL_BOOKING_STATE, ...service, step: 2 };
    }
    case "SET_SERVICE":
      return {
        ...invalidateQuote(state),
        serviceSlug: action.slug,
        serviceName: action.name,
        serviceVariant: "",
        entryServiceSlug: action.sourceSlug ?? action.slug,
      };
    case "SET_VARIANT": return { ...invalidateQuote(state), serviceVariant: action.variant };
    case "SET_ENTRY_SERVICE": return { ...invalidateQuote(state), entryServiceSlug: action.slug };
    case "SET_PICKUP": return { ...invalidateQuote(state), distanceMiles: 0, pickup: action.value };
    case "CLEAR_PICKUP": return { ...invalidateQuote(state), distanceMiles: 0, pickup: null };
    case "SET_DROPOFF": return { ...invalidateQuote(state), distanceMiles: 0, dropoff: action.value };
    case "CLEAR_DROPOFF": return { ...invalidateQuote(state), distanceMiles: 0, dropoff: null };
    case "SET_PICKUP_PROPERTY_TYPE": return {
      ...invalidateQuote(state),
      pickupPropertyType: action.value,
      pickupFloor: ["flat", "office", "studio"].includes(action.value) ? state.pickupFloor : 0,
      pickupHasLift: ["flat", "office", "studio"].includes(action.value) ? state.pickupHasLift : false,
    };
    case "SET_PICKUP_FLOOR": return { ...invalidateQuote(state), pickupFloor: action.value };
    case "SET_PICKUP_LIFT": return { ...invalidateQuote(state), pickupHasLift: action.value };
    case "SET_DROPOFF_PROPERTY_TYPE": return {
      ...invalidateQuote(state),
      dropoffPropertyType: action.value,
      dropoffFloor: ["flat", "office", "studio"].includes(action.value) ? state.dropoffFloor : 0,
      dropoffHasLift: ["flat", "office", "studio"].includes(action.value) ? state.dropoffHasLift : false,
    };
    case "SET_DROPOFF_FLOOR": return { ...invalidateQuote(state), dropoffFloor: action.value };
    case "SET_DROPOFF_LIFT": return { ...invalidateQuote(state), dropoffHasLift: action.value };
    case "SET_DISTANCE": return action.value === state.distanceMiles ? state : { ...invalidateQuote(state), distanceMiles: action.value };
    case "SET_ITEMS": return { ...invalidateQuote(state), items: action.items };
    case "SET_INVENTORY_MODE": return { ...state, inventoryMode: action.mode };
    case "SET_BEDROOM_COUNT":
      return {
        ...invalidateQuote(state),
        bedroomCount: action.bedroomCount,
        exactBedroomCount: action.exactBedroomCount,
      };
    case "SET_INVENTORY_ROOMS": return { ...state, inventoryRooms: action.rooms };
    case "SET_DATE": return { ...invalidateQuote(state), selectedDate: action.date, selectedTimeSlot: "" };
    case "SET_SLOT": return { ...invalidateQuote(state), selectedDate: state.selectedDate, selectedTimeSlot: action.slot };
    case "SET_HELPERS": return { ...invalidateQuote(state), helpersCount: action.count };
    case "SET_PACKING": return { ...invalidateQuote(state), needsPacking: action.value };
    case "SET_ASSEMBLY": return { ...invalidateQuote(state), needsAssembly: action.value };
    case "RESET_UPSELLS": return { ...invalidateQuote(state), needsPacking: false, needsAssembly: false, helpersCount: 0 };
    case "SET_CUSTOMER": return { ...state, customerName: action.name, customerEmail: action.email, customerPhone: action.phone };
    case "SET_PRICE": return action.total === state.clientTotal ? state : { ...state, clientTotal: action.total, clientSecret: "", bookingId: "", bookingRef: "" };
    case "SET_BREAKDOWN": return { ...state, priceBreakdown: action.items };
    case "SET_QUOTE_STATUS": return { ...state, quoteStatus: action.status, quoteError: action.error ?? "" };
    case "SET_BOOKING": return { ...state, checkoutLocked: true, bookingId: action.bookingId, bookingRef: action.bookingRef, clientSecret: action.clientSecret, clientTotal: action.total };
    case "START_CHECKOUT": return { ...state, checkoutLocked: true };
    case "CHECKOUT_REJECTED": return state.bookingId || state.clientSecret ? state : { ...state, checkoutLocked: false };
    case "CHECKOUT_COMPLETE": return INITIAL_BOOKING_STATE;
    case "SET_STEP": return { ...state, step: getReachableBookingStep(state, action.step) };
    case "RESTORE": return action.state;
    case "RESET": return INITIAL_BOOKING_STATE;
    default: return state;
  }
}

/** Never allow saved or edited data to bypass an incomplete booking step. */
export function getReachableBookingStep(state: BookingState, requested: BookingState["step"]): BookingState["step"] {
  if (requested === 1 || !resolveBookingService(state.serviceSlug)) return 1;
  if (requested === 2 || !state.pickup || !state.dropoff || !Number.isFinite(state.distanceMiles) || state.distanceMiles <= 0) return 2;
  if (requested === 3 || !state.items.some((item) => Number.isInteger(item.quantity) && item.quantity > 0)) return 3;
  if (requested === 4 || state.quoteStatus !== "valid" || !state.selectedDate || !state.selectedTimeSlot || !Number.isFinite(state.clientTotal) || state.clientTotal <= 0) return 4;
  return 5;
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function draftAddress(value: unknown): AddressResult | null {
  const address = objectValue(value);
  if (!address || typeof address.address !== "string" || !address.address.trim() || typeof address.postcode !== "string" ||
      typeof address.lat !== "number" || !Number.isFinite(address.lat) || Math.abs(address.lat) > 90 ||
      typeof address.lng !== "number" || !Number.isFinite(address.lng) || Math.abs(address.lng) > 180) return null;
  return { address: address.address, postcode: address.postcode, lat: address.lat, lng: address.lng };
}

/** Restore customer input, but always obtain a fresh server quote before payment. */
export function restoreBookingDraft(raw: string | null, now = Date.now()): BookingState | null {
  if (!raw) return null;
  try {
    const envelope = objectValue(JSON.parse(raw));
    if (!envelope || typeof envelope.savedAt !== "number" || !Number.isFinite(envelope.savedAt) || envelope.savedAt > now) return null;
    const draft = objectValue(envelope.state);
    if (!draft || typeof draft.serviceSlug !== "string") return null;
    // Unresolved payment attempts require reconciliation even after ordinary drafts expire.
    if (now - envelope.savedAt > BOOKING_DRAFT_TTL_MS && draft.checkoutLocked !== true) return null;
    const service = resolveBookingService(draft.serviceSlug);
    if (!service) return null;
    const text = (key: string) => typeof draft[key] === "string" ? draft[key] as string : "";
    const integer = (key: string, fallback = 0) => typeof draft[key] === "number" && Number.isInteger(draft[key]) && (draft[key] as number) >= 0 ? draft[key] as number : fallback;
    const propertyType = (key: string): PropertyType => ["house", "flat", "bungalow", "office", "studio"].includes(text(key)) ? text(key) as PropertyType : "";
    const items = Array.isArray(draft.items) ? draft.items.flatMap((value): SelectedItem[] => {
      const item = objectValue(value);
      if (!item || typeof item.name !== "string" || !item.name.trim() || typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity <= 0) return [];
      return [{ name: item.name, quantity: item.quantity,
        ...(typeof item.lineId === "string" ? { lineId: item.lineId } : {}),
        ...(typeof item.itemId === "string" ? { itemId: item.itemId } : {}),
        ...(typeof item.roomId === "string" ? { roomId: item.roomId } : {}),
        ...(typeof item.roomName === "string" ? { roomName: item.roomName } : {}),
      }];
    }) : [];
    const roomKinds = ["studio", "bedroom", "living", "kitchen", "boxes", "dining", "office", "garage", "garden", "unassigned"];
    const rooms = Array.isArray(draft.inventoryRooms) ? draft.inventoryRooms.flatMap((value): InventoryRoom[] => {
      const room = objectValue(value);
      if (!room || typeof room.id !== "string" || typeof room.label !== "string" || typeof room.kind !== "string" || !roomKinds.includes(room.kind)) return [];
      return [{ id: room.id, label: room.label, kind: room.kind as InventoryRoom["kind"],
        ...(typeof room.index === "number" && Number.isInteger(room.index) ? { index: room.index } : {}),
        ...(typeof room.optional === "boolean" ? { optional: room.optional } : {}),
        ...(typeof room.skipped === "boolean" ? { skipped: room.skipped } : {}),
      }];
    }) : [];
    const date = text("selectedDate");
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(`${date}T12:00:00Z`)) && new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date;
    const state: BookingState = {
      ...INITIAL_BOOKING_STATE,
      ...service,
      serviceName: text("serviceName") || service.serviceName,
      entryServiceSlug: resolveBookingService(text("entryServiceSlug")) ? text("entryServiceSlug") : service.entryServiceSlug,
      serviceVariant: text("serviceVariant"),
      pickup: draftAddress(draft.pickup),
      dropoff: draftAddress(draft.dropoff),
      pickupPropertyType: propertyType("pickupPropertyType"),
      dropoffPropertyType: propertyType("dropoffPropertyType"),
      pickupFloor: integer("pickupFloor"),
      dropoffFloor: integer("dropoffFloor"),
      pickupHasLift: draft.pickupHasLift === true,
      dropoffHasLift: draft.dropoffHasLift === true,
      distanceMiles: typeof draft.distanceMiles === "number" && Number.isFinite(draft.distanceMiles) && draft.distanceMiles > 0 ? draft.distanceMiles : 0,
      items,
      inventoryMode: draft.inventoryMode === "rooms" ? "rooms" : "items",
      bedroomCount: ["studio", "1", "2", "3", "4", "5+"].includes(text("bedroomCount")) ? text("bedroomCount") as BedroomCount : "",
      exactBedroomCount: Math.max(5, Math.min(10, integer("exactBedroomCount", 5))),
      inventoryRooms: rooms,
      helpersCount: Math.min(4, integer("helpersCount")),
      needsPacking: draft.needsPacking === true,
      needsAssembly: draft.needsAssembly === true,
      selectedDate: validDate ? date : "",
      selectedTimeSlot: validDate && ["morning", "afternoon", "evening"].includes(text("selectedTimeSlot")) ? text("selectedTimeSlot") as TimeSlot : "",
      customerName: text("customerName"),
      customerEmail: text("customerEmail"),
      customerPhone: text("customerPhone"),
      quoteStatus: "stale",
      checkoutLocked: draft.checkoutLocked === true,
      bookingId: draft.checkoutLocked === true ? text("bookingId") : "",
      bookingRef: draft.checkoutLocked === true ? text("bookingRef") : "",
    };
    const requested = typeof draft.step === "number" && Number.isInteger(draft.step) && draft.step >= 1 && draft.step <= 5 ? draft.step as BookingState["step"] : 2;
    state.step = state.checkoutLocked ? 5 : getReachableBookingStep(state, requested);
    return state;
  } catch {
    return null;
  }
}

export function serialiseBookingDraft(state: BookingState, savedAt = Date.now()): string {
  return JSON.stringify({ savedAt, state: {
    ...state,
    clientSecret: "",
    bookingId: state.checkoutLocked ? state.bookingId : "",
    bookingRef: state.checkoutLocked ? state.bookingRef : "",
  } });
}

// ─── Context ────────────────────────────────────────────────────────────────

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  ready: boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, INITIAL_BOOKING_STATE);
  const hydrated = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    let restored = INITIAL_BOOKING_STATE;
    try {
      const raw = localStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
      const draft = restoreBookingDraft(raw);
      if (draft) restored = draft;
      else if (raw) localStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
    } catch {
      // A blocked storage provider must not prevent a fresh quote.
    }

    // Resolve the entry before exposing a restored step to its effects.
    // The reducer preserves an unresolved checkout and matching draft inventory.
    const entry = new URLSearchParams(window.location.search).get("service");
    if (entry) restored = bookingReducer(restored, { type: "APPLY_SERVICE_ENTRY", slug: entry });
    dispatch({ type: "RESTORE", state: restored });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (!state.serviceSlug || state.step <= 1) {
        localStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
      } else {
        // Keep unresolved references for server reconciliation, never the client secret.
        localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, serialiseBookingDraft(state));
      }
    } catch {
      // Booking remains usable when storage is unavailable or full.
    }
  }, [ready, state]);

  return (
    <BookingContext.Provider value={{ state, dispatch, ready }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

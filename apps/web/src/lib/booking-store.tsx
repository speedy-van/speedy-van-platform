"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

const STORAGE_KEY = "sv_booking_draft_v1";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// ─── Types ─────────────────────────────────────────────────────────────────

export type TimeSlot = "morning" | "afternoon" | "evening";

export interface AddressResult {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

export interface SelectedItem {
  itemId?: string;
  name: string;
  quantity: number;
}

export interface PriceLineItem {
  label: string;
  amount: number;
  type: string;
}

export interface BookingState {
  // Step 1 – Service
  serviceSlug: string;
  serviceName: string;
  serviceVariant: string;

  // Step 2 – Addresses + items
  pickup: AddressResult | null;
  pickupFloor: number;
  pickupHasLift: boolean;
  dropoff: AddressResult | null;
  dropoffFloor: number;
  dropoffHasLift: boolean;
  distanceMiles: number;
  items: SelectedItem[];

  // Step 3 – Schedule
  selectedDate: string; // YYYY-MM-DD
  selectedTimeSlot: TimeSlot;
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

  // Navigation
  step: 1 | 2 | 3 | 4;
}

const INITIAL: BookingState = {
  serviceSlug: "",
  serviceName: "",
  serviceVariant: "",
  pickup: null,
  pickupFloor: 0,
  pickupHasLift: false,
  dropoff: null,
  dropoffFloor: 0,
  dropoffHasLift: false,
  distanceMiles: 0,
  items: [],
  selectedDate: "",
  selectedTimeSlot: "afternoon",
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
  step: 1,
};

// ─── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_SERVICE"; slug: string; name: string }
  | { type: "SET_VARIANT"; variant: string }
  | { type: "SET_PICKUP"; value: AddressResult }
  | { type: "SET_DROPOFF"; value: AddressResult }
  | { type: "SET_PICKUP_FLOOR"; value: number }
  | { type: "SET_PICKUP_LIFT"; value: boolean }
  | { type: "SET_DROPOFF_FLOOR"; value: number }
  | { type: "SET_DROPOFF_LIFT"; value: boolean }
  | { type: "SET_DISTANCE"; value: number }
  | { type: "SET_ITEMS"; items: SelectedItem[] }
  | { type: "SET_DATE"; date: string }
  | { type: "SET_SLOT"; slot: TimeSlot }
  | { type: "SET_HELPERS"; count: number }
  | { type: "SET_PACKING"; value: boolean }
  | { type: "SET_ASSEMBLY"; value: boolean }
  | { type: "SET_CUSTOMER"; name: string; email: string; phone: string }
  | { type: "SET_PRICE"; total: number }
  | { type: "SET_BREAKDOWN"; items: PriceLineItem[] }
  | { type: "SET_BOOKING"; bookingId: string; bookingRef: string; clientSecret: string; total: number }
  | { type: "SET_STEP"; step: 1 | 2 | 3 | 4 }
  | { type: "RESET_UPSELLS" }
  | { type: "RESET" };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SET_SERVICE": return { ...state, serviceSlug: action.slug, serviceName: action.name };
    case "SET_VARIANT": return { ...state, serviceVariant: action.variant };
    case "SET_PICKUP": return { ...state, pickup: action.value };
    case "SET_DROPOFF": return { ...state, dropoff: action.value };
    case "SET_PICKUP_FLOOR": return { ...state, pickupFloor: action.value };
    case "SET_PICKUP_LIFT": return { ...state, pickupHasLift: action.value };
    case "SET_DROPOFF_FLOOR": return { ...state, dropoffFloor: action.value };
    case "SET_DROPOFF_LIFT": return { ...state, dropoffHasLift: action.value };
    case "SET_DISTANCE": return { ...state, distanceMiles: action.value };
    case "SET_ITEMS": return { ...state, items: action.items };
    case "SET_DATE": return { ...state, selectedDate: action.date };
    case "SET_SLOT": return { ...state, selectedTimeSlot: action.slot };
    case "SET_HELPERS": return { ...state, helpersCount: action.count };
    case "SET_PACKING": return { ...state, needsPacking: action.value };
    case "SET_ASSEMBLY": return { ...state, needsAssembly: action.value };
    case "RESET_UPSELLS": return { ...state, needsPacking: false, needsAssembly: false, helpersCount: 0 };
    case "SET_CUSTOMER": return { ...state, customerName: action.name, customerEmail: action.email, customerPhone: action.phone };
    case "SET_PRICE": return { ...state, clientTotal: action.total };
    case "SET_BREAKDOWN": return { ...state, priceBreakdown: action.items };
    case "SET_BOOKING": return { ...state, bookingId: action.bookingId, bookingRef: action.bookingRef, clientSecret: action.clientSecret, clientTotal: action.total };
    case "SET_STEP": return { ...state, step: action.step };
    case "RESET": return INITIAL;
    default: return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<Action>;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const hydrated = useRef(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        hydrated.current = true;
        return;
      }
      const parsed = JSON.parse(raw) as { savedAt: number; state: BookingState };
      if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
      } else if (parsed.state) {
        // Don't restore the booking confirmation tail (server-side ids).
        const draft = {
          ...parsed.state,
          clientSecret: "",
          bookingId: "",
          bookingRef: "",
        };
        // Replay as discrete actions so reducer stays the source of truth.
        if (draft.serviceSlug) dispatch({ type: "SET_SERVICE", slug: draft.serviceSlug, name: draft.serviceName });
        if (draft.serviceVariant) dispatch({ type: "SET_VARIANT", variant: draft.serviceVariant });
        if (draft.pickup) dispatch({ type: "SET_PICKUP", value: draft.pickup });
        if (draft.dropoff) dispatch({ type: "SET_DROPOFF", value: draft.dropoff });
        if (draft.pickupFloor) dispatch({ type: "SET_PICKUP_FLOOR", value: draft.pickupFloor });
        if (draft.pickupHasLift) dispatch({ type: "SET_PICKUP_LIFT", value: true });
        if (draft.dropoffFloor) dispatch({ type: "SET_DROPOFF_FLOOR", value: draft.dropoffFloor });
        if (draft.dropoffHasLift) dispatch({ type: "SET_DROPOFF_LIFT", value: true });
        if (draft.distanceMiles) dispatch({ type: "SET_DISTANCE", value: draft.distanceMiles });
        if (draft.items?.length) dispatch({ type: "SET_ITEMS", items: draft.items });
        if (draft.selectedDate) dispatch({ type: "SET_DATE", date: draft.selectedDate });
        if (draft.selectedTimeSlot) dispatch({ type: "SET_SLOT", slot: draft.selectedTimeSlot });
        if (draft.helpersCount) dispatch({ type: "SET_HELPERS", count: draft.helpersCount });
        if (draft.needsPacking) dispatch({ type: "SET_PACKING", value: true });
        if (draft.needsAssembly) dispatch({ type: "SET_ASSEMBLY", value: true });
        if (draft.customerName || draft.customerEmail || draft.customerPhone) {
          dispatch({
            type: "SET_CUSTOMER",
            name: draft.customerName,
            email: draft.customerEmail,
            phone: draft.customerPhone,
          });
        }
        if (draft.clientTotal) dispatch({ type: "SET_PRICE", total: draft.clientTotal });
        if (draft.step && draft.step >= 1 && draft.step <= 4) dispatch({ type: "SET_STEP", step: draft.step });
      }
    } catch {
      /* ignore */
    } finally {
      hydrated.current = true;
    }
  }, []);

  // Persist on every change after hydration. Skip after a successful booking.
  useEffect(() => {
    if (!hydrated.current) return;
    if (typeof window === "undefined") return;
    if (state.bookingRef) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return;
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedAt: Date.now(), state })
      );
    } catch {
      /* ignore quota */
    }
  }, [state]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

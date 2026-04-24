"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

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
  | { type: "SET_BOOKING"; bookingId: string; bookingRef: string; clientSecret: string; total: number }
  | { type: "SET_STEP"; step: 1 | 2 | 3 | 4 }
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
    case "SET_CUSTOMER": return { ...state, customerName: action.name, customerEmail: action.email, customerPhone: action.phone };
    case "SET_PRICE": return { ...state, clientTotal: action.total };
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

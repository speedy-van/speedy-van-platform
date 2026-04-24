import type { PriceTier } from "./constants";

export type DayPrice = {
  date: string; // ISO YYYY-MM-DD
  slots: {
    slot: "morning" | "afternoon" | "evening";
    price: number;
    tier: PriceTier;
  }[];
};

export type PriceLineItem = {
  label: string;
  amount: number;
  type: "base" | "surcharge" | "addon" | "discount" | "tax";
};

export type PricingResult = {
  days: DayPrice[];
  staticLineItems: PriceLineItem[];
  staticSubtotal: number;
  currency: string;
  symbol: string;
};

export type GeocodeResult = {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
};

export type DirectionsResult = {
  distanceMiles: number;
  durationMinutes: number;
  routeGeometry?: unknown;
};

export type JWTPayload = {
  userId: string;
  email: string;
  role: "ADMIN" | "DRIVER" | "CUSTOMER";
};

export type TrackingPublic = {
  reference: string;
  status: string;
  serviceName: string;
  scheduledAt: string;
  pickupPostcode: string;
  dropoffPostcode: string;
  driverName?: string;
  driverPhone?: string;
  events: { type: string; status?: string; message?: string; createdAt: string }[];
  liveLocation?: { lat: number; lng: number; updatedAt: string };
};

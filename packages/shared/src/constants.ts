// Booking & job lifecycle status arrays — kept here because they're shared
// between the API server and the iOS / web clients.

export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
export type BookingStatusValue = (typeof BOOKING_STATUSES)[number];

export const JOB_STATUSES = [
  "AVAILABLE",
  "ACCEPTED",
  "DRIVER_EN_ROUTE",
  "ARRIVED_PICKUP",
  "LOADING",
  "IN_TRANSIT",
  "ARRIVED_DROPOFF",
  "UNLOADING",
  "COMPLETED",
  "CANCELLED",
] as const;
export type JobStatusValue = (typeof JOB_STATUSES)[number];

// Allowed driver-side state machine transitions.
export const DRIVER_STATUS_FLOW: Record<JobStatusValue, JobStatusValue[]> = {
  AVAILABLE: ["ACCEPTED"],
  ACCEPTED: ["DRIVER_EN_ROUTE", "CANCELLED"],
  DRIVER_EN_ROUTE: ["ARRIVED_PICKUP"],
  ARRIVED_PICKUP: ["LOADING"],
  LOADING: ["IN_TRANSIT"],
  IN_TRANSIT: ["ARRIVED_DROPOFF"],
  ARRIVED_DROPOFF: ["UNLOADING"],
  UNLOADING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const TIME_SLOTS = ["morning", "afternoon", "evening"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const CURRENCY = { code: "GBP", symbol: "£" } as const;

export const REFUND_POLICY = {
  fullRefundHours: 48,
  halfRefundHours: 24,
} as const;

// Tiered pricing colors (shown on price calendar)
export const PRICE_TIER = {
  GREEN: "green",
  YELLOW: "yellow",
  RED: "red",
} as const;
export type PriceTier = (typeof PRICE_TIER)[keyof typeof PRICE_TIER];

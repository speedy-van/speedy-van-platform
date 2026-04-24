import { z } from "zod";

// ─── Auth ──────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8).optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({ email: z.string().email() });
export const ResetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8),
});

// ─── Booking ───────────────────────────────────────────────────────────────
export const SelectedItemSchema = z.object({
  itemId: z.string().optional(),
  name: z.string(),
  quantity: z.number().int().positive().default(1),
});

export const CreateBookingSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),

  serviceSlug: z.string().min(1),
  serviceName: z.string().min(1),
  serviceVariant: z.string().optional(),

  pickupAddress: z.string().min(1),
  pickupPostcode: z.string().min(1),
  pickupLat: z.number(),
  pickupLng: z.number(),
  pickupFloor: z.number().int().min(0).default(0),
  pickupHasLift: z.boolean().default(false),

  dropoffAddress: z.string().min(1),
  dropoffPostcode: z.string().min(1),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  dropoffFloor: z.number().int().min(0).default(0),
  dropoffHasLift: z.boolean().default(false),

  distanceMiles: z.number().nonnegative(),

  selectedDate: z.string(), // ISO
  selectedTimeSlot: z.enum(["morning", "afternoon", "evening"]),

  helpersCount: z.number().int().min(0).default(0),
  needsPacking: z.boolean().default(false),
  needsAssembly: z.boolean().default(false),

  selectedItems: z.array(SelectedItemSchema).default([]),

  clientTotal: z.number().nonnegative(),
});
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const ConfirmBookingSchema = z.object({
  bookingId: z.string().min(1),
  stripePaymentIntentId: z.string().min(1),
});

export const CancelBookingSchema = z.object({
  email: z.string().email(),
  reason: z.string().optional(),
});

// ─── Pricing ───────────────────────────────────────────────────────────────
export const PricingCalculateSchema = z.object({
  serviceType: z.string(),
  serviceVariant: z.string().optional(),
  distanceMiles: z.number().nonnegative(),
  pickupFloor: z.number().int().min(0).default(0),
  pickupHasLift: z.boolean().default(false),
  dropoffFloor: z.number().int().min(0).default(0),
  dropoffHasLift: z.boolean().default(false),
  helpersCount: z.number().int().min(0).default(0),
  needsPacking: z.boolean().default(false),
  needsAssembly: z.boolean().default(false),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
});
export type PricingCalculateInput = z.infer<typeof PricingCalculateSchema>;

// ─── Geocode ───────────────────────────────────────────────────────────────
export const GeocodeSearchSchema = z.object({ q: z.string().min(2) });
export const DirectionsSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
});

// ─── Driver ────────────────────────────────────────────────────────────────
export const DriverStatusUpdateSchema = z.object({
  status: z.enum([
    "DRIVER_EN_ROUTE",
    "ARRIVED_PICKUP",
    "LOADING",
    "IN_TRANSIT",
    "ARRIVED_DROPOFF",
    "UNLOADING",
    "COMPLETED",
  ]),
  note: z.string().optional(),
});
export const DriverLocationSchema = z.object({
  bookingId: z.string(),
  lat: z.number(),
  lng: z.number(),
});

// ─── Tracking (visitor) ───────────────────────────────────────────────────
export const VisitorSessionSchema = z.object({
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  landingPage: z.string().optional(),
  screenWidth: z.number().int().optional(),
});
export const VisitorEventSchema = z.object({
  sessionId: z.string(),
  type: z.string(),
  page: z.string().optional(),
  element: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ─── Chat ──────────────────────────────────────────────────────────────────
export const SendMessageSchema = z.object({
  body: z.string().min(1).max(4000),
});

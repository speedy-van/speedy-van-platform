export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const BOOKING_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export type BookingDriverUser = {
  name: string;
  email?: string | null;
  phone?: string | null;
};

export type BookingDriver = {
  id: string;
  user: BookingDriverUser;
};

export type BookingListItem = {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceSlug: string;
  serviceName?: string;
  pickupAddress: string;
  dropoffAddress?: string | null;
  pickupPostcode?: string | null;
  dropoffPostcode?: string | null;
  scheduledDate?: string;
  scheduledAt?: string;
  timeSlot?: string;
  selectedTimeSlot?: string | null;
  totalPrice: number | null;
  price?: number | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string | null;
  driver?: BookingDriver | null;
  isDraft?: boolean;
  checkoutStage?: string | null;
};

export type BookingItem = {
  id: string;
  name: string;
  quantity: number;
  createdAt?: string | null;
};

export type TrackingEvent = {
  id: string;
  type: string;
  note?: string | null;
  message?: string | null;
  createdAt: string;
  isInternal: boolean;
};

export type StatusHistory = {
  id: string;
  fromStatus?: string | null;
  toStatus: string;
  note?: string | null;
  createdAt: string;
};

export type BookingExtras = {
  helpersCount?: number | null;
  needsPacking?: boolean | null;
  needsAssembly?: boolean | null;
  assemblyType?: "dismantle" | "assemble" | "both" | string | null;
  assemblyQty?: number | null;
};

export type BookingFieldAvailability = {
  customerName?: boolean;
  customerEmail?: boolean;
  customerPhone?: boolean;
  pickupAddress?: boolean;
  pickupPostcode?: boolean;
  pickupFloor?: boolean;
  pickupHasLift?: boolean;
  pickupPropertyType?: boolean;
  pickupCarryMetres?: boolean;
  dropoffAddress?: boolean;
  dropoffPostcode?: boolean;
  dropoffFloor?: boolean;
  dropoffHasLift?: boolean;
  dropoffPropertyType?: boolean;
  dropoffCarryMetres?: boolean;
  distanceMiles?: boolean;
  hasNarrowAccess?: boolean;
  hasPermitZone?: boolean;
  helpersCount?: boolean;
  needsPacking?: boolean;
  needsAssembly?: boolean;
  assemblyType?: boolean;
  assemblyQty?: boolean;
  items?: boolean;
  price?: boolean;
  scheduledAt?: boolean;
  selectedTimeSlot?: boolean;
  paidAt?: boolean;
};

export type BookingDetail = BookingListItem & BookingExtras & {
  notes?: string | null;
  draftMessage?: string | null;
  isPaid?: boolean;
  paidAt?: string | null;
  refundAmount?: number | null;
  serviceVariant?: string | null;
  pickupFloor?: number | null;
  pickupHasLift?: boolean | null;
  pickupPropertyType?: string | null;
  pickupCarryMetres?: number | null;
  dropoffFloor?: number | null;
  dropoffHasLift?: boolean | null;
  dropoffPropertyType?: string | null;
  dropoffCarryMetres?: number | null;
  hasNarrowAccess?: boolean | null;
  hasPermitZone?: boolean | null;
  distanceMiles?: number | null;
  fieldAvailability?: BookingFieldAvailability;
  items: BookingItem[];
  trackingEvents: TrackingEvent[];
  statusHistory: StatusHistory[];
};

const availabilityKeys = [
  "customerName",
  "customerEmail",
  "customerPhone",
  "pickupAddress",
  "pickupPostcode",
  "pickupFloor",
  "pickupHasLift",
  "pickupPropertyType",
  "pickupCarryMetres",
  "dropoffAddress",
  "dropoffPostcode",
  "dropoffFloor",
  "dropoffHasLift",
  "dropoffPropertyType",
  "dropoffCarryMetres",
  "distanceMiles",
  "hasNarrowAccess",
  "hasPermitZone",
  "helpersCount",
  "needsPacking",
  "needsAssembly",
  "assemblyType",
  "assemblyQty",
  "items",
  "price",
  "scheduledAt",
  "selectedTimeSlot",
  "paidAt",
] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(source: Record<string, unknown>, key: string, fallback = ""): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function nullableString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function numberValue(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function booleanValue(source: Record<string, unknown>, key: string): boolean | null {
  const value = source[key];
  return typeof value === "boolean" ? value : null;
}

function dateString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : value;
}

function requiredDateString(source: Record<string, unknown>, key: string): string {
  return dateString(source, key) ?? "";
}

function isBookingStatus(value: unknown): value is BookingStatus {
  return typeof value === "string" && BOOKING_STATUSES.includes(value as BookingStatus);
}

function parseDriver(value: unknown): BookingDriver | null {
  if (!isObject(value)) return null;
  const user = isObject(value.user) ? value.user : {};
  return {
    id: stringValue(value, "id"),
    user: {
      name: stringValue(user, "name", "Unnamed driver"),
      email: nullableString(user, "email"),
      phone: nullableString(user, "phone"),
    },
  };
}

function parseItems(value: unknown): BookingItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index): BookingItem[] => {
    if (!isObject(item)) return [];
    const name = stringValue(item, "name").trim();
    const quantity = numberValue(item, "quantity");
    if (!name || quantity === null || quantity <= 0) return [];
    return [{
      id: stringValue(item, "id", `item_${index}`),
      name,
      quantity,
      createdAt: dateString(item, "createdAt"),
    }];
  });
}

function parseTrackingEvents(value: unknown): TrackingEvent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((event, index): TrackingEvent[] => {
    if (!isObject(event)) return [];
    const createdAt = dateString(event, "createdAt");
    if (!createdAt) return [];
    return [{
      id: stringValue(event, "id", `event_${index}`),
      type: stringValue(event, "type", "note"),
      note: nullableString(event, "note"),
      message: nullableString(event, "message"),
      createdAt,
      isInternal: booleanValue(event, "isInternal") ?? false,
    }];
  });
}

function parseStatusHistory(value: unknown): StatusHistory[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((event, index): StatusHistory[] => {
    if (!isObject(event)) return [];
    const createdAt = dateString(event, "createdAt");
    const toStatus = stringValue(event, "toStatus");
    if (!createdAt || !toStatus) return [];
    return [{
      id: stringValue(event, "id", `status_${index}`),
      fromStatus: nullableString(event, "fromStatus"),
      toStatus,
      note: nullableString(event, "note"),
      createdAt,
    }];
  });
}

function parseAvailability(value: unknown): BookingFieldAvailability | undefined {
  if (!isObject(value)) return undefined;
  const result: BookingFieldAvailability = {};
  availabilityKeys.forEach((key) => {
    const item = value[key];
    if (typeof item === "boolean") result[key] = item;
  });
  return result;
}

export function parseBookingDetailResponse(value: unknown): BookingDetail {
  if (!isObject(value)) throw new Error("Malformed booking response.");
  const id = stringValue(value, "id");
  const reference = stringValue(value, "reference");
  const statusValue = value.status;
  const createdAt = requiredDateString(value, "createdAt");
  if (!id || !reference || !isBookingStatus(statusValue) || !createdAt) {
    throw new Error("Malformed booking response.");
  }

  return {
    id,
    reference,
    customerName: stringValue(value, "customerName"),
    customerEmail: stringValue(value, "customerEmail"),
    customerPhone: stringValue(value, "customerPhone"),
    serviceSlug: stringValue(value, "serviceSlug", "pending"),
    serviceName: nullableString(value, "serviceName") ?? undefined,
    serviceVariant: nullableString(value, "serviceVariant"),
    pickupAddress: stringValue(value, "pickupAddress"),
    pickupPostcode: nullableString(value, "pickupPostcode"),
    pickupFloor: numberValue(value, "pickupFloor"),
    pickupHasLift: booleanValue(value, "pickupHasLift"),
    pickupPropertyType: nullableString(value, "pickupPropertyType"),
    pickupCarryMetres: numberValue(value, "pickupCarryMetres"),
    dropoffAddress: nullableString(value, "dropoffAddress"),
    dropoffPostcode: nullableString(value, "dropoffPostcode"),
    dropoffFloor: numberValue(value, "dropoffFloor"),
    dropoffHasLift: booleanValue(value, "dropoffHasLift"),
    dropoffPropertyType: nullableString(value, "dropoffPropertyType"),
    dropoffCarryMetres: numberValue(value, "dropoffCarryMetres"),
    hasNarrowAccess: booleanValue(value, "hasNarrowAccess"),
    hasPermitZone: booleanValue(value, "hasPermitZone"),
    distanceMiles: numberValue(value, "distanceMiles"),
    scheduledAt: dateString(value, "scheduledAt") ?? undefined,
    scheduledDate: dateString(value, "scheduledDate") ?? undefined,
    timeSlot: nullableString(value, "timeSlot") ?? undefined,
    selectedTimeSlot: nullableString(value, "selectedTimeSlot"),
    totalPrice: numberValue(value, "totalPrice"),
    price: numberValue(value, "price"),
    status: statusValue,
    createdAt,
    updatedAt: dateString(value, "updatedAt"),
    driver: parseDriver(value.driver),
    isDraft: booleanValue(value, "isDraft") ?? false,
    checkoutStage: nullableString(value, "checkoutStage"),
    notes: nullableString(value, "notes"),
    draftMessage: nullableString(value, "draftMessage"),
    isPaid: booleanValue(value, "isPaid") ?? false,
    paidAt: dateString(value, "paidAt"),
    refundAmount: numberValue(value, "refundAmount"),
    helpersCount: numberValue(value, "helpersCount"),
    needsPacking: booleanValue(value, "needsPacking"),
    needsAssembly: booleanValue(value, "needsAssembly"),
    assemblyType: nullableString(value, "assemblyType"),
    assemblyQty: numberValue(value, "assemblyQty"),
    fieldAvailability: parseAvailability(value.fieldAvailability),
    items: parseItems(value.items),
    trackingEvents: parseTrackingEvents(value.trackingEvents),
    statusHistory: parseStatusHistory(value.statusHistory),
  };
}

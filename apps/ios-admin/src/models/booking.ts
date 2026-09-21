export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type BookingDriverUser = {
  name: string;
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
  scheduledDate?: string;
  scheduledAt?: string;
  timeSlot?: string;
  selectedTimeSlot?: string | null;
  totalPrice: number;
  price?: number;
  status: BookingStatus;
  createdAt: string;
  driver?: BookingDriver | null;
};

export type BookingItem = {
  id: string;
  name: string;
  quantity: number;
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

export type BookingDetail = BookingListItem & {
  notes?: string | null;
  items: BookingItem[];
  trackingEvents: TrackingEvent[];
  statusHistory: StatusHistory[];
};

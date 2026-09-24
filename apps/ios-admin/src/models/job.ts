export type JobStatus =
  | "AVAILABLE"
  | "CLAIMED"
  | "ACCEPTED"
  | "DRIVER_EN_ROUTE"
  | "ARRIVED_PICKUP"
  | "LOADING"
  | "IN_TRANSIT"
  | "ARRIVED_DROPOFF"
  | "UNLOADING"
  | "COMPLETED"
  | "CANCELLED";

export type JobBooking = {
  reference: string;
  serviceSlug?: string;
  serviceName?: string;
  scheduledDate?: string;
  scheduledAt?: string;
  timeSlot?: string;
  selectedTimeSlot?: string | null;
  totalPrice: number;
  pickupAddress: string;
};

export type JobDriver = {
  user: {
    name: string;
  };
};

export type JobListItem = {
  id: string;
  isPublic: boolean;
  status: JobStatus;
  driverPay?: number | null;
  driverPayNote?: string | null;
  driverPayNotes?: string | null;
  booking: JobBooking;
  driver?: JobDriver | null;
};

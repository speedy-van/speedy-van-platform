import type { BookingStatus, EnquiryStatus, JobStatus } from "@/models";
import { colors } from "@/theme/colors";

export type StatusMeta = {
  label: string;
  color: string;
};

export function bookingStatusMeta(status: BookingStatus): StatusMeta {
  switch (status) {
    case "PENDING":
      return { label: "Pending", color: colors.svWarning };
    case "CONFIRMED":
      return { label: "Confirmed", color: colors.amber };
    case "ASSIGNED":
      return { label: "Assigned", color: colors.orange };
    case "IN_PROGRESS":
      return { label: "In Progress", color: colors.svGreen };
    case "COMPLETED":
      return { label: "Completed", color: colors.svGreen };
    case "CANCELLED":
      return { label: "Cancelled", color: colors.svRed };
  }
}

export function jobStatusMeta(status: JobStatus): StatusMeta {
  switch (status) {
    case "AVAILABLE":
      return { label: "Available", color: colors.svGreen };
    case "CLAIMED":
      return { label: "Claimed", color: colors.amber };
    case "ACCEPTED":
      return { label: "Accepted", color: colors.amber };
    case "DRIVER_EN_ROUTE":
      return { label: "Driver En Route", color: colors.svWarning };
    case "ARRIVED_PICKUP":
      return { label: "At Pickup", color: colors.svWarning };
    case "LOADING":
      return { label: "Loading", color: colors.svWarning };
    case "IN_TRANSIT":
      return { label: "In Transit", color: colors.svWarning };
    case "ARRIVED_DROPOFF":
      return { label: "At Dropoff", color: colors.svWarning };
    case "UNLOADING":
      return { label: "Unloading", color: colors.svWarning };
    case "COMPLETED":
      return { label: "Completed", color: colors.svGreen };
    case "CANCELLED":
      return { label: "Cancelled", color: colors.svRed };
  }
}

export function enquiryStatusMeta(status: EnquiryStatus): StatusMeta {
  switch (status) {
    case "new":
      return { label: "New", color: colors.svWarning };
    case "quoted":
      return { label: "Quoted", color: colors.amber };
    case "accepted":
      return { label: "Accepted", color: colors.svGreen };
    case "declined":
      return { label: "Declined", color: colors.svRed };
  }
}

import type { BookingStatus, EnquiryStatus, JobStatus } from "@/models";

function query(path: string, params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      search.set(key, String(value));
    }
  });

  const suffix = search.toString();
  return suffix ? `${path}?${suffix}` : path;
}

export const endpoints = {
  authLogin: "/auth/login",
  authForgotPassword: "/auth/forgot-password",
  analyticsOverview: "/admin/analytics/overview",
  bookingsPerDay: "/admin/analytics/bookings-per-day",
  revenuePerDay: "/admin/analytics/revenue-per-day",
  serviceStats: "/admin/analytics/services",
  drivers: "/admin/drivers",
  jobs: (status?: JobStatus) => query("/admin/jobs", { status }),
  pauseAllJobs: "/admin/jobs/pause-all",
  resumeAllJobs: "/admin/jobs/resume-all",
  job: (id: string) => `/admin/jobs/${id}`,
  jobDriverPay: (id: string) => `/admin/jobs/${id}/driver-pay`,
  bookings: (params: { q?: string; status?: BookingStatus | null; page: number; limit: number }) =>
    query("/admin/bookings", params),
  pendingBookings: () => query("/admin/bookings", { status: "PENDING", page: 1, limit: 1 }),
  booking: (id: string) => `/admin/bookings/${id}`,
  bookingStatus: (id: string) => `/admin/bookings/${id}/status`,
  bookingAssign: (id: string) => `/admin/bookings/${id}/assign`,
  bookingCancel: (id: string) => `/admin/bookings/${id}/cancel`,
  bookingTracking: (id: string) => `/admin/bookings/${id}/tracking`,
  driver: (id: string) => `/admin/drivers/${id}`,
  driverStatus: (id: string) => `/admin/drivers/${id}/status`,
  driverEarnings: (id: string) => `/admin/drivers/${id}/earnings`,
  driverMarkPaid: (id: string) => `/admin/drivers/${id}/mark-paid`,
  driverResetPassword: (id: string) => `/admin/drivers/${id}/reset-password`,
  enquiries: (params: { status?: EnquiryStatus | null; page: number; limit: number }) =>
    query("/admin/enquiries", params),
  enquiry: (id: string) => `/admin/enquiries/${id}`,
  sendQuote: (id: string) => `/admin/enquiries/${id}/send-quote`,
  notifications: "/admin/notifications",
  markNotificationsRead: "/admin/notifications/read",
  notification: (id: string) => `/admin/notifications/${id}`,
  images: (params: { source?: "service" | "item" | "content" | null; q?: string }) =>
    query("/admin/images", params),
  image: (source: "service" | "item" | "content", id: string) =>
    `/admin/images/${source}/${encodeURIComponent(id)}`,
  visitorsRealtime: "/admin/visitors/realtime",
  visitorsToday: "/admin/visitors/today",
  visitorsWeek: "/admin/visitors/week",
  visitorsMonth: "/admin/visitors/month"
};

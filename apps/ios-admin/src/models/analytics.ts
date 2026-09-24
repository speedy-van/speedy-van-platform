export type AnalyticsOverview = {
  totalBookings: number;
  bookingsToday: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
  activeDrivers: number;
  pendingJobs: number;
  visitorsToday: number;
};

export type AnalyticsOverviewApi = AnalyticsOverview | {
  bookings: {
    total: number;
    today: number;
    month: number;
  };
  revenue: {
    total: number;
    today: number;
    month: number;
  };
  drivers: {
    active: number;
  };
  jobs: {
    pending: number;
    completed: number;
  };
  visitors: {
    active: number;
    today?: number;
  };
};

export type BookingPerDay = {
  date?: string;
  day?: string;
  count: number;
};

export type RevenuePerDay = {
  date?: string;
  day?: string;
  revenue: number;
};

export type ServiceStat = {
  slug: string;
  name?: string;
  count: number;
  revenue: number;
};

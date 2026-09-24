import { useCallback, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { AnalyticsOverview, AnalyticsOverviewApi, BookingPerDay, RevenuePerDay, ServiceStat } from "@/models";
import { useAsyncResource } from "./useAsyncResource";

type AnalyticsData = {
  overview: AnalyticsOverview | null;
  bookingsPerDay: BookingPerDay[];
  revenuePerDay: RevenuePerDay[];
  services: ServiceStat[];
};

function normalizeOverview(value: AnalyticsOverviewApi): AnalyticsOverview {
  if ("totalBookings" in value) return value;
  return {
    totalBookings: value.bookings.total,
    bookingsToday: value.bookings.today,
    bookingsThisMonth: value.bookings.month,
    revenueThisMonth: value.revenue.month,
    activeDrivers: value.drivers.active,
    pendingJobs: value.jobs.pending,
    visitorsToday: value.visitors.today ?? value.visitors.active
  };
}

export function useAnalytics() {
  const loader = useCallback(async (): Promise<AnalyticsData> => {
    const [overview, bookingsPerDay, revenuePerDay, services] = await Promise.all([
      apiClient.get<AnalyticsOverviewApi>(endpoints.analyticsOverview),
      apiClient.get<BookingPerDay[]>(endpoints.bookingsPerDay),
      apiClient.get<RevenuePerDay[]>(endpoints.revenuePerDay),
      apiClient.get<ServiceStat[]>(endpoints.serviceStats)
    ]);

    return { overview: normalizeOverview(overview), bookingsPerDay, revenuePerDay, services };
  }, []);

  const resource = useAsyncResource<AnalyticsData>(
    { overview: null, bookingsPerDay: [], revenuePerDay: [], services: [] },
    loader
  );

  useEffect(() => {
    void resource.load();
  }, [resource.load]);

  return resource;
}

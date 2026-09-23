import { useCallback, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { AnalyticsOverview, AnalyticsOverviewApi } from "@/models";
import { useAsyncResource } from "./useAsyncResource";

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

export function useDashboard() {
  const loader = useCallback(async () => {
    return normalizeOverview(await apiClient.get<AnalyticsOverviewApi>(endpoints.analyticsOverview));
  }, []);

  const resource = useAsyncResource<AnalyticsOverview | null>(null, loader);

  useEffect(() => {
    void resource.load();
  }, [resource.load]);

  return resource;
}

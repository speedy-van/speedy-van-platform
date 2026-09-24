import { useCallback, useEffect, useRef } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type {
  RealtimeVisitorsResponse,
  VisitorsMonthResponse,
  VisitorsTodayResponse,
  VisitorWeekResponse,
} from "@/models";
import { useAsyncResource } from "./useAsyncResource";

type VisitorDashboardData = {
  realtime: RealtimeVisitorsResponse | null;
  today: VisitorsTodayResponse | null;
  week: VisitorWeekResponse | null;
  month: VisitorsMonthResponse | null;
};

const EMPTY_VISITOR_DATA: VisitorDashboardData = {
  realtime: null,
  today: null,
  week: null,
  month: null,
};

export function useVisitors() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loader = useCallback(async (): Promise<VisitorDashboardData> => {
    const [realtime, today, week, month] = await Promise.all([
      apiClient.get<RealtimeVisitorsResponse>(endpoints.visitorsRealtime),
      apiClient.get<VisitorsTodayResponse>(endpoints.visitorsToday),
      apiClient.get<VisitorWeekResponse>(endpoints.visitorsWeek),
      apiClient.get<VisitorsMonthResponse>(endpoints.visitorsMonth),
    ]);

    return { realtime, today, week, month };
  }, []);

  const resource = useAsyncResource<VisitorDashboardData>(EMPTY_VISITOR_DATA, loader);

  useEffect(() => {
    void resource.load();
    intervalRef.current = setInterval(() => {
      void resource.load();
    }, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resource.load]);

  return resource;
}

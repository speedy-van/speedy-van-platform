import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import { useAuth } from "@/auth/AuthContext";
import type {
  RealtimeVisitor,
  RealtimeVisitorsResponse,
  VisitorEvent,
  VisitorsMonthResponse,
  VisitorsTodayResponse,
  VisitorWeekEntry,
  VisitorWeekResponse,
} from "@/models";

type ResourceKey = "realtime" | "today" | "week" | "month";

export type VisitorResource<T> = {
  data: T | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  updatedAt: string | null;
  stale: boolean;
};

type VisitorResources = {
  realtime: VisitorResource<RealtimeVisitorsResponse>;
  today: VisitorResource<VisitorsTodayResponse>;
  week: VisitorResource<VisitorWeekResponse>;
  month: VisitorResource<VisitorsMonthResponse>;
};

type VisitorDashboardData = {
  realtime: RealtimeVisitorsResponse | null;
  today: VisitorsTodayResponse | null;
  week: VisitorWeekResponse | null;
  month: VisitorsMonthResponse | null;
};

type RefreshOptions = {
  showRefreshing?: boolean;
};

type VisitorsContextValue = {
  data: VisitorDashboardData;
  realtime: VisitorResource<RealtimeVisitorsResponse>;
  today: VisitorResource<VisitorsTodayResponse>;
  week: VisitorResource<VisitorWeekResponse>;
  month: VisitorResource<VisitorsMonthResponse>;
  activeCount: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  load: () => Promise<void>;
  refreshRealtime: (options?: RefreshOptions) => Promise<void>;
  refreshHistorical: (options?: RefreshOptions) => Promise<void>;
};

const REALTIME_POLL_MS = 15_000;
const HISTORICAL_POLL_MS = 5 * 60_000;

const VisitorsContext = createContext<VisitorsContextValue | null>(null);

function emptyResource<T>(): VisitorResource<T> {
  return {
    data: null,
    isInitialLoading: false,
    isRefreshing: false,
    error: null,
    updatedAt: null,
    stale: false,
  };
}

function emptyResources(): VisitorResources {
  return {
    realtime: emptyResource<RealtimeVisitorsResponse>(),
    today: emptyResource<VisitorsTodayResponse>(),
    week: emptyResource<VisitorWeekResponse>(),
    month: emptyResource<VisitorsMonthResponse>(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && Array.isArray(value) === false;
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function isOptionalNumber(value: unknown): value is number | null | undefined {
  return value === undefined || value === null || (typeof value === "number" && Number.isFinite(value));
}

function isVisitorEvent(value: unknown): value is VisitorEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.visitorId === "string" &&
    typeof value.type === "string" &&
    isOptionalString(value.page) &&
    isOptionalString(value.element) &&
    typeof value.createdAt === "string"
  );
}

function isRealtimeVisitor(value: unknown): value is RealtimeVisitor {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.sessionId === "string" &&
    isOptionalString(value.userAgent) &&
    isOptionalString(value.referrer) &&
    isOptionalString(value.landingPage) &&
    isOptionalNumber(value.screenWidth) &&
    typeof value.isActive === "boolean" &&
    typeof value.totalDuration === "number" &&
    typeof value.pageViews === "number" &&
    typeof value.createdAt === "string" &&
    typeof value.lastActiveAt === "string" &&
    isOptionalString(value.exitedAt) &&
    Array.isArray(value.events) &&
    value.events.every(isVisitorEvent)
  );
}

function isRealtimeVisitorsResponse(value: unknown): value is RealtimeVisitorsResponse {
  return (
    isRecord(value) &&
    typeof value.count === "number" &&
    Number.isFinite(value.count) &&
    Array.isArray(value.visitors) &&
    value.visitors.every(isRealtimeVisitor)
  );
}

function isVisitorsTodayResponse(value: unknown): value is VisitorsTodayResponse {
  return (
    isRecord(value) &&
    typeof value.visitors === "number" &&
    Number.isFinite(value.visitors) &&
    typeof value.pageViews === "number" &&
    Number.isFinite(value.pageViews)
  );
}

function isVisitorWeekEntry(value: unknown): value is VisitorWeekEntry {
  return isRecord(value) && typeof value.date === "string" && typeof value.count === "number" && Number.isFinite(value.count);
}

function isVisitorWeekResponse(value: unknown): value is VisitorWeekResponse {
  return isRecord(value) && Array.isArray(value.visitors) && value.visitors.every(isVisitorWeekEntry);
}

function isVisitorsMonthResponse(value: unknown): value is VisitorsMonthResponse {
  return isRecord(value) && typeof value.visitors === "number" && Number.isFinite(value.visitors);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Visitor data could not be refreshed.";
}

export function VisitorsProvider({ children }: { children: ReactNode }): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const [resources, setResources] = useState<VisitorResources>(() => emptyResources());
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const inFlight = useRef<Partial<Record<ResourceKey, Promise<void>>>>({});
  const generation = useRef(0);
  const accountKey = isAuthenticated ? user?.id ?? "authenticated-admin" : "anonymous";

  const refreshResource = useCallback(
    async <T,>(
      key: ResourceKey,
      path: string,
      validate: (value: unknown) => value is T,
      label: string,
      options: RefreshOptions = {},
    ): Promise<void> => {
      if (!isAuthenticated) return;

      const existing = inFlight.current[key];
      if (existing) return existing;

      const requestGeneration = generation.current;
      const showRefreshing = options.showRefreshing === true;

      let task: Promise<void> | null = null;
      task = (async () => {
        setResources((current) => {
          const resource = current[key];
          return {
            ...current,
            [key]: {
              ...resource,
              isInitialLoading: resource.data === null,
              isRefreshing: showRefreshing && resource.data !== null,
              error: null,
            },
          } as VisitorResources;
        });

        try {
          const payload = await apiClient.get<unknown>(path);
          if (requestGeneration !== generation.current) return;
          if (!validate(payload)) throw new Error(`The ${label} endpoint returned an unexpected response.`);

          setResources((current) => ({
            ...current,
            [key]: {
              data: payload,
              isInitialLoading: false,
              isRefreshing: false,
              error: null,
              updatedAt: new Date().toISOString(),
              stale: false,
            },
          }) as VisitorResources);
        } catch (error) {
          if (requestGeneration !== generation.current) return;
          setResources((current) => {
            const resource = current[key];
            return {
              ...current,
              [key]: {
                ...resource,
                isInitialLoading: false,
                isRefreshing: false,
                error: errorMessage(error),
                stale: resource.data !== null,
              },
            } as VisitorResources;
          });
        } finally {
          if (inFlight.current[key] === task) {
            delete inFlight.current[key];
          }
        }
      })();

      inFlight.current[key] = task;
      return task;
    },
    [isAuthenticated],
  );

  const refreshRealtime = useCallback(
    (options?: RefreshOptions) =>
      refreshResource(
        "realtime",
        endpoints.visitorsRealtime,
        isRealtimeVisitorsResponse,
        "realtime visitors",
        options,
      ),
    [refreshResource],
  );

  const refreshHistorical = useCallback(
    async (options?: RefreshOptions) => {
      await Promise.all([
        refreshResource("today", endpoints.visitorsToday, isVisitorsTodayResponse, "today visitors", options),
        refreshResource("week", endpoints.visitorsWeek, isVisitorWeekResponse, "weekly visitors", options),
        refreshResource("month", endpoints.visitorsMonth, isVisitorsMonthResponse, "monthly visitors", options),
      ]);
    },
    [refreshResource],
  );

  const load = useCallback(async () => {
    await Promise.all([refreshRealtime({ showRefreshing: true }), refreshHistorical({ showRefreshing: true })]);
  }, [refreshHistorical, refreshRealtime]);

  useEffect(() => {
    generation.current += 1;
    inFlight.current = {};
    setResources(emptyResources());

    if (!isAuthenticated) return;

    void refreshRealtime();
    void refreshHistorical();
  }, [accountKey, isAuthenticated, refreshHistorical, refreshRealtime]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
      if (nextState === "active" && isAuthenticated) {
        void refreshRealtime();
        void refreshHistorical();
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, refreshHistorical, refreshRealtime]);

  useEffect(() => {
    if (!isAuthenticated || appState !== "active") return;

    const realtimePoll = setInterval(() => {
      void refreshRealtime();
    }, REALTIME_POLL_MS);
    const historicalPoll = setInterval(() => {
      void refreshHistorical();
    }, HISTORICAL_POLL_MS);

    return () => {
      clearInterval(realtimePoll);
      clearInterval(historicalPoll);
    };
  }, [appState, isAuthenticated, refreshHistorical, refreshRealtime]);

  const data = useMemo<VisitorDashboardData>(
    () => ({
      realtime: resources.realtime.data,
      today: resources.today.data,
      week: resources.week.data,
      month: resources.month.data,
    }),
    [resources],
  );

  const value = useMemo<VisitorsContextValue>(() => {
    const resourceList = [resources.realtime, resources.today, resources.week, resources.month];
    return {
      data,
      realtime: resources.realtime,
      today: resources.today,
      week: resources.week,
      month: resources.month,
      activeCount: resources.realtime.data?.count ?? null,
      isLoading: resourceList.some((resource) => resource.isInitialLoading),
      isRefreshing: resourceList.some((resource) => resource.isRefreshing),
      error: resourceList.find((resource) => resource.error)?.error ?? null,
      load,
      refreshRealtime,
      refreshHistorical,
    };
  }, [data, load, refreshHistorical, refreshRealtime, resources]);

  return <VisitorsContext.Provider value={value}>{children}</VisitorsContext.Provider>;
}

export function useVisitors(): VisitorsContextValue {
  const context = useContext(VisitorsContext);
  if (!context) {
    throw new Error("useVisitors must be used inside VisitorsProvider");
  }
  return context;
}

export type VisitorEvent = {
  id: string;
  visitorId: string;
  type: string;
  page?: string | null;
  element?: string | null;
  metadata?: unknown;
  createdAt: string;
};

export type RealtimeVisitor = {
  id: string;
  sessionId: string;
  userAgent?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  screenWidth?: number | null;
  isActive: boolean;
  totalDuration: number;
  pageViews: number;
  createdAt: string;
  lastActiveAt: string;
  exitedAt?: string | null;
  events: VisitorEvent[];
};

export type RealtimeVisitorsResponse = {
  count: number;
  visitors: RealtimeVisitor[];
  cappedAt?: number;
  activeWindowSeconds?: number;
  timezone?: string;
};

export type VisitorsTodayResponse = {
  visitors: number;
  pageViews: number;
  date?: string;
  timezone?: string;
  metric?: string;
};

export type VisitorWeekEntry = {
  date: string;
  count: number;
};

export type VisitorWeekResponse = {
  visitors: VisitorWeekEntry[];
  timezone?: string;
  metric?: string;
};

export type VisitorsMonthResponse = {
  visitors: number;
  timezone?: string;
  metric?: string;
};

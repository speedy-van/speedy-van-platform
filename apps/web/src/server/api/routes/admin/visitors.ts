import { Hono } from "hono";
import { db } from "@speedy-van/db";
import { ok } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";
import {
  VISITOR_ACTIVE_WINDOW_MS,
  VISITOR_REPORTING_TIME_ZONE,
  activeVisitorCutoff,
  activeVisitorWhere,
  recentReportingDayRanges,
  reportingDayRange,
} from "../../lib/visitor-activity";

const app = new Hono();
app.use("*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
});
app.use("*", requireAdmin);

async function markStale(now = new Date()) {
  const cutoff = activeVisitorCutoff(now);
  await db.visitor.updateMany({
    where: { isActive: true, lastActiveAt: { lt: cutoff } },
    data: { isActive: false },
  });
}

app.get("/realtime", async (c) => {
  const now = new Date();
  const where = activeVisitorWhere(now);
  await markStale(now);
  const [count, visitors] = await Promise.all([
    db.visitor.count({ where }),
    db.visitor.findMany({
      where,
      orderBy: { lastActiveAt: "desc" },
      take: 100,
      include: { events: { orderBy: { createdAt: "desc" }, take: 5 } },
    }),
  ]);
  return c.json(
    ok({
      count,
      visitors,
      cappedAt: 100,
      activeWindowSeconds: VISITOR_ACTIVE_WINDOW_MS / 1000,
      timezone: VISITOR_REPORTING_TIME_ZONE,
    }),
  );
});

app.get("/today", async (c) => {
  const { start, end, label, timeZone } = reportingDayRange();
  const [count, pageViews] = await Promise.all([
    db.visitor.count({ where: { createdAt: { gte: start, lt: end } } }),
    db.visitorEvent.count({ where: { type: "page_view", createdAt: { gte: start, lt: end } } }),
  ]);
  return c.json(
    ok({
      visitors: count,
      pageViews,
      date: label,
      timezone: timeZone,
      metric: "measured_sessions_started_and_page_view_events",
    }),
  );
});

app.get("/week", async (c) => {
  const ranges = recentReportingDayRanges(7);
  const counts = await Promise.all(
    ranges.map((range) =>
      db.visitor.count({
        where: { createdAt: { gte: range.start, lt: range.end } },
      }),
    ),
  );
  return c.json(
    ok({
      visitors: ranges.map((range, index) => ({ date: range.label, count: counts[index] ?? 0 })),
      timezone: VISITOR_REPORTING_TIME_ZONE,
      metric: "measured_sessions_started",
    }),
  );
});

app.get("/month", async (c) => {
  const start = reportingDayRange(new Date(), -29);
  const end = reportingDayRange(new Date(), 1);
  const count = await db.visitor.count({ where: { createdAt: { gte: start.start, lt: end.start } } });
  return c.json(
    ok({
      visitors: count,
      timezone: VISITOR_REPORTING_TIME_ZONE,
      metric: "measured_sessions_started",
    }),
  );
});

export default app;

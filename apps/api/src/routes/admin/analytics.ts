import { Hono } from "hono";
import { db } from "@speedy-van/db";
import { ok } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const app = new Hono();
app.use("*", requireAdmin);

function startOfDayUTC(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

app.get("/overview", async (c) => {
  const now = new Date();
  const today = startOfDayUTC(now);
  const startMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [
    totalBookings,
    bookingsToday,
    bookingsMonth,
    paidAgg,
    paidTodayAgg,
    paidMonthAgg,
    activeDrivers,
    pendingJobs,
    completedJobs,
    activeVisitors,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { createdAt: { gte: today } } }),
    db.booking.count({ where: { createdAt: { gte: startMonth } } }),
    db.booking.aggregate({ _sum: { totalPrice: true }, where: { isPaid: true } }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      where: { isPaid: true, paidAt: { gte: today } },
    }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      where: { isPaid: true, paidAt: { gte: startMonth } },
    }),
    db.driver.count({ where: { isActive: true } }),
    db.driverJob.count({ where: { status: "AVAILABLE", isPublic: true } }),
    db.driverJob.count({ where: { status: "COMPLETED" } }),
    db.visitor.count({ where: { isActive: true } }),
  ]);

  return c.json(
    ok({
      bookings: { total: totalBookings, today: bookingsToday, month: bookingsMonth },
      revenue: {
        total: paidAgg._sum.totalPrice ?? 0,
        today: paidTodayAgg._sum.totalPrice ?? 0,
        month: paidMonthAgg._sum.totalPrice ?? 0,
      },
      drivers: { active: activeDrivers },
      jobs: { pending: pendingJobs, completed: completedJobs },
      visitors: { active: activeVisitors },
    }),
  );
});

app.get("/bookings-per-day", async (c) => {
  const since = new Date(Date.now() - 30 * 86_400_000);
  const rows = await db.$queryRawUnsafe<{ day: Date; count: bigint }[]>(
    `SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::bigint AS count
     FROM "Booking" WHERE "createdAt" >= $1 GROUP BY day ORDER BY day ASC`,
    since,
  );
  return c.json(ok(rows.map((r) => ({ day: r.day, count: Number(r.count) }))));
});

app.get("/revenue-per-day", async (c) => {
  const since = new Date(Date.now() - 30 * 86_400_000);
  const rows = await db.$queryRawUnsafe<{ day: Date; revenue: number }[]>(
    `SELECT date_trunc('day', "paidAt") AS day, COALESCE(SUM("totalPrice"), 0)::float AS revenue
     FROM "Booking" WHERE "isPaid" = true AND "paidAt" >= $1 GROUP BY day ORDER BY day ASC`,
    since,
  );
  return c.json(ok(rows));
});

app.get("/services", async (c) => {
  const rows = await db.booking.groupBy({
    by: ["serviceSlug", "serviceName"],
    _count: { _all: true },
    _sum: { totalPrice: true },
    orderBy: { _count: { serviceSlug: "desc" } },
  });
  return c.json(
    ok(
      rows.map((r) => ({
        slug: r.serviceSlug,
        name: r.serviceName,
        count: r._count._all,
        revenue: r._sum.totalPrice ?? 0,
      })),
    ),
  );
});

app.get("/areas", async (c) => {
  const rows = await db.$queryRawUnsafe<{ area: string; count: bigint }[]>(
    `SELECT split_part("pickupPostcode", ' ', 1) AS area, COUNT(*)::bigint AS count
     FROM "Booking" GROUP BY area ORDER BY count DESC LIMIT 20`,
  );
  return c.json(ok(rows.map((r) => ({ area: r.area, count: Number(r.count) }))));
});

app.get("/drivers", async (c) => {
  const drivers = await db.driver.findMany({
    include: {
      user: { select: { name: true } },
      _count: { select: { bookings: { where: { status: "COMPLETED" } } } },
    },
  });
  return c.json(
    ok(
      drivers.map((d) => ({
        id: d.id,
        name: d.user.name,
        completedJobs: d._count.bookings,
      })),
    ),
  );
});

export default app;

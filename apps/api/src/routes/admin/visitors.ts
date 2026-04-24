import { Hono } from "hono";
import { db } from "@speedy-van/db";
import { ok } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const app = new Hono();
app.use("*", requireAdmin);

const STALE_MS = 2 * 60 * 1000;

async function markStale() {
  const cutoff = new Date(Date.now() - STALE_MS);
  await db.visitor.updateMany({
    where: { isActive: true, lastActiveAt: { lt: cutoff } },
    data: { isActive: false },
  });
}

app.get("/realtime", async (c) => {
  await markStale();
  const visitors = await db.visitor.findMany({
    where: { isActive: true },
    orderBy: { lastActiveAt: "desc" },
    take: 100,
    include: { events: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  return c.json(ok({ count: visitors.length, visitors }));
});

app.get("/today", async (c) => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const [count, pageViews] = await Promise.all([
    db.visitor.count({ where: { createdAt: { gte: start } } }),
    db.visitor.aggregate({ _sum: { pageViews: true }, where: { createdAt: { gte: start } } }),
  ]);
  return c.json(ok({ visitors: count, pageViews: pageViews._sum.pageViews ?? 0 }));
});

app.get("/week", async (c) => {
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    dayStart.setUTCDate(dayStart.getUTCDate() - i);
    const dayEnd = new Date(dayStart.getTime() + 86_400_000);
    const count = await db.visitor.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd } },
    });
    days.push({ date: dayStart.toISOString().split("T")[0], count });
  }
  return c.json(ok({ visitors: days }));
});

app.get("/month", async (c) => {
  const start = new Date(Date.now() - 30 * 86_400_000);
  const count = await db.visitor.count({ where: { createdAt: { gte: start } } });
  return c.json(ok({ visitors: count }));
});

export default app;

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import {
  ok,
  fail,
  VisitorSessionSchema,
  VisitorEventSchema,
} from "@speedy-van/shared";

const app = new Hono();

function newSessionId(): string {
  return `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

app.post("/session", zValidator("json", VisitorSessionSchema), async (c) => {
  const data = c.req.valid("json");
  const sessionId = newSessionId();
  await db.visitor.create({
    data: {
      sessionId,
      userAgent: data.userAgent,
      referrer: data.referrer,
      landingPage: data.landingPage,
      screenWidth: data.screenWidth,
    },
  });
  return c.json(ok({ sessionId }));
});

app.post("/event", zValidator("json", VisitorEventSchema), async (c) => {
  const { sessionId, type, page, element, metadata } = c.req.valid("json");
  const visitor = await db.visitor.findUnique({ where: { sessionId } });
  if (!visitor) return c.json(fail("Session not found", "NOT_FOUND"), 404);

  await db.visitorEvent.create({
    data: {
      visitorId: visitor.id,
      type,
      page,
      element,
      metadata: metadata as never,
    },
  });

  await db.visitor.update({
    where: { id: visitor.id },
    data: {
      lastActiveAt: new Date(),
      ...(type === "page_view" ? { pageViews: { increment: 1 } } : {}),
    },
  });

  return c.json(ok({ success: true }));
});

app.post(
  "/heartbeat",
  zValidator("json", z.object({ sessionId: z.string() })),
  async (c) => {
    const { sessionId } = c.req.valid("json");
    const visitor = await db.visitor.findUnique({ where: { sessionId } });
    if (!visitor) return c.json(fail("Session not found", "NOT_FOUND"), 404);
    const sinceLast = Math.floor((Date.now() - visitor.lastActiveAt.getTime()) / 1000);
    await db.visitor.update({
      where: { id: visitor.id },
      data: {
        lastActiveAt: new Date(),
        totalDuration: { increment: Math.min(sinceLast, 60) },
      },
    });
    return c.json(ok({ success: true }));
  },
);

app.post(
  "/exit",
  zValidator("json", z.object({ sessionId: z.string() })),
  async (c) => {
    const { sessionId } = c.req.valid("json");
    await db.visitor.updateMany({
      where: { sessionId },
      data: { isActive: false, exitedAt: new Date() },
    });
    return c.json(ok({ success: true }));
  },
);

export default app;

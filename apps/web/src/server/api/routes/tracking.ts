import { Hono } from "hono";
import { zValidator } from "@/server/api/lib/z-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import {
  ok,
  fail,
  VisitorSessionSchema,
  VisitorEventSchema,
  VisitorExitSchema,
} from "@speedy-van/shared";
import { getDatabaseConfigError } from "../lib/database-config";
import {
  heartbeatDurationIncrementSeconds,
  shouldApplyExit,
} from "../lib/visitor-activity";

const app = new Hono();

function newSessionId(): string {
  return `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function useLocalTrackingStub(): boolean {
  return process.env.NODE_ENV !== "production" && Boolean(getDatabaseConfigError());
}

app.post("/session", zValidator("json", VisitorSessionSchema), async (c) => {
  if (useLocalTrackingStub()) {
    return c.json(ok({ sessionId: newSessionId(), persisted: false }));
  }
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
  if (useLocalTrackingStub()) return c.json(ok({ success: true, persisted: false }));
  const { sessionId, type, page, element, metadata } = c.req.valid("json");
  const visitor = await db.visitor.findUnique({ where: { sessionId } });
  if (!visitor) return c.json(fail("Session not found", "NOT_FOUND"), 404);
  const now = new Date();

  await db.$transaction([
    db.visitorEvent.create({
      data: {
        visitorId: visitor.id,
        type,
        page,
        element,
        metadata: metadata as never,
      },
    }),
    db.visitor.update({
      where: { id: visitor.id },
      data: {
        isActive: true,
        exitedAt: null,
        lastActiveAt: now,
        ...(type === "page_view" ? { pageViews: { increment: 1 } } : {}),
      },
    }),
  ]);

  return c.json(ok({ success: true }));
});

app.post(
  "/heartbeat",
  zValidator("json", z.object({ sessionId: z.string() })),
  async (c) => {
    if (useLocalTrackingStub()) return c.json(ok({ success: true, persisted: false }));
    const { sessionId } = c.req.valid("json");
    const visitor = await db.visitor.findUnique({ where: { sessionId } });
    if (!visitor) return c.json(fail("Session not found", "NOT_FOUND"), 404);
    const now = new Date();
    const sinceLast = heartbeatDurationIncrementSeconds(visitor.lastActiveAt, now);
    await db.visitor.update({
      where: { id: visitor.id },
      data: {
        isActive: true,
        exitedAt: null,
        lastActiveAt: now,
        totalDuration: { increment: sinceLast },
      },
    });
    return c.json(ok({ success: true }));
  },
);

app.post(
  "/exit",
  zValidator("json", VisitorExitSchema),
  async (c) => {
    if (useLocalTrackingStub()) return c.json(ok({ success: true, persisted: false }));
    const { sessionId, sentAt } = c.req.valid("json");
    const visitor = await db.visitor.findUnique({
      where: { sessionId },
      select: { id: true, lastActiveAt: true },
    });
    if (!visitor) return c.json(ok({ success: true, missing: true }));

    const exitSentAt = sentAt ? new Date(sentAt) : new Date();
    if (!shouldApplyExit(visitor.lastActiveAt, exitSentAt)) {
      return c.json(ok({ success: true, ignored: true }));
    }

    await db.visitor.updateMany({
      where: { id: visitor.id, lastActiveAt: { lte: exitSentAt } },
      data: { isActive: false, exitedAt: exitSentAt },
    });
    return c.json(ok({ success: true }));
  },
);

export default app;

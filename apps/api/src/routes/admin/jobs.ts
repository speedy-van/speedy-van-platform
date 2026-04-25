import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";
import { publishToJobBoard } from "../../services/job.service";

const app = new Hono();
app.use("*", requireAdmin);

app.get(
  "/",
  zValidator(
    "query",
    z.object({
      status: z.string().optional(),
      isPublic: z.enum(["true", "false"]).optional(),
      bookingId: z.string().optional(),
    }),
  ),
  async (c) => {
    const { status, isPublic, bookingId } = c.req.valid("query");
    const jobs = await db.driverJob.findMany({
      where: {
        ...(status ? { status: status as never } : {}),
        ...(isPublic !== undefined ? { isPublic: isPublic === "true" } : {}),
        ...(bookingId ? { bookingId } : {}),
      },
      include: {
        booking: { select: { id: true, reference: true, serviceName: true, scheduledAt: true, totalPrice: true, pickupAddress: true, dropoffAddress: true, customerName: true } },
        driver: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return c.json(ok({ jobs }));
  },
);

app.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      isPublic: z.boolean().optional(),
      status: z.string().optional(),
      driverId: z.string().nullable().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const job = await db.driverJob.findUnique({ where: { id } });
    if (!job) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.driverJob.update({
      where: { id },
      data: data as never,
    });
    return c.json(ok(updated));
  },
);

app.post("/publish/:bookingId", async (c) => {
  const bookingId = c.req.param("bookingId");
  const job = await publishToJobBoard(bookingId);
  return c.json(ok(job));
});

app.post("/pause-all", async (c) => {
  const r = await db.driverJob.updateMany({
    where: { status: "AVAILABLE" },
    data: { isPublic: false },
  });
  return c.json(ok({ paused: r.count }));
});

app.post("/resume-all", async (c) => {
  const r = await db.driverJob.updateMany({
    where: { status: "AVAILABLE" },
    data: { isPublic: true },
  });
  return c.json(ok({ resumed: r.count }));
});

app.patch(
  "/:id/driver-pay",
  zValidator("json", z.object({ driverPay: z.number().min(0), driverPayNotes: z.string().optional() })),
  async (c) => {
    const id = c.req.param("id");
    const { driverPay, driverPayNotes } = c.req.valid("json");
    const job = await db.driverJob.findUnique({ where: { id } });
    if (!job) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.driverJob.update({
      where: { id },
      data: { driverPay, ...(driverPayNotes !== undefined ? { driverPayNotes } : {}) },
    });
    return c.json(ok(updated));
  },
);

export default app;

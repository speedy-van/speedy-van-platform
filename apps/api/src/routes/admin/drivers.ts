import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, type VanSize } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";
import { sendDriverWelcome } from "../../services/email.service";

const app = new Hono();
app.use("*", requireAdmin);

app.get("/", async (c) => {
  const drivers = await db.driver.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true } },
      _count: { select: { bookings: true } },
    },
  });
  return c.json(ok({ drivers }));
});

const CreateDriverSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  vanSize: z.enum(["SMALL", "MEDIUM", "LARGE", "LUTON"]).default("MEDIUM"),
});

function randomPassword(len = 12): string {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from({ length: len }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

app.post("/", zValidator("json", CreateDriverSchema), async (c) => {
  const { name, email, phone, vanSize } = c.req.valid("json");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return c.json(fail("Email already in use", "EMAIL_TAKEN"), 409);

  const tempPassword = randomPassword();
  const hashed = await bcrypt.hash(tempPassword, 10);
  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      password: hashed,
      role: "DRIVER",
      driver: { create: { vanSize: vanSize as VanSize } },
    },
    include: { driver: true },
  });

  await sendDriverWelcome({ email: user.email, name: user.name }, tempPassword).catch(() => {});

  return c.json(ok({ user, tempPassword }), 201);
});

app.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      vanSize: z.enum(["SMALL", "MEDIUM", "LARGE", "LUTON"]).optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);

    const userUpdate = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
    };
    const driverUpdate = data.vanSize ? { vanSize: data.vanSize as VanSize } : {};

    const [user, updatedDriver] = await db.$transaction([
      db.user.update({ where: { id: driver.userId }, data: userUpdate }),
      db.driver.update({ where: { id }, data: driverUpdate }),
    ]);
    return c.json(ok({ user, driver: updatedDriver }));
  },
);

app.post("/:id/reset-password", async (c) => {
  const id = c.req.param("id");
  const driver = await db.driver.findUnique({ where: { id }, include: { user: true } });
  if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);

  const tempPassword = randomPassword();
  const hashed = await bcrypt.hash(tempPassword, 10);
  await db.user.update({ where: { id: driver.userId }, data: { password: hashed } });
  await sendDriverWelcome({ email: driver.user.email, name: driver.user.name }, tempPassword).catch(
    () => {},
  );
  return c.json(ok({ success: true, tempPassword }));
});

app.patch(
  "/:id/status",
  zValidator("json", z.object({ isActive: z.boolean() })),
  async (c) => {
    const id = c.req.param("id");
    const { isActive } = c.req.valid("json");
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const [u, d] = await db.$transaction([
      db.user.update({ where: { id: driver.userId }, data: { isActive } }),
      db.driver.update({ where: { id }, data: { isActive } }),
    ]);
    return c.json(ok({ user: u, driver: d }));
  },
);

// ── Driver Pay Config ────────────────────────────────────────────────────────

app.get("/pay-config", async (c) => {
  const [pct, min] = await Promise.all([
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_percentage" } } }),
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_minimum" } } }),
  ]);
  return c.json(ok({
    percentage: pct?.value ?? 60,
    minimum: min?.value ?? 25,
  }));
});

app.patch(
  "/pay-config",
  zValidator("json", z.object({ percentage: z.number().min(1).max(100).optional(), minimum: z.number().min(0).optional() })),
  async (c) => {
    const { percentage, minimum } = c.req.valid("json");
    const ops = [];
    if (percentage !== undefined) {
      ops.push(db.pricingConfig.upsert({
        where: { category_key: { category: "driver", key: "driver_pay_percentage" } },
        update: { value: percentage },
        create: { category: "driver", key: "driver_pay_percentage", value: percentage, description: "Driver pay as % of customer price" },
      }));
    }
    if (minimum !== undefined) {
      ops.push(db.pricingConfig.upsert({
        where: { category_key: { category: "driver", key: "driver_pay_minimum" } },
        update: { value: minimum },
        create: { category: "driver", key: "driver_pay_minimum", value: minimum, description: "Minimum driver pay per job (£)" },
      }));
    }
    await Promise.all(ops);
    return c.json(ok({ success: true }));
  },
);

// ── Driver Earnings ──────────────────────────────────────────────────────────

app.get("/:id/earnings", async (c) => {
  const id = c.req.param("id");
  const driver = await db.driver.findUnique({ where: { id } });
  if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [all, thisMonth, unpaid, paid] = await Promise.all([
    db.driverJob.aggregate({ where: { driverId: id }, _sum: { driverPay: true } }),
    db.driverJob.aggregate({ where: { driverId: id, createdAt: { gte: startOfMonth } }, _sum: { driverPay: true } }),
    db.driverJob.aggregate({ where: { driverId: id, driverPayStatus: "unpaid", status: "COMPLETED" }, _sum: { driverPay: true } }),
    db.driverJob.aggregate({ where: { driverId: id, driverPayStatus: "paid" }, _sum: { driverPay: true } }),
  ]);

  return c.json(ok({
    total: all._sum.driverPay ?? 0,
    thisMonth: thisMonth._sum.driverPay ?? 0,
    unpaid: unpaid._sum.driverPay ?? 0,
    paid: paid._sum.driverPay ?? 0,
  }));
});

app.post("/:id/mark-paid", async (c) => {
  const id = c.req.param("id");
  const driver = await db.driver.findUnique({ where: { id } });
  if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const result = await db.driverJob.updateMany({
    where: { driverId: id, driverPayStatus: "unpaid", status: "COMPLETED" },
    data: { driverPayStatus: "paid" },
  });
  return c.json(ok({ success: true, markedPaid: result.count }));
});

export default app;

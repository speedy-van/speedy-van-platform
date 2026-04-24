import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { DEFAULT_PRICING_CONFIG_ROWS } from "@speedy-van/config";
import { requireAdmin } from "../../middleware/auth";
import { clearPricingCache } from "../../services/pricing.service";

const app = new Hono();
app.use("*", requireAdmin);

app.get("/", async (c) => {
  const rows = await db.pricingConfig.findMany({ orderBy: [{ category: "asc" }, { key: "asc" }] });
  const grouped = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    (acc[row.category] ??= []).push(row);
    return acc;
  }, {});
  return c.json(ok({ grouped, items: rows }));
});

app.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      value: z.number(),
      label: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const exists = await db.pricingConfig.findUnique({ where: { id } });
    if (!exists) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.pricingConfig.update({ where: { id }, data });
    clearPricingCache();
    return c.json(ok(updated));
  },
);

app.post(
  "/bulk-update",
  zValidator(
    "json",
    z.object({
      category: z.string().optional(),
      percentage: z.number(),
    }),
  ),
  async (c) => {
    const { category, percentage } = c.req.valid("json");
    const factor = 1 + percentage / 100;
    const where = category ? { category } : {};
    const rows = await db.pricingConfig.findMany({ where });
    await db.$transaction(
      rows.map((r) =>
        db.pricingConfig.update({
          where: { id: r.id },
          data: { value: Math.round(r.value * factor * 100) / 100 },
        }),
      ),
    );
    clearPricingCache();
    return c.json(ok({ updated: rows.length }));
  },
);

app.post("/reset", async (c) => {
  await db.$transaction([
    db.pricingConfig.deleteMany({}),
    db.pricingConfig.createMany({ data: DEFAULT_PRICING_CONFIG_ROWS }),
  ]);
  clearPricingCache();
  return c.json(ok({ success: true, count: DEFAULT_PRICING_CONFIG_ROWS.length }));
});

export default app;

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok } from "@speedy-van/shared";

const app = new Hono();

app.get(
  "/",
  zValidator(
    "query",
    z.object({
      type: z.enum(["residential", "business", "both"]).optional(),
    }),
  ),
  async (c) => {
    const { type } = c.req.valid("query");
    const where = type
      ? { isActive: true, OR: [{ type }, { type: "both" }] }
      : { isActive: true };

    const categories = await db.itemCategory.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    c.header("Cache-Control", "public, s-maxage=3600");
    return c.json(ok({ categories }));
  },
);

export default app;

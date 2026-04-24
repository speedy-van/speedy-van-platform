import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const app = new Hono();
app.use("*", requireAdmin);

app.get("/", async (c) => {
  const userId = c.get("userId") as string;
  const items = await db.notification.findMany({
    where: { userId },
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
    take: 50,
  });
  return c.json(ok({ items }));
});

app.post(
  "/read",
  zValidator(
    "json",
    z.object({ ids: z.array(z.string()).optional(), all: z.boolean().optional() }),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const { ids, all } = c.req.valid("json");
    if (all) {
      const r = await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return c.json(ok({ updated: r.count }));
    }
    if (!ids || ids.length === 0) {
      return c.json(fail("ids or all required", "BAD_REQUEST"), 400);
    }
    const r = await db.notification.updateMany({
      where: { userId, id: { in: ids } },
      data: { isRead: true },
    });
    return c.json(ok({ updated: r.count }));
  },
);

app.patch(
  "/:id",
  zValidator("json", z.object({ isRead: z.boolean() })),
  async (c) => {
    const userId = c.get("userId") as string;
    const id = c.req.param("id");
    const note = await db.notification.findUnique({ where: { id } });
    if (!note || note.userId !== userId) {
      return c.json(fail("Not found", "NOT_FOUND"), 404);
    }
    const updated = await db.notification.update({
      where: { id },
      data: { isRead: c.req.valid("json").isRead },
    });
    return c.json(ok(updated));
  },
);

app.delete("/:id", async (c) => {
  const userId = c.get("userId") as string;
  const id = c.req.param("id");
  const note = await db.notification.findUnique({ where: { id } });
  if (!note || note.userId !== userId) {
    return c.json(fail("Not found", "NOT_FOUND"), 404);
  }
  await db.notification.delete({ where: { id } });
  return c.json(ok({ success: true }));
});

export default app;

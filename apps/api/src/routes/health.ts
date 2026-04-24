import { Hono } from "hono";
import { ok } from "@speedy-van/shared";

const app = new Hono();

app.get("/", (c) => c.json(ok({ status: "ok", time: new Date().toISOString() })));

export default app;

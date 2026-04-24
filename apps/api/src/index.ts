import { serve } from "@hono/node-server";
import app from "./app";

const port = Number(process.env["PORT"] ?? 4000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🚀 Speedy Van API running at http://localhost:${info.port}`);
});

export default app;

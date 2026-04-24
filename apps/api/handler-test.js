const { Hono } = require("hono");
const { getRequestListener } = require("@hono/node-server");

const app = new Hono();
app.get("/", (c) => c.json({ status: "ok", time: new Date().toISOString() }));
app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));

module.exports = getRequestListener(app.fetch);

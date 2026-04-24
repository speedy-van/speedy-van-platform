// Minimal diagnostic handler to isolate Lambda startup failures
module.exports = async (req, res) => {
  const result = { node: process.version, env: process.env.NODE_ENV };

  try {
    const { PrismaClient } = require("@prisma/client");
    result.prismaClientLoaded = true;
    try {
      const client = new PrismaClient();
      result.prismaClientCreated = true;
      await client.$disconnect();
    } catch (e2) {
      result.prismaClientError = e2.message;
    }
  } catch (e1) {
    result.prismaLoadError = e1.message;
  }

  // Try the Neon adapter path (what the bundle uses)
  try {
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const { neon } = require("@neondatabase/serverless");
    result.neonAdapterLoaded = true;
    try {
      const sql = neon(process.env.DATABASE_URL);
      const adapter = new PrismaNeon(sql);
      const { PrismaClient } = require("@prisma/client");
      const client = new PrismaClient({ adapter });
      result.neonAdapterCreated = true;
      try {
        const r = await client.$queryRaw`SELECT 1 as test`;
        result.neonQueryOk = true;
        result.neonQueryResult = r;
      } catch (e4) {
        result.neonQueryError = e4.message;
      }
      await client.$disconnect();
    } catch (e3) {
      result.neonAdapterCreateError = e3.message;
      result.neonAdapterCreateStack = e3.stack ? e3.stack.split("\n").slice(0, 5).join(" | ") : null;
    }
  } catch (e0) {
    result.neonAdapterLoadError = e0.message;
  }

  // Try loading the bundle itself
  try {
    const bundle = require("./_api.js");
    result.bundleLoaded = true;
    result.bundleType = typeof bundle;
  } catch (eb) {
    result.bundleLoadError = eb.message;
    result.bundleLoadStack = eb.stack ? eb.stack.split("\n").slice(0, 8).join(" | ") : null;
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(result, null, 2));
};


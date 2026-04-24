// Minimal diagnostic handler to isolate Lambda startup failures
module.exports = async (req, res) => {
  const result = { node: process.version, env: process.env.NODE_ENV };

  try {
    const { PrismaClient } = require("@prisma/client");
    result.prismaClientLoaded = true;
    try {
      const client = new PrismaClient();
      result.prismaClientCreated = true;
      result.prismaEngineType = process.env.PRISMA_CLIENT_ENGINE_TYPE || "default";
      await client.$disconnect();
    } catch (e2) {
      result.prismaClientError = e2.message;
    }
  } catch (e1) {
    result.prismaLoadError = e1.message;
    result.prismaLoadStack = e1.stack ? e1.stack.split("\n").slice(0, 5).join(" | ") : null;
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(result, null, 2));
};

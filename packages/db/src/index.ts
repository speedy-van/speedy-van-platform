import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env["DATABASE_URL"];
  // Use Neon serverless WebSocket adapter only on Vercel/serverless (Lambda),
  // where the native Prisma binary cannot run. On local dev (Windows/macOS/Linux),
  // the WebSocket connection is unreliable, so fall back to the standard
  // Prisma client which connects over TCP with the native query engine.
  const isServerless =
    !!process.env["VERCEL"] ||
    !!process.env["AWS_LAMBDA_FUNCTION_NAME"] ||
    process.env["PRISMA_USE_NEON_ADAPTER"] === "1";

  if (databaseUrl && isServerless) {
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({
      adapter,
      log: process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"],
    } as ConstructorParameters<typeof PrismaClient>[0]);
  }
  return new PrismaClient({
    log: process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") globalForPrisma.prisma = prisma;

// Alias for Phase 2 API code
export const db = prisma;

export * from "@prisma/client";

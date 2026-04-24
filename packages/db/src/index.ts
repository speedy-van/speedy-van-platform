import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

function createPrismaClient(): PrismaClient {
  // Use Neon serverless driver when DATABASE_URL is set (avoids native binary in Lambda)
  const databaseUrl = process.env["DATABASE_URL"];
  if (databaseUrl) {
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

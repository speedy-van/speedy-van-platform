import type { Context } from "hono";
import { ZodError } from "zod";
import { fail } from "@speedy-van/shared";

export function errorHandler(err: Error, c: Context): Response {
  console.error(`[API Error] ${c.req.method} ${c.req.path}:`, err.message);

  if (err instanceof ZodError) {
    return c.json(fail("Validation failed", "VALIDATION_ERROR", err.flatten()), 400);
  }

  if (err.message === "STRIPE_NOT_CONFIGURED") {
    return c.json(fail("Payments are not configured on this server", "STRIPE_NOT_CONFIGURED"), 503);
  }

  if (err.message === "NOT_FOUND") {
    return c.json(fail("Resource not found", "NOT_FOUND"), 404);
  }

  console.error(err.stack);
  const isDev = process.env.NODE_ENV !== "production";
  return c.json(
    fail(
      isDev ? `Internal server error: ${err.message}` : "Internal server error",
      "INTERNAL_ERROR",
      isDev ? { stack: err.stack } : undefined,
    ),
    500,
  );
}

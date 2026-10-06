import type { Context, Next } from "hono";
import { verifyToken } from "../lib/jwt";
import { db } from "@speedy-van/db";
import { fail } from "@speedy-van/shared";
import type { Role } from "@speedy-van/db";

export type AuthContext = {
  Variables: {
    userId: string;
    userRole: Role;
    userEmail: string;
  };
};

async function authenticate(
  c: Context,
): Promise<{ ok: true; userId: string; role: Role; email: string } | { ok: false; status: 401; message: string }> {
  const header = c.req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Missing or malformed Authorization header" };
  }
  const token = header.slice(7);
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }

  const user = await db.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) {
    return { ok: false, status: 401, message: "User not found or inactive" };
  }

  return { ok: true, userId: user.id, role: user.role, email: user.email };
}

export async function requireAuth(c: Context, next: Next): Promise<Response | void> {
  const result = await authenticate(c);
  if (!result.ok) return c.json(fail(result.message, "UNAUTHORIZED"), 401);
  c.set("userId", result.userId);
  c.set("userRole", result.role);
  c.set("userEmail", result.email);
  await next();
}

export function requireRole(...roles: Role[]) {
  return async (c: Context, next: Next): Promise<Response | void> => {
    const result = await authenticate(c);
    if (!result.ok) return c.json(fail(result.message, "UNAUTHORIZED"), 401);
    if (!roles.includes(result.role)) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    c.set("userId", result.userId);
    c.set("userRole", result.role);
    c.set("userEmail", result.email);
    await next();
  };
}

export const requireAdmin = requireRole("ADMIN");
export const requireDriver = requireRole("DRIVER");
export const requireCustomer = requireRole("CUSTOMER");

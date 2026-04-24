import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { db } from "@speedy-van/db";
import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ok,
  fail,
  generateResetToken,
} from "@speedy-van/shared";
import { signToken } from "../lib/jwt";
import { requireAuth } from "../middleware/auth";
import { sendPasswordReset } from "../services/email.service";
import { SITE } from "@speedy-van/config";

const app = new Hono();

app.post("/login", zValidator("json", LoginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return c.json(fail("Invalid credentials", "INVALID_CREDENTIALS"), 401);
  }
  const okPw = await bcrypt.compare(password, user.password);
  if (!okPw) return c.json(fail("Invalid credentials", "INVALID_CREDENTIALS"), 401);

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return c.json(
    ok({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }),
  );
});

app.post("/register", zValidator("json", RegisterSchema), async (c) => {
  const { name, email, phone, password } = c.req.valid("json");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return c.json(fail("Email already in use", "EMAIL_TAKEN"), 409);

  const hashed = password
    ? await bcrypt.hash(password, 10)
    : await bcrypt.hash(`guest-${Date.now()}-${Math.random()}`, 10);

  const user = await db.user.create({
    data: { name, email, phone, password: hashed, role: "CUSTOMER" },
  });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return c.json(
    ok({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }),
    201,
  );
});

app.post("/forgot-password", zValidator("json", ForgotPasswordSchema), async (c) => {
  const { email } = c.req.valid("json");
  const user = await db.user.findUnique({ where: { email } });
  // Always return success (don't leak whether email is registered)
  if (user && user.isActive) {
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await db.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });
    const resetUrl = `${SITE.url}/auth/reset?token=${token}`;
    await sendPasswordReset(user.email, resetUrl).catch(() => {});
  }
  return c.json(ok({ success: true }));
});

app.post("/reset-password", zValidator("json", ResetPasswordSchema), async (c) => {
  const { token, newPassword } = c.req.valid("json");
  const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return c.json(fail("Invalid or expired token", "INVALID_TOKEN"), 400);
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.$transaction([
    db.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);
  return c.json(ok({ success: true }));
});

app.get("/me", requireAuth, async (c) => {
  const userId = c.get("userId") as string;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) return c.json(fail("User not found", "NOT_FOUND"), 404);
  return c.json(ok({ user }));
});

export default app;

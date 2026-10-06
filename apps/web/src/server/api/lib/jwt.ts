import jwt from "jsonwebtoken";
import type { JWTPayload } from "@speedy-van/shared";

const SECRET = process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";

if (!SECRET) {
  console.warn(
    "[jwt] WARNING: neither JWT_SECRET nor NEXTAUTH_SECRET is set. Tokens will be insecure.",
  );
}

const FALLBACK = "speedy-van-insecure-fallback-secret-change-me";

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET || FALLBACK, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET || FALLBACK) as JWTPayload;
}

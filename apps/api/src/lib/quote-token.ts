import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.QUOTE_SIGNING_SECRET ?? "";
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export interface QuoteTokenPayload {
  price: number;
  staticSubtotal: number;
  serviceType: string;
  distanceMiles: number;
  expiresAt: number;
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function issueQuoteToken(payload: QuoteTokenPayload): string {
  const data = JSON.stringify({ ...payload, expiresAt: Date.now() + EXPIRY_MS });
  const encoded = Buffer.from(data).toString("base64url");
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

export type TokenVerifyResult =
  | { ok: true; payload: QuoteTokenPayload }
  | { ok: false; reason: "expired" | "invalid" | "misconfigured" };

export function verifyQuoteToken(token: string): TokenVerifyResult {
  if (!SECRET) return { ok: false, reason: "misconfigured" };
  const dot = token.lastIndexOf(".");
  if (dot === -1) return { ok: false, reason: "invalid" };
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(encoded);
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(sig, "utf8");
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    return { ok: false, reason: "invalid" };
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as QuoteTokenPayload;
    if (Date.now() > payload.expiresAt) return { ok: false, reason: "expired" };
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

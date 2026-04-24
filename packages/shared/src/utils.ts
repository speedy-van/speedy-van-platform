import { customAlphabet } from "./_nanoid";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/I/1
const refSuffix = customAlphabet(ALPHABET, 6);

export function generateBookingReference(): string {
  const year = new Date().getUTCFullYear();
  return `SVR-${year}-${refSuffix()}`;
}

const TOKEN_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const tokenGen = customAlphabet(TOKEN_ALPHABET, 64);
export function generateResetToken(): string {
  return tokenGen();
}

export function calculateRefund(
  scheduledAt: Date,
  totalPrice: number,
  now: Date = new Date(),
): number {
  const hoursToService = (scheduledAt.getTime() - now.getTime()) / 3_600_000;
  if (hoursToService >= 48) return totalPrice; // full refund
  if (hoursToService >= 24) return Math.round(totalPrice * 0.5 * 100) / 100;
  return 0;
}

export function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100);
}
export function penceToPounds(pence: number): number {
  return Math.round(pence) / 100;
}

export function isUkPostcode(s: string): boolean {
  return /^([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/i.test(s.trim());
}

export function maskPostcode(postcode: string): string {
  // Return only the outward code: "SW1A 1AA" -> "SW1A"
  const trimmed = postcode.replace(/\s+/g, "");
  return trimmed.slice(0, Math.max(2, trimmed.length - 3)).toUpperCase();
}

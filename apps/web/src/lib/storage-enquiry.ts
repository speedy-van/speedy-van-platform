import type { StorageEnquiryCreateInput } from "@speedy-van/shared";

export const STORAGE_ENQUIRY_DRAFT_KEY = "sv_storage_enquiry_draft_v1";
export const STORAGE_ENQUIRY_RECEIPT_KEY = "sv_storage_enquiry_receipt_v1";
export const STORAGE_ENQUIRY_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export const STORAGE_ENQUIRY_API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

export type StorageEnquiryDraft<T> = {
  savedAt: number;
  form: T;
};

export type StorageEnquiryReceipt = {
  reference: string;
  createdAt: string;
  message: string;
};

export function newStorageEnquiryKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

export function parseStorageEnquiryDraft<T>(
  raw: string | null,
  fallback: T,
  now = Date.now(),
): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as StorageEnquiryDraft<T>;
    if (!parsed || typeof parsed.savedAt !== "number" || now - parsed.savedAt > STORAGE_ENQUIRY_DRAFT_TTL_MS) {
      return fallback;
    }
    return parsed.form ?? fallback;
  } catch {
    return fallback;
  }
}

export function serialiseStorageEnquiryDraft<T>(form: T, savedAt = Date.now()): string {
  return JSON.stringify({ savedAt, form });
}

export function storageEnquiryReceiptFromApi(value: unknown): StorageEnquiryReceipt | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.reference !== "string" || typeof data.createdAt !== "string") return null;
  return {
    reference: data.reference,
    createdAt: data.createdAt,
    message: typeof data.message === "string" ? data.message : "Storage enquiry received.",
  };
}

export function redactedStorageAnalytics(input: StorageEnquiryCreateInput): Record<string, string | boolean> {
  return {
    storage_duration: input.storageDuration,
    estimated_unit_size: input.estimatedUnitSize,
    start_known: input.storageStart.kind === "known",
    needs_collection_transport: input.needsCollectionTransport,
    needs_return_transport: input.needsReturnTransport,
  };
}

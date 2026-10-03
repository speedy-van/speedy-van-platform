import { z } from "zod";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_RE = /^[+()\-\s\d]{7,24}$/;
const IDEMPOTENCY_RE = /^[A-Za-z0-9_-]+$/;

export const STORAGE_ENQUIRY_STATUSES = ["new", "under_review", "quoted", "closed"] as const;
export const StorageEnquiryStatusSchema = z.enum(STORAGE_ENQUIRY_STATUSES);
export type StorageEnquiryStatus = z.infer<typeof StorageEnquiryStatusSchema>;

export const STORAGE_DURATION_OPTIONS = [
  { value: "under_1_month", label: "Under 1 month" },
  { value: "1_3_months", label: "1 to 3 months" },
  { value: "3_6_months", label: "3 to 6 months" },
  { value: "6_12_months", label: "6 to 12 months" },
  { value: "over_12_months", label: "Over 12 months" },
  { value: "not_sure", label: "Not sure yet" },
] as const;
const STORAGE_DURATION_VALUES = STORAGE_DURATION_OPTIONS.map((option) => option.value) as [
  (typeof STORAGE_DURATION_OPTIONS)[number]["value"],
  ...(typeof STORAGE_DURATION_OPTIONS)[number]["value"][],
];

export const STORAGE_UNIT_SIZE_OPTIONS = [
  { value: "few_items", label: "A few boxes or items" },
  { value: "small_room", label: "Small room" },
  { value: "one_bed_flat", label: "1-bed flat" },
  { value: "two_bed_home", label: "2-bed home" },
  { value: "three_bed_home", label: "3-bed home" },
  { value: "larger_home", label: "Larger home or office" },
  { value: "not_sure", label: "Not sure yet" },
] as const;
const STORAGE_UNIT_SIZE_VALUES = STORAGE_UNIT_SIZE_OPTIONS.map((option) => option.value) as [
  (typeof STORAGE_UNIT_SIZE_OPTIONS)[number]["value"],
  ...(typeof STORAGE_UNIT_SIZE_OPTIONS)[number]["value"][],
];

export const STORAGE_PROPERTY_TYPES = ["house", "flat", "bungalow", "office", "storage_unit", "other"] as const;
export const STORAGE_QUOTE_PERIODS = ["week", "month", "total", "custom"] as const;
const STORAGE_QUOTE_PERIOD_VALUES = ["week", "month", "total", "custom"] as [
  (typeof STORAGE_QUOTE_PERIODS)[number],
  ...(typeof STORAGE_QUOTE_PERIODS)[number][],
];

const StorageDateSchema = z
  .object({
    kind: z.literal("known"),
    date: z.string().regex(DATE_RE),
  })
  .or(z.object({ kind: z.literal("undecided") }));

const OptionalAddressSchema = z.object({
  address: z.string().max(255).optional().nullable(),
  postcode: z.string().max(16).optional().nullable(),
});

const StorageAccessSchema = z.object({
  propertyType: z.enum(STORAGE_PROPERTY_TYPES).optional().nullable(),
  floor: z.coerce.number().int().min(0).max(60).optional().nullable(),
  hasLift: z.boolean().optional().nullable(),
  carryDistanceMetres: z.coerce.number().int().min(0).max(500).optional().nullable(),
  narrowAccess: z.boolean().default(false),
  permitOrRestrictedParking: z.boolean().default(false),
  accessNotes: z.string().max(1000).optional().nullable(),
});

export const StorageEnquiryCreateSchema = z
  .object({
    idempotencyKey: z.string().min(16).max(128).regex(IDEMPOTENCY_RE),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().max(80).optional().nullable(),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().regex(PHONE_RE, "Invalid phone number"),
    storageStart: StorageDateSchema,
    storageDuration: z.enum(STORAGE_DURATION_VALUES),
    estimatedUnitSize: z.enum(STORAGE_UNIT_SIZE_VALUES),
    needsCollectionTransport: z.boolean().default(true),
    collectionAddress: z.string().trim().max(255).optional().nullable(),
    collectionPostcode: z.string().trim().min(2).max(16),
    collectionAccess: StorageAccessSchema.default({
      narrowAccess: false,
      permitOrRestrictedParking: false,
    }),
    storageFacilityKnown: z.boolean().default(false),
    storageFacility: OptionalAddressSchema.optional().nullable(),
    needsReturnTransport: z.boolean().default(false),
    returnDestinationKnown: z.boolean().default(false),
    returnAddress: z.string().trim().max(255).optional().nullable(),
    returnPostcode: z.string().trim().max(16).optional().nullable(),
    returnDate: StorageDateSchema.optional().nullable(),
    itemDescription: z.string().trim().min(10).max(2000),
    needsPacking: z.boolean().default(false),
    needsDismantling: z.boolean().default(false),
    notes: z.string().trim().max(2000).optional().nullable(),
    source: z
      .object({
        page: z.string().max(255).optional().nullable(),
        referrer: z.string().max(500).optional().nullable(),
        service: z.string().max(80).optional().nullable(),
        utmSource: z.string().max(120).optional().nullable(),
        utmMedium: z.string().max(120).optional().nullable(),
        utmCampaign: z.string().max(120).optional().nullable(),
      })
      .optional()
      .nullable(),
  })
  .refine((value) => !value.storageFacilityKnown || Boolean(value.storageFacility?.postcode?.trim()), {
    message: "Storage facility postcode is required when the facility is known",
    path: ["storageFacility", "postcode"],
  })
  .refine((value) => !value.returnDestinationKnown || Boolean(value.returnPostcode?.trim()), {
    message: "Return postcode is required when the return destination is known",
    path: ["returnPostcode"],
  });

export type StorageDuration = (typeof STORAGE_DURATION_OPTIONS)[number]["value"];
export type StorageUnitSize = (typeof STORAGE_UNIT_SIZE_OPTIONS)[number]["value"];
export type StoragePropertyType = (typeof STORAGE_PROPERTY_TYPES)[number];
export type StorageQuotePeriod = (typeof STORAGE_QUOTE_PERIODS)[number];
export type StorageEnquiryCreateInput = z.infer<typeof StorageEnquiryCreateSchema>;

export const StorageEnquiryAdminPatchSchema = z.object({
  status: StorageEnquiryStatusSchema.optional(),
  quotedTransportPrice: z.coerce.number().min(0).max(1_000_000).optional().nullable(),
  quotedStoragePrice: z.coerce.number().min(0).max(1_000_000).optional().nullable(),
  quotePeriod: z.enum(STORAGE_QUOTE_PERIOD_VALUES).optional().nullable(),
  quoteNotes: z.string().max(2000).optional().nullable(),
  adminNotes: z.string().max(2000).optional().nullable(),
});

export type StorageEnquiryAdminPatchInput = z.infer<typeof StorageEnquiryAdminPatchSchema>;

export const StorageEnquirySendQuoteSchema = z.object({
  quotedTransportPrice: z.coerce.number().min(0).max(1_000_000).optional().nullable(),
  quotedStoragePrice: z.coerce.number().min(0).max(1_000_000).optional().nullable(),
  quotePeriod: z.enum(STORAGE_QUOTE_PERIOD_VALUES).optional().nullable(),
  quoteNotes: z.string().max(2000).optional().nullable(),
});

export type StorageEnquirySendQuoteInput = z.infer<typeof StorageEnquirySendQuoteSchema>;

function optionLabel<T extends string>(options: readonly { value: T; label: string }[], value: T): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function storageDurationLabel(value: StorageDuration): string {
  return optionLabel(STORAGE_DURATION_OPTIONS, value);
}

export function storageUnitSizeLabel(value: StorageUnitSize): string {
  return optionLabel(STORAGE_UNIT_SIZE_OPTIONS, value);
}

export function storageStartDateLabel(value: StorageEnquiryCreateInput["storageStart"]): string {
  return value.kind === "known" ? value.date : "Not decided yet";
}

export function storageCustomerName(input: Pick<StorageEnquiryCreateInput, "firstName" | "lastName">): string {
  return [input.firstName, input.lastName ?? ""].map((part) => part.trim()).filter(Boolean).join(" ");
}

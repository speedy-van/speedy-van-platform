-- CreateEnum extension: storage enquiry admin notifications
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'STORAGE_ENQUIRY';

-- CreateTable: manual storage quote enquiries, separate from paid bookings.
CREATE TABLE "StorageEnquiry" (
  "id" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "firstName" TEXT NOT NULL,
  "lastName" TEXT,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "storageStartKind" TEXT NOT NULL,
  "storageStartDate" TIMESTAMP(3),
  "storageDuration" TEXT NOT NULL,
  "estimatedUnitSize" TEXT NOT NULL,
  "needsCollectionTransport" BOOLEAN NOT NULL DEFAULT true,
  "collectionAddress" TEXT,
  "collectionPostcode" TEXT NOT NULL,
  "collectionAccess" JSONB NOT NULL,
  "storageFacilityKnown" BOOLEAN NOT NULL DEFAULT false,
  "storageFacility" JSONB,
  "needsReturnTransport" BOOLEAN NOT NULL DEFAULT false,
  "returnDestinationKnown" BOOLEAN NOT NULL DEFAULT false,
  "returnAddress" TEXT,
  "returnPostcode" TEXT,
  "returnDateKind" TEXT,
  "returnDate" TIMESTAMP(3),
  "itemDescription" TEXT NOT NULL,
  "needsPacking" BOOLEAN NOT NULL DEFAULT false,
  "needsDismantling" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT,
  "source" JSONB,
  "snapshot" JSONB NOT NULL,
  "quotedTransportPrice" DOUBLE PRECISION,
  "quotedStoragePrice" DOUBLE PRECISION,
  "quotePeriod" TEXT,
  "quoteNotes" TEXT,
  "adminNotes" TEXT,
  "quoteSentAt" TIMESTAMP(3),
  "quoteEmailStatus" TEXT,
  "quoteEmailError" TEXT,
  "notificationStatus" TEXT,
  "notificationError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "StorageEnquiry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StorageEnquiry_reference_key" ON "StorageEnquiry"("reference");
CREATE UNIQUE INDEX "StorageEnquiry_idempotencyKey_key" ON "StorageEnquiry"("idempotencyKey");
CREATE INDEX "StorageEnquiry_status_createdAt_idx" ON "StorageEnquiry"("status", "createdAt");
CREATE INDEX "StorageEnquiry_createdAt_idx" ON "StorageEnquiry"("createdAt");
CREATE INDEX "StorageEnquiry_customerEmail_idx" ON "StorageEnquiry"("customerEmail");
CREATE INDEX "StorageEnquiry_collectionPostcode_idx" ON "StorageEnquiry"("collectionPostcode");

-- AlterTable: add assemblyType and assemblyQty to Booking
ALTER TABLE "Booking" ADD COLUMN "assemblyType" TEXT;
ALTER TABLE "Booking" ADD COLUMN "assemblyQty" INTEGER NOT NULL DEFAULT 1;

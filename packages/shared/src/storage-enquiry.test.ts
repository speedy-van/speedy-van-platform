import assert from "node:assert/strict";
import test from "node:test";
import { StorageEnquiryCreateSchema } from "./storage-enquiry";

const validPayload = {
  idempotencyKey: "storageenquirytestkey123",
  firstName: "Amina",
  lastName: "",
  email: "amina@example.com",
  phone: "07909032889",
  storageStart: { kind: "undecided" as const },
  storageDuration: "1_3_months",
  estimatedUnitSize: "small_room",
  needsCollectionTransport: true,
  collectionAddress: "10 High Street",
  collectionPostcode: "G1 1AA",
  collectionAccess: {
    propertyType: "flat",
    floor: 2,
    hasLift: false,
    carryDistanceMetres: 25,
    narrowAccess: true,
    permitOrRestrictedParking: false,
    accessNotes: "Shared close",
  },
  storageFacilityKnown: false,
  storageFacility: null,
  needsReturnTransport: false,
  returnDestinationKnown: false,
  returnAddress: null,
  returnPostcode: null,
  returnDate: null,
  itemDescription: "Boxes, two wardrobes, bed frame and a dining table.",
  needsPacking: false,
  needsDismantling: true,
  notes: null,
  source: { page: "/storage/enquiry" },
};

test("StorageEnquiryCreateSchema accepts a complete manual quote request", () => {
  const parsed = StorageEnquiryCreateSchema.safeParse(validPayload);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.email, "amina@example.com");
    assert.equal(parsed.data.collectionAccess.narrowAccess, true);
  }
});

test("StorageEnquiryCreateSchema requires a facility postcode when the facility is known", () => {
  const parsed = StorageEnquiryCreateSchema.safeParse({
    ...validPayload,
    storageFacilityKnown: true,
    storageFacility: { address: "Storage Depot", postcode: "" },
  });
  assert.equal(parsed.success, false);
});

test("StorageEnquiryCreateSchema requires a return postcode when the return destination is known", () => {
  const parsed = StorageEnquiryCreateSchema.safeParse({
    ...validPayload,
    needsReturnTransport: true,
    returnDestinationKnown: true,
    returnAddress: "20 New Street",
    returnPostcode: "",
  });
  assert.equal(parsed.success, false);
});

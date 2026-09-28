import assert from "node:assert/strict";
import { getBookingServiceIdentity, resolveBookingService } from "./booking-service-options";

function identityFor(slug: string, serviceName?: string): string {
  const service = resolveBookingService(slug);
  assert.ok(service, `${slug} should resolve to a booking service`);
  return getBookingServiceIdentity({
    ...service,
    serviceName: serviceName ?? service.serviceName,
  });
}

assert.equal(
  identityFor("storage", "Storage"),
  identityFor("storage-transport", "Storage Transport"),
  "storage and storage-transport should keep the same draft identity",
);

assert.notEqual(
  identityFor("storage"),
  identityFor("man-and-van"),
  "storage and man-and-van should remain distinct booking intents",
);

assert.notEqual(
  identityFor("office-removal"),
  identityFor("business-removals"),
  "office and business should remain distinct booking intents",
);

assert.equal(
  identityFor("office"),
  identityFor("office-removal"),
  "office aliases should share the office booking identity",
);


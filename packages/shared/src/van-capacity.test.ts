import assert from "node:assert/strict";
import { defaultVanTierForService } from "./van-capacity";

const expectedTiers = [
  ["office", "large"],
  ["office-removal", "large"],
  ["business", "large"],
  ["business-removals", "large"],
  ["storage", "medium"],
  ["storage-transport", "medium"],
  ["man-and-van", "small"],
] as const;

for (const [serviceSlug, expectedTier] of expectedTiers) {
  assert.equal(defaultVanTierForService(serviceSlug), expectedTier, `${serviceSlug} should default to ${expectedTier}`);
}


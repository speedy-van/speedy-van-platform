import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionStorageEnquiry, hasStorageQuote } from "./storage-enquiries";

test("storage enquiry lifecycle permits documented forward transitions", () => {
  assert.equal(canTransitionStorageEnquiry("new", "under_review"), true);
  assert.equal(canTransitionStorageEnquiry("under_review", "quoted"), true);
  assert.equal(canTransitionStorageEnquiry("quoted", "closed"), true);
});

test("storage enquiry lifecycle rejects unsupported transitions", () => {
  assert.equal(canTransitionStorageEnquiry("closed", "quoted"), false);
  assert.equal(canTransitionStorageEnquiry("new", "accepted"), false);
  assert.equal(canTransitionStorageEnquiry("unknown", "new"), false);
});

test("storage quote readiness requires a positive manual quote line", () => {
  assert.equal(hasStorageQuote({ quotedTransportPrice: null, quotedStoragePrice: null }), false);
  assert.equal(hasStorageQuote({ quotedTransportPrice: 0, quotedStoragePrice: 0 }), false);
  assert.equal(hasStorageQuote({ quotedTransportPrice: 95, quotedStoragePrice: null }), true);
  assert.equal(hasStorageQuote({ quotedTransportPrice: null, quotedStoragePrice: 120 }), true);
});

/** Run with node --test scripts/booking-regression.cjs; no browser, network or new dependency. */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const cache = new Map();

function sourceModule(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  });
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, loaded);
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (specifier) => {
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      const base = specifier.startsWith("@/")
        ? path.join(root, "apps/web/src", specifier.slice(2))
        : path.resolve(path.dirname(filename), specifier);
      const source = [base, `${base}.ts`, `${base}.tsx`].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (source && /\.tsx?$/.test(source)) return sourceModule(source);
    }
    return originalRequire(specifier);
  };
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}

const { bookingReducer, getReachableBookingStep, INITIAL_BOOKING_STATE, restoreBookingDraft, serialiseBookingDraft } = sourceModule(path.join(root, "apps/web/src/lib/booking-store.tsx"));
const { resolveBookingService } = sourceModule(path.join(root, "apps/web/src/lib/booking-service-options.ts"));
const { parsePricingResult } = sourceModule(path.join(root, "apps/web/src/components/booking/quote-response.ts"));
const { completeCardPayment, parseBookingPaymentSession, isVerifiedCheckoutRecovery } = sourceModule(path.join(root, "apps/web/src/components/booking/checkout-session.ts"));
const now = Date.parse("2026-09-21T12:00:00Z");
const address = { address: "Test address, Glasgow", postcode: "G1 1AA", lat: 55.86, lng: -4.25 };
const state = {
  ...INITIAL_BOOKING_STATE,
  serviceSlug: "house-removal", serviceName: "House Removals", entryServiceSlug: "house-removals",
  pickup: address, dropoff: { ...address, address: "Test address, Edinburgh", postcode: "EH1 1AA", lat: 55.95, lng: -3.18 },
  pickupPropertyType: "flat", pickupFloor: 0, distanceMiles: 46.2,
  items: [{ lineId: "bedroom-1-bed", itemId: "double-bed", name: "Double bed", quantity: 1, roomId: "bedroom-1", roomName: "Bedroom 1" }],
  inventoryMode: "rooms", bedroomCount: "2", exactBedroomCount: 5,
  inventoryRooms: [{ id: "bedroom-1", label: "Bedroom 1", kind: "bedroom", index: 1, skipped: false }],
  selectedDate: "2026-09-23", selectedTimeSlot: "morning", clientTotal: 120, quoteStatus: "valid", step: 5,
  clientSecret: "secret_test", bookingId: "booking_test", bookingRef: "reference_test",
  customerName: "Test Customer", customerEmail: "test@example.com", customerPhone: "07700900000",
};
const envelope = (changes = {}, savedAt = now - 1000) => JSON.stringify({ savedAt, state: { ...state, ...changes } });

test("direct entry begins at the service selector; unknown service links do not invent a service", () => {
  assert.equal(INITIAL_BOOKING_STATE.step, 1);
  assert.equal(resolveBookingService("not-a-service"), null);
  assert.equal(resolveBookingService(""), null);
  assert.equal(resolveBookingService("house").serviceSlug, "house-removal");
  assert.equal(resolveBookingService("house-removals").inventoryMode, "rooms");
  assert.equal(resolveBookingService("furniture").inventoryMode, "items");
  assert.equal(resolveBookingService("flat-removals").inventoryMode, "rooms");
});

test("corrupt, expired, future-dated and unknown-service drafts are rejected", () => {
  for (const raw of [null, "not JSON", "null", "[]", "{}", envelope({}, now - 86400001), envelope({}, now + 1), envelope({ serviceSlug: "unknown" })]) {
    assert.equal(restoreBookingDraft(raw, now), null);
  }
});

test("restoring payment preserves rooms, items, ground-floor choice and customer details but requires a fresh quote", () => {
  const restored = restoreBookingDraft(envelope(), now);
  assert.equal(restored.step, 4);
  assert.equal(restored.quoteStatus, "stale");
  assert.equal(restored.clientTotal, 0);
  assert.equal(restored.clientSecret, "");
  assert.equal(restored.bookingId, "");
  assert.equal(restored.bookingRef, "");
  assert.equal(restored.pickupFloor, 0);
  assert.equal(restored.bedroomCount, "2");
  assert.deepEqual(restored.items, state.items);
  assert.deepEqual(restored.inventoryRooms, state.inventoryRooms);
  assert.equal(restored.customerEmail, state.customerEmail);
  assert.equal(restored.selectedDate, state.selectedDate);
});

test("saved loading state and missing prerequisites cannot strand a customer at checkout", () => {
  assert.equal(restoreBookingDraft(envelope({ quoteStatus: "loading" }), now).step, 4);
  assert.equal(restoreBookingDraft(envelope({ pickup: null }), now).step, 2);
  assert.equal(restoreBookingDraft(envelope({ items: [] }), now).step, 3);
  assert.equal(restoreBookingDraft(envelope({ distanceMiles: 0 }), now).step, 2);
  assert.equal(restoreBookingDraft(envelope({ step: 99 }), now).step, 2);
  const restored = restoreBookingDraft(envelope({ selectedDate: "2026-02-31", items: [null, { name: "Box", quantity: -1 }] }), now);
  assert.equal(restored.selectedDate, "");
  assert.deepEqual(restored.items, []);
});

test("items, route, helpers and selected date invalidate the old quote and payment session", () => {
  for (const action of [
    { type: "SET_ITEMS", items: [...state.items, { name: "Box", quantity: 2 }] },
    { type: "SET_DISTANCE", value: 70 },
    { type: "SET_HELPERS", count: 1 },
    { type: "SET_DATE", date: "2026-09-24" },
    { type: "SET_BEDROOM_COUNT", bedroomCount: "3", exactBedroomCount: 5 },
  ]) {
    const next = bookingReducer(state, action);
    assert.notEqual(next.quoteStatus, "valid", action.type);
    assert.equal(next.clientTotal, 0, action.type);
    assert.equal(next.clientSecret, "", action.type);
    assert.equal(next.bookingId, "", action.type);
  }
});

test("property changes cannot retain hidden floor surcharges or infer a first-floor flat", () => {
  const flat = bookingReducer(INITIAL_BOOKING_STATE, { type: "SET_PICKUP_PROPERTY_TYPE", value: "flat" });
  assert.equal(flat.pickupFloor, 0);
  const house = bookingReducer({ ...state, pickupFloor: 3, pickupHasLift: true }, { type: "SET_PICKUP_PROPERTY_TYPE", value: "house" });
  assert.equal(house.pickupFloor, 0);
  assert.equal(house.pickupHasLift, false);
  const studio = bookingReducer({ ...state, pickupFloor: 2, pickupHasLift: true }, { type: "SET_PICKUP_PROPERTY_TYPE", value: "studio" });
  assert.equal(studio.pickupFloor, 2);
  assert.equal(studio.pickupHasLift, true);
});

test("step navigation cannot bypass missing inventory or stale prices; service edit remains reachable", () => {
  assert.equal(getReachableBookingStep(state, 5), 5);
  assert.equal(getReachableBookingStep({ ...state, items: [] }, 5), 3);
  assert.equal(getReachableBookingStep({ ...state, quoteStatus: "stale" }, 5), 4);
  assert.equal(getReachableBookingStep({ ...state, clientTotal: Infinity }, 5), 4);
  assert.equal(getReachableBookingStep(state, 1), 1);
});

test("unresolved checkout rejects Back/Edit, reset and stale quote responses without losing its intent", () => {
  const locked = bookingReducer(state, { type: "START_CHECKOUT" });
  for (const action of [
    { type: "SET_STEP", step: 4 }, { type: "SET_STEP", step: 1 },
    { type: "SET_PRICE", total: 0 }, { type: "SET_ITEMS", items: [] },
    { type: "SET_QUOTE_STATUS", status: "failed" }, { type: "SET_DATE", date: "2026-09-24" },
    { type: "SET_SERVICE", slug: "man-and-van", name: "Man and Van" }, { type: "RESET" },
    { type: "RESTORE", state: INITIAL_BOOKING_STATE },
  ]) {
    const next = bookingReducer(locked, action);
    assert.strictEqual(next, locked, action.type);
    assert.equal(next.clientSecret, state.clientSecret);
    assert.equal(next.bookingId, state.bookingId);
    assert.equal(next.step, 5);
  }
});

test("only a known pre-payment rejection unlocks editing; an established intent remains protected", () => {
  const started = bookingReducer({ ...state, clientSecret: "", bookingId: "", bookingRef: "" }, { type: "START_CHECKOUT" });
  assert.equal(bookingReducer(started, { type: "CHECKOUT_REJECTED" }).checkoutLocked, false);
  const established = bookingReducer(started, { type: "SET_BOOKING", bookingId: "booking_test", bookingRef: "reference_test", clientSecret: "secret_test", total: 120 });
  assert.equal(bookingReducer(established, { type: "CHECKOUT_REJECTED" }).checkoutLocked, true);
  assert.deepEqual(bookingReducer(established, { type: "CHECKOUT_COMPLETE" }), INITIAL_BOOKING_STATE);
});

test("refresh retains unresolved checkout reference and lock, never its payment secret or a fresh-pay path", () => {
  const locked = { ...state, checkoutLocked: true };
  const serialised = serialiseBookingDraft(locked, now - 1000);
  assert.equal(serialised.includes("secret_test"), false);
  const restored = restoreBookingDraft(serialised, now);
  assert.equal(restored.checkoutLocked, true);
  assert.equal(restored.step, 5);
  assert.equal(restored.bookingRef, locked.bookingRef);
  assert.equal(restored.bookingId, locked.bookingId);
  assert.equal(restored.clientSecret, "");
  assert.equal(restored.clientTotal, 0);
  assert.equal(restored.quoteStatus, "stale");
  assert.strictEqual(bookingReducer(restored, { type: "RESET" }), restored);
  const expired = restoreBookingDraft(serialiseBookingDraft(locked, now - 86400001), now);
  assert.equal(expired.checkoutLocked, true);
  assert.equal(expired.step, 5);
});

const pricing = {
  days: [{ date: "2026-09-23", slots: [{ slot: "morning", price: 120, tier: "yellow" }] }],
  staticLineItems: [{ label: "Base move", amount: 100, type: "base" }], staticSubtotal: 100, currency: "GBP", symbol: "£",
};

test("pricing accepts only real finite GBP slots and valid dates", () => {
  assert.deepEqual(parsePricingResult(pricing), pricing);
  for (const price of [NaN, Infinity, 0, -1, "120"]) {
    assert.equal(parsePricingResult({ ...pricing, days: [{ ...pricing.days[0], slots: [{ slot: "morning", price, tier: "yellow" }] }] }), null);
  }
  assert.equal(parsePricingResult({ ...pricing, currency: "USD" }), null);
  assert.equal(parsePricingResult({ ...pricing, days: [{ ...pricing.days[0], date: "2026-02-31" }] }), null);
  assert.equal(parsePricingResult({ ...pricing, days: [pricing.days[0], pricing.days[0]] }), null);
});

test("empty availability stays empty instead of becoming an infinite or fabricated price", () => {
  assert.deepEqual(parsePricingResult({ ...pricing, days: [] }).days, []);
  assert.deepEqual(parsePricingResult({ ...pricing, days: [{ date: "2026-09-23", slots: [] }] }).days, []);
});

const session = { bookingId: "booking_test", bookingRef: "reference_test", clientSecret: "secret_test", totalPrice: 120 };
const details = { name: "Test Customer", email: "test@example.com" };
const card = {};

test("checkout rejects missing payment configuration, secret and server price", () => {
  assert.deepEqual(parseBookingPaymentSession(session), session);
  for (const change of [{ clientSecret: null }, { clientSecret: "" }, { totalPrice: undefined }, { totalPrice: Infinity }, { totalPrice: 0 }, { bookingRef: "" }]) {
    assert.equal(parseBookingPaymentSession({ ...session, ...change }), null);
  }
});

test("restored checkout is released only for the matching server-verified paid booking", () => {
  for (const status of ["CONFIRMED", "ASSIGNED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED"]) {
    assert.equal(isVerifiedCheckoutRecovery({ reference: session.bookingRef, bookingId: session.bookingId, status, isPaid: true }, session.bookingRef, session.bookingId), true);
  }
  for (const change of [
    { isPaid: false }, { isPaid: undefined }, { isPaid: "true" },
    { status: "PENDING" }, { status: "CANCELLED" }, { status: "UNKNOWN" },
    { reference: "another-reference" }, { bookingId: "another-booking" },
  ]) {
    assert.equal(isVerifiedCheckoutRecovery({ reference: session.bookingRef, bookingId: session.bookingId, status: "CONFIRMED", isPaid: true, ...change }, session.bookingRef, session.bookingId), false);
  }
  assert.equal(isVerifiedCheckoutRecovery(null, session.bookingRef, session.bookingId), false);
  assert.equal(isVerifiedCheckoutRecovery({ isPaid: true, status: "CONFIRMED" }, "", ""), false);
});

test("payment succeeds only after Stripe success and the server confirmation", async () => {
  const order = [];
  const stripe = {
    retrievePaymentIntent: async () => { order.push("retrieve"); return { paymentIntent: { id: "pi_test", status: "requires_payment_method" } }; },
    confirmCardPayment: async () => { order.push("card"); return { paymentIntent: { id: "pi_test", status: "succeeded" } }; },
  };
  await completeCardPayment(session, stripe, card, details, async (bookingId, intentId) => {
    assert.equal(bookingId, session.bookingId);
    assert.equal(intentId, "pi_test");
    order.push("server");
  });
  assert.deepEqual(order, ["retrieve", "card", "server"]);
});

test("confirmation retry reuses a paid intent without making another card payment", async () => {
  let cards = 0;
  let confirms = 0;
  const stripe = {
    retrievePaymentIntent: async () => ({ paymentIntent: { id: "pi_test", status: "succeeded" } }),
    confirmCardPayment: async () => { cards += 1; throw new Error("must not charge again"); },
  };
  await completeCardPayment(session, stripe, card, details, async () => { confirms += 1; });
  assert.equal(cards, 0);
  assert.equal(confirms, 1);
});

test("a declined or incomplete card payment never reaches server confirmation", async () => {
  for (const result of [{ error: { message: "Card declined" } }, { paymentIntent: { id: "pi_test", status: "processing" } }]) {
    let confirms = 0;
    const stripe = {
      retrievePaymentIntent: async () => ({ paymentIntent: { id: "pi_test", status: "requires_payment_method" } }),
      confirmCardPayment: async () => result,
    };
    await assert.rejects(() => completeCardPayment(session, stripe, card, details, async () => { confirms += 1; }));
    assert.equal(confirms, 0);
  }
});

test("processing or cancelled intents never trigger a new charge", async () => {
  for (const status of ["processing", "canceled"]) {
    let calls = 0;
    const stripe = {
      retrievePaymentIntent: async () => ({ paymentIntent: { id: "pi_test", status } }),
      confirmCardPayment: async () => { calls += 1; },
    };
    await assert.rejects(() => completeCardPayment(session, stripe, card, details, async () => { calls += 1; }));
    assert.equal(calls, 0);
  }
});

test("failed server confirmation rejects completion even when Stripe succeeded", async () => {
  const stripe = { retrievePaymentIntent: async () => ({ paymentIntent: { id: "pi_test", status: "succeeded" } }) };
  await assert.rejects(() => completeCardPayment(session, stripe, card, details, async () => { throw new Error("BOOKING_CANCELLED"); }), /BOOKING_CANCELLED/);
});

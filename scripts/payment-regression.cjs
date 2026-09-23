/* Offline runtime regressions. All database, email and payment operations are mocked. */
const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");
const apiRequire = createRequire(path.resolve(__dirname, "../apps/api/package.json"));
const Stripe = apiRequire("stripe");
const { Hono } = apiRequire("hono");

const root = path.resolve(__dirname, "..");
const quietConsole = { ...console, error() {}, warn() {} };
function loadTs(relative, overrides = {}, cache = new Map()) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const requireFromFile = createRequire(filename);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, console: quietConsole, Date, Error, Intl, Map, Set, Buffer, Response,
    process: { env: { STRIPE_WEBHOOK_SECRET: "whsec_regression_fixture", NODE_ENV: "production" } },
    require(specifier) {
      if (Object.hasOwn(overrides, specifier)) return overrides[specifier];
      if (specifier.startsWith(".")) {
        const candidate = path.resolve(path.dirname(filename), specifier);
        if (existsSync(`${candidate}.ts`)) return loadTs(`${candidate}.ts`, overrides, cache);
      }
      return requireFromFile(specifier);
    },
  }, { filename });
  return module.exports;
}
const shared = loadTs("packages/shared/src/index.ts");
const validation = loadTs("apps/api/src/lib/payment-validation.ts", { "@speedy-van/shared": shared });
const fixtureBooking = () => ({
  id: "booking_1", reference: "TEST-BOOKING-1", userId: "customer_1", status: "PENDING",
  stripePaymentId: "pi_fixture", totalPrice: 123.45, price: 123.45, isPaid: false,
  paidAt: null, refundAmount: 0, customerName: "Test Customer", customerEmail: "customer@example.invalid",
  serviceName: "Test move", scheduledAt: new Date(Date.now() + 72 * 3600000),
});
const fixtureIntent = () => ({
  id: "pi_fixture", status: "succeeded", currency: "gbp", amount: 12345, amount_received: 12345,
  metadata: { bookingId: "booking_1", reference: "TEST-BOOKING-1" },
});
let state, intent, configured, notificationFailure, refundStatus, refundFailure, refundCreates, refundRequests;
let confirmationEmails, cancellationEmails, queue = Promise.resolve(), claimRace, currentRefunds, liveEvents;
function reset() {
  state = { booking: fixtureBooking(), tracking: [], history: [], notifications: [], jobs: [], conversations: [], participants: [] };
  intent = fixtureIntent(); configured = true; notificationFailure = false; refundStatus = "succeeded";
  refundFailure = false; refundCreates = 0; refundRequests = []; confirmationEmails = 0; cancellationEmails = 0; claimRace = null; currentRefunds = []; liveEvents = [];
}
const copy = (value) => structuredClone(value);
const db = {
  booking: {
    async findUnique({ where, include }) {
      if (!state.booking || !Object.entries(where).every(([key, value]) => state.booking[key] === value)) return null;
      const booking = copy(state.booking);
      if (include?.trackingEvents) booking.trackingEvents = copy(state.tracking.filter((event) => !event.isInternal));
      return booking;
    },
    async findFirst({ where }) { return state.booking?.stripePaymentId === where.stripePaymentId ? copy(state.booking) : null; },
    async updateMany({ where, data }) {
      if (claimRace) { const race = claimRace; claimRace = null; race(); }
      if (!state.booking || !Object.entries(where).every(([key, value]) => state.booking[key] === value)) return { count: 0 };
      Object.assign(state.booking, data); return { count: 1 };
    },
    async update({ data }) { Object.assign(state.booking, data); return copy(state.booking); },
  },
  trackingEvent: { async create({ data }) { const event = { id: `event_${state.tracking.length}`, createdAt: new Date(), lat: null, lng: null, isInternal: false, ...data }; state.tracking.push(event); return copy(event); } },
  statusHistory: { async create({ data }) { state.history.push(data); return data; } },
  user: { async findMany() { return [{ id: "admin_1" }]; } },
  conversation: { async upsert({ create }) { const conversation = { id: "conversation_1", ...create }; state.conversations.push(conversation); return conversation; } },
  conversationParticipant: { async createMany({ data }) { state.participants.push(...data); return { count: data.length }; } },
  pricingConfig: { async findUnique() { return null; } },
  driverJob: {
    async upsert({ create }) { state.jobs.push(create); return create; },
    async updateMany({ data }) { state.jobs = state.jobs.map((job) => ({ ...job, ...data })); return { count: state.jobs.length }; },
  },
  notification: { async createMany({ data }) { if (notificationFailure) throw new Error("Simulated database outage"); state.notifications.push(...data); return { count: data.length }; } },
  $transaction(callback) {
    const operation = queue.then(async () => {
      const before = copy(state);
      try { return await callback(db); } catch (error) { state = before; throw error; }
    });
    queue = operation.catch(() => {});
    return operation;
  },
};
const signatureClient = new Stripe("sk_test_regression_fixture");
const paymentClient = {
  paymentIntents: { async retrieve() { return copy(intent); } },
  refunds: {
    async *list() { for (const refund of currentRefunds) yield refund; },
    async create(params, options) {
      refundCreates += 1; refundRequests.push({ params, options });
      if (refundFailure) throw new Error("Simulated Stripe outage");
      return { id: "re_fixture", amount: params.amount, currency: "gbp", status: refundStatus };
    },
    async retrieve() { return { id: "re_fixture", amount: refundRequests.at(-1).params.amount, currency: "gbp", status: refundStatus }; },
  },
  webhooks: signatureClient.webhooks,
};
const stripeModule = {
  get stripe() { return configured ? paymentClient : null; },
  requireStripe() { if (!configured) throw new Error("STRIPE_NOT_CONFIGURED"); return paymentClient; },
};
const common = {
  "@speedy-van/db": { db }, "@speedy-van/shared": shared,
  "../lib/stripe": stripeModule, "../lib/payment-validation": validation,
};
const bookingService = loadTs("apps/api/src/services/booking.service.ts", {
  ...common, "../lib/pusher": { triggerEvent(channel, event, payload) { liveEvents.push({ channel, event, payload }); } },
  "./pricing.service": { async calculatePriceForSlot() { return 123.45; } },
  "./email.service": {
    async sendBookingConfirmation() { confirmationEmails += 1; },
    async sendBookingCancelled() { cancellationEmails += 1; },
  },
});
const bookingRoutes = loadTs("apps/api/src/routes/booking.ts", {
  ...common, "../services/booking.service": bookingService,
  "../middleware/auth": { requireAuth: async (_c, next) => next() },
}).default;
bookingRoutes.onError(loadTs("apps/api/src/middleware/error.ts", common).errorHandler);
const webhook = loadTs("apps/api/src/routes/stripe.ts", {
  ...common, "../services/booking.service": bookingService,
}).default;
function postConfirmation() {
  return bookingRoutes.request("http://localhost/confirm", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ bookingId: "booking_1", stripePaymentIntentId: "pi_fixture" }),
  });
}
function postWebhook(type = "payment_intent.succeeded", signature = true, object = intent) {
  const payload = JSON.stringify({ id: "evt_fixture", type, data: { object } });
  const header = signatureClient.webhooks.generateTestHeaderString({ payload, secret: "whsec_regression_fixture" });
  return webhook.request("http://localhost/webhook", {
    method: "POST", headers: { "content-type": "application/json", "stripe-signature": signature ? header : "invalid" }, body: payload,
  });
}

(async () => {
  await test("payment requires configured Stripe before any create or confirm writes", async () => {
    reset(); configured = false;
    await assert.rejects(() => bookingService.createBooking({}), /STRIPE_NOT_CONFIGURED/);
    const response = await postConfirmation();
    assert.equal(response.status, 503); assert.equal(state.booking.isPaid, false); assert.equal(state.tracking.length, 0);
  });
  for (const [label, patch] of [
    ["wrong intent ID", { id: "pi_someone_else" }],
    ["wrong booking metadata", { metadata: { bookingId: "another_booking", reference: "TEST-BOOKING-1" } }],
    ["missing metadata", { metadata: {} }],
    ["wrong reference", { metadata: { bookingId: "booking_1", reference: "OTHER" } }],
    ["wrong currency", { currency: "usd" }],
    ["underpayment", { amount: 100, amount_received: 100 }],
    ["overpayment", { amount: 15000, amount_received: 15000 }],
    ["incomplete capture", { amount_received: 12344 }],
  ]) {
    await test(`confirmation rejects ${label} without writes`, async () => {
      reset(); Object.assign(intent, patch);
      const response = await postConfirmation();
      assert.equal(response.status, 400); assert.equal((await response.json()).code, "PAYMENT_MISMATCH");
      assert.equal(state.booking.isPaid, false); assert.equal(state.tracking.length, 0); assert.equal(confirmationEmails, 0);
    });
  }
  await test("a pending payment cannot confirm a booking", async () => {
    reset(); intent.status = "processing";
    const response = await postConfirmation();
    assert.equal(response.status, 400); assert.equal((await response.json()).code, "PAYMENT_NOT_SUCCEEDED");
  });
  await test("missing stored intent and non-finite or zero total are rejected", async () => {
    for (const patch of [{ stripePaymentId: null }, { totalPrice: NaN }, { totalPrice: 0 }]) {
      reset(); Object.assign(state.booking, patch);
      assert.equal((await postConfirmation()).status, 400); assert.equal(state.booking.isPaid, false);
    }
  });
  await test("browser and signed webhook confirmations run durable first-payment effects once", async () => {
    reset();
    const responses = await Promise.all([postConfirmation(), postWebhook(), postConfirmation()]);
    assert.deepEqual(responses.map((response) => response.status), [200, 200, 200]);
    assert.equal(state.booking.status, "CONFIRMED"); assert.equal(state.booking.isPaid, true);
    assert.equal(state.tracking.length, 1); assert.equal(state.history.length, 1); assert.equal(state.jobs.length, 1);
    assert.equal(state.notifications.length, 1); assert.equal(state.conversations.length, 1); assert.equal(confirmationEmails, 1);
    const paidAt = state.booking.paidAt.toISOString();
    await postWebhook(); assert.equal(state.booking.paidAt.toISOString(), paidAt); assert.equal(confirmationEmails, 1);
  });
  for (const status of ["ASSIGNED", "IN_PROGRESS", "COMPLETED"]) {
    await test(`late verified payment preserves ${status}`, async () => {
      reset(); state.booking.status = status;
      assert.equal((await postWebhook()).status, 200);
      assert.equal(state.booking.status, status); assert.equal(state.booking.isPaid, true); assert.equal(state.jobs.length, 0);
      assert.equal((await postConfirmation()).status, 200); assert.equal(state.booking.status, status);
    });
  }
  await test("cancelled booking receives one internal payment alert and never reopens", async () => {
    reset(); state.booking.status = "CANCELLED";
    assert.equal((await postWebhook()).status, 200);
    const response = await postConfirmation();
    assert.equal(response.status, 409); assert.equal((await response.json()).code, "BOOKING_CANCELLED");
    assert.equal(state.booking.status, "CANCELLED"); assert.equal(state.booking.isPaid, true);
    assert.equal(state.notifications.length, 1); assert.equal(state.notifications[0].type, "GENERIC");
    assert.equal(state.tracking[0].isInternal, true); assert.equal(state.jobs.length, 0); assert.equal(confirmationEmails, 0);
  });
  await test("database failure rolls back payment effects and causes a retryable webhook response", async () => {
    reset(); notificationFailure = true;
    assert.equal((await postWebhook()).status, 500);
    assert.equal(state.booking.isPaid, false); assert.equal(state.jobs.length, 0); assert.equal(state.tracking.length, 0);
    notificationFailure = false;
    assert.equal((await postWebhook()).status, 200); assert.equal(state.jobs.length, 1); assert.equal(confirmationEmails, 1);
  });
  await test("conditional-update race cannot regress an already paid booking", async () => {
    reset(); claimRace = () => { state.booking.isPaid = true; state.booking.status = "ASSIGNED"; };
    assert.equal((await postConfirmation()).status, 200);
    assert.equal(state.booking.status, "ASSIGNED"); assert.equal(confirmationEmails, 0);
  });
  await test("failed card attempts cannot cancel pending, paid or cancelled bookings", async () => {
    for (const status of ["PENDING", "ASSIGNED", "CANCELLED"]) {
      reset(); state.booking.status = status; state.booking.isPaid = status === "ASSIGNED";
      assert.equal((await postWebhook("payment_intent.payment_failed")).status, 200);
      assert.equal(state.booking.status, status); assert.equal(state.tracking.length, 0);
    }
  });
  await test("invalid webhook signatures cannot write payment state", async () => {
    reset(); assert.equal((await postWebhook("payment_intent.succeeded", false)).status, 400);
    assert.equal(state.booking.isPaid, false);
  });
  await test("failed refunds cannot claim cancellation or send a refund promise", async () => {
    reset(); state.booking.isPaid = true; state.booking.status = "CONFIRMED"; refundFailure = true;
    await assert.rejects(() => bookingService.cancelBooking("booking_1", {}), /Simulated Stripe outage/);
    assert.equal(state.booking.status, "CONFIRMED"); assert.equal(state.booking.refundAmount, 0); assert.equal(cancellationEmails, 0);
  });
  await test("pending refunds remain unconfirmed and require support review", async () => {
    reset(); state.booking.isPaid = true; state.booking.status = "CONFIRMED"; refundStatus = "pending";
    await assert.rejects(() => bookingService.cancelBooking("booking_1", {}), (error) => error.code === "REFUND_NOT_COMPLETED");
    assert.equal(state.booking.status, "CONFIRMED"); assert.equal(state.booking.refundAmount, 0); assert.equal(cancellationEmails, 0);
  });
  await test("successful cancellation refunds only the outstanding amount and deduplicates repeat calls", async () => {
    reset(); state.booking.isPaid = true; state.booking.status = "CONFIRMED"; state.booking.refundAmount = 10;
    state.jobs.push({ bookingId: "booking_1", status: "AVAILABLE", isPublic: true });
    const result = await bookingService.cancelBooking("booking_1", { reason: "Customer request" });
    assert.equal(result.refundAmount, 123.45); assert.equal(state.booking.status, "CANCELLED");
    assert.equal(refundRequests[0].params.amount, 11345); assert.equal(refundRequests[0].options.idempotencyKey, "booking-cancellation-booking_1");
    assert.equal(state.jobs[0].isPublic, false); assert.equal(cancellationEmails, 1);
    await bookingService.cancelBooking("booking_1", {}); assert.equal(refundCreates, 1); assert.equal(cancellationEmails, 1);
    assert.equal(liveEvents.length, 1); assert.ok(liveEvents[0].payload.createdAt instanceof Date);
    assert.equal(liveEvents[0].payload.lat, null); assert.equal(liveEvents[0].payload.lng, null);
  });
  await test("unpaid cancellation requires no Stripe refund", async () => {
    reset(); configured = false;
    await bookingService.cancelBooking("booking_1", {});
    assert.equal(state.booking.status, "CANCELLED"); assert.equal(refundCreates, 0); assert.equal(state.booking.refundAmount, 0);
  });
  await test("stale refund events reconcile the current succeeded amounts and exclude pending or failed refunds", async () => {
    reset(); state.booking.refundAmount = 10;
    currentRefunds = [
      { amount: 2000, currency: "gbp", status: "succeeded" },
      { amount: 1500, currency: "gbp", status: "succeeded" },
      { amount: 1000, currency: "gbp", status: "pending" },
      { amount: 1000, currency: "gbp", status: "failed" },
    ];
    assert.equal((await postWebhook("charge.refunded", true, { payment_intent: "pi_fixture", amount_refunded: 1000 })).status, 200);
    assert.equal(state.booking.refundAmount, 35);
    currentRefunds[1].status = "failed";
    assert.equal((await postWebhook("refund.failed", true, { payment_intent: "pi_fixture" })).status, 200);
    assert.equal(state.booking.refundAmount, 20);
  });
  await test("refund reconciliation cannot overwrite a concurrent cancellation refund", async () => {
    reset(); currentRefunds = [{ amount: 1000, currency: "gbp", status: "succeeded" }];
    claimRace = () => { state.booking.refundAmount = 123.45; };
    assert.equal((await postWebhook("charge.refunded", true, { payment_intent: "pi_fixture" })).status, 500);
    assert.equal(state.booking.refundAmount, 123.45);
  });
  await test("customers cannot cancel assigned, started or completed moves online", async () => {
    for (const status of ["ASSIGNED", "IN_PROGRESS", "COMPLETED"]) {
      reset(); state.booking.status = status; state.booking.isPaid = true;
      await assert.rejects(() => bookingService.cancelBooking("booking_1", { actorRole: "CUSTOMER" }), (error) => error.code === "BOOKING_CANCELLATION_NOT_ALLOWED");
      assert.equal(state.booking.status, status); assert.equal(refundCreates, 0);
    }
  });
  await test("the shared error handler preserves actionable errors for admin and mobile callers", async () => {
    const app = new Hono();
    app.onError(loadTs("apps/api/src/middleware/error.ts", common).errorHandler);
    app.post("/admin/bookings/fixture/cancel", () => {
      throw new validation.PaymentValidationError("REFUND_NOT_COMPLETED", "Please contact support.", 409);
    });
    const response = await app.request("http://localhost/admin/bookings/fixture/cancel", { method: "POST" });
    assert.equal(response.status, 409); assert.equal((await response.json()).code, "REFUND_NOT_COMPLETED");
  });
  await test("tracking recovery exposes actual paid state only after matching reference and email", async () => {
    reset(); state.booking.status = "CONFIRMED";
    const url = "http://localhost/track/TEST-BOOKING-1?email=customer%40example.invalid";
    let response = await bookingRoutes.request(url);
    assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "private, no-store");
    let data = (await response.json()).data;
    assert.equal(data.reference, "TEST-BOOKING-1"); assert.equal(data.bookingId, "booking_1");
    assert.equal(data.isPaid, false); assert.equal(Object.hasOwn(data, "stripePaymentId"), false);
    state.booking.isPaid = true;
    response = await bookingRoutes.request(url); data = (await response.json()).data;
    assert.equal(data.isPaid, true); assert.equal(Object.hasOwn(data, "clientSecret"), false);
    for (const denied of [
      "http://localhost/track/TEST-BOOKING-1?email=other%40example.invalid",
      "http://localhost/track/OTHER-REFERENCE?email=customer%40example.invalid",
    ]) {
      response = await bookingRoutes.request(denied);
      assert.equal(response.status, 404); assert.equal((await response.json()).data, undefined);
    }
  });
})().catch((error) => { console.error(error); process.exitCode = 1; });

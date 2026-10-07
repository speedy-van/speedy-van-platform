/** Exercise the real checkout components with deferred, offline payment responses. */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const componentDir = "apps/web/src/components/booking/";
const jsx = (type, props) => ({ type, props });

function loadSource(file, imports, globals = {}) {
  const filename = path.join(root, file);
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
    reportDiagnostics: true,
  });
  assert.deepEqual(result.diagnostics.filter((entry) => entry.category === ts.DiagnosticCategory.Error), []);
  const module = { exports: {} };
  vm.runInNewContext(result.outputText, {
    module, exports: module.exports, Error, URL, console,
    require(specifier) {
      if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (Object.hasOwn(imports, specifier)) return imports[specifier];
      throw new Error(`Unexpected test import: ${specifier}`);
    },
    ...globals,
  }, { filename });
  return module.exports;
}

function findNodes(node, match) {
  if (Array.isArray(node)) return node.flatMap((child) => findNodes(child, match));
  if (!node || typeof node !== "object") return [];
  return [...(match(node) ? [node] : []), ...findNodes(node.props?.children, match)];
}

/** Minimal hook/effect lifecycle, including cleanup when the parent removes its form. */
function hooks() {
  let active;
  const host = {
    dirty: true,
    instance: () => ({ slots: [], cursor: 0, effects: [] }),
    render(instance, component, props = {}) {
      active = instance;
      instance.cursor = 0;
      return component(props);
    },
    commit(instance) {
      for (const effect of instance.effects.splice(0)) effect();
    },
    unmount(instance) {
      for (const slot of instance.slots) slot.cleanup?.();
    },
  };
  const nextSlot = (create) => {
    const index = active.cursor++;
    return active.slots[index] ??= create();
  };
  host.react = {
    useRef: (value) => nextSlot(() => ({ current: value })),
    useState(initial) {
      const slot = nextSlot(() => ({ value: typeof initial === "function" ? initial() : initial }));
      slot.set ??= (next) => {
        const value = typeof next === "function" ? next(slot.value) : next;
        if (!Object.is(value, slot.value)) { slot.value = value; host.dirty = true; }
      };
      return [slot.value, slot.set];
    },
    useEffect(effect, dependencies) {
      const slot = nextSlot(() => ({}));
      if (!slot.dependencies || dependencies.some((value, index) => !Object.is(value, slot.dependencies[index]))) {
        slot.dependencies = dependencies;
        active.effects.push(() => { slot.cleanup?.(); slot.cleanup = effect(); });
      }
    },
  };
  return host;
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const session = { bookingId: "booking_test", bookingRef: "reference_test", clientSecret: "pi_test_secret_offline", totalPrice: 146.78 };
const response = (body, ok = true) => ({ ok, json: async () => body });
const nextTurn = () => new Promise((resolve) => setImmediate(resolve));

function checkoutHarness(overrides = {}, options = {}) {
  const host = hooks();
  const parent = host.instance();
  let formInstance = null;
  let parentTree, formTree;
  let closed = false;
  let intentStatus = options.intentStatus ?? "requires_payment_method";
  let confirmFailures = options.confirmFailures ?? 0;
  let cardFailures = options.cardFailures ?? 0;
  const create = deferred();
  const requests = [], payments = [], confirmations = [], purchases = [], navigations = [], retrieved = [];
  const storage = new Map();
  const context = {
    state: {
      checkoutLocked: false, bookingId: "", bookingRef: "reference_test", clientSecret: "",
      step: 5, serviceSlug: "house-removal", serviceName: "House removals", entryServiceSlug: "house-removals",
      pickup: { address: "Test pickup", postcode: "G1 1AA", lat: 55.86, lng: -4.25 },
      dropoff: { address: "Test drop-off", postcode: "EH1 1AA", lat: 55.95, lng: -3.18 },
      pickupFloor: 1, pickupHasLift: false, dropoffFloor: 2, dropoffHasLift: true,
      distanceMiles: 46, items: [{ itemId: "sofa", name: "Sofa", quantity: 1 }],
      selectedDate: "2026-10-20", selectedTimeSlot: "morning", clientTotal: 146.78, quoteStatus: "valid", quoteToken: "offline_quote",
      customerName: "Test Customer", customerEmail: "test@example.com", customerPhone: "07700900000",
      helpersCount: 1, needsPacking: true, needsAssembly: false, priceBreakdown: [], ...overrides,
    },
    dispatch(action) {
      const state = context.state;
      if (action.type === "START_CHECKOUT") context.state = { ...state, checkoutLocked: true };
      if (action.type === "SET_BOOKING") context.state = { ...state, checkoutLocked: true, bookingId: action.bookingId, bookingRef: action.bookingRef, clientSecret: action.clientSecret, clientTotal: action.total };
      if (action.type === "SET_CUSTOMER") context.state = { ...state, customerName: action.name, customerEmail: action.email, customerPhone: action.phone };
      if (action.type === "CHECKOUT_REJECTED" && !state.bookingId && !state.clientSecret) context.state = { ...state, checkoutLocked: false };
      if (action.type === "SET_QUOTE_STATUS") context.state = { ...state, quoteStatus: action.status };
      if (action.type === "ABANDON_CHECKOUT" || action.type === "CHECKOUT_COMPLETE") context.state = { ...state, checkoutLocked: false, bookingId: "", clientSecret: "" };
      host.dirty = true;
    },
  };
  const stripe = {
    async retrievePaymentIntent(secret) {
      retrieved.push(secret);
      return { paymentIntent: { id: "pi_test", status: intentStatus } };
    },
    async confirmCardPayment(secret) {
      payments.push(secret);
      if (cardFailures-- > 0) return { error: { message: "Your card was declined." } };
      intentStatus = "succeeded";
      return { paymentIntent: { id: "pi_test", status: intentStatus } };
    },
  };
  const card = {};
  const elements = { getElement: () => card };
  const paymentHelpers = loadSource(`${componentDir}checkout-session.ts`, {});
  const { Step4Payment } = loadSource(`${componentDir}Step4Payment.tsx`, {
    react: host.react,
    "@/lib/api-base": { getApiBaseUrl: () => "/api" },
    "next/image": () => null,
    "@stripe/stripe-js/pure": { loadStripe: async () => options.sdkUnavailable ? null : stripe },
    "@stripe/react-stripe-js": { Elements: function Elements() {}, CardElement: function CardElement() {}, useStripe: () => options.sdkUnavailable ? null : stripe, useElements: () => elements },
    "@/lib/booking-store": { useBooking: () => context, BOOKING_SERVER_DRAFT_SESSION_KEY: "offline-session", serialiseBookingDraft: (state) => JSON.stringify({ ...state, clientSecret: "" }) },
    "@/lib/booking-steps": { STEP_PRIMARY_CTA_ID: "primary" },
    "next/navigation": { useRouter: () => ({ push: (url) => { navigations.push(url); closed = true; } }) },
    "@/lib/analytics": { trackPurchase: (...args) => purchases.push(args) },
    "./PriceExplainerLink": { PriceExplainerLink: () => null },
    "./CheckoutRecovery": { CheckoutRecovery: function CheckoutRecovery() {} },
    "./checkout-session": paymentHelpers,
  }, {
    process: { env: { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_offline" } },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    fetch: async (url, init) => {
      const body = JSON.parse(init.body);
      if (url === "/api/booking/create") { requests.push(body); return create.promise; }
      if (url === "/api/booking/confirm") {
        confirmations.push(body);
        return confirmFailures-- > 0 ? response({ success: false }, false) : response({ success: true });
      }
      throw new Error(`Unexpected network request: ${url}`);
    },
  });
  function flush() {
    if (closed) return;
    let passes = 0;
    do {
      assert.ok(++passes < 30, "Render must settle without a state-update loop");
      host.dirty = false;
      parentTree = host.render(parent, Step4Payment);
      const form = findNodes(parentTree, (node) => node.type?.name === "CheckoutForm")[0];
      if (form) {
        formInstance ??= host.instance();
        formTree = host.render(formInstance, form.type, form.props);
      } else {
        if (formInstance) host.unmount(formInstance);
        formInstance = null;
        formTree = null;
      }
      host.commit(parent);
      if (formInstance) host.commit(formInstance);
    } while (host.dirty);
  }
  const harness = {
    context, create, requests, payments, confirmations, purchases, navigations, retrieved,
    flush,
    get hasForm() { return Boolean(formTree); },
    get hasRecovery() { return findNodes(parentTree, (node) => node.type?.name === "CheckoutRecovery").length === 1; },
    get busy() { return formTree?.props["aria-busy"]; },
    get alert() { return findNodes(formTree, (node) => node.props?.role === "alert")[0]?.props.children ?? ""; },
    async ready() { await nextTurn(); flush(); },
    submit() {
      assert.ok(formTree, "Checkout form must be mounted");
      const pending = formTree.props.onSubmit({ preventDefault() {} });
      flush();
      return pending;
    },
    async finish(pending, body = { success: true, data: session }, ok = true) {
      create.resolve(response(body, ok));
      await pending;
      await nextTurn();
      flush();
    },
    unmount() { if (formInstance) host.unmount(formInstance); host.unmount(parent); closed = true; },
  };
  flush();
  return harness;
}

test("live checkout keeps its form mounted while creation is pending, then confirms once", async () => {
  const h = checkoutHarness(); await h.ready();
  const pending = h.submit();
  const retained = h.hasForm;
  const busy = h.busy;
  assert.equal(h.context.state.checkoutLocked, true);
  await h.finish(pending);
  assert.equal(retained, true, "START_CHECKOUT must not unmount the active payment form");
  assert.equal(busy, true);
  assert.equal(h.requests.length, 1);
  assert.deepEqual(h.payments, [session.clientSecret]);
  assert.equal(h.confirmations.length, 1);
  assert.equal(h.purchases.length, 1);
  assert.equal(h.navigations.length, 1);
  assert.equal(h.requests[0].pickupFloor, 1);
  assert.equal(h.requests[0].dropoffFloor, 2);
  assert.equal(h.requests[0].needsPacking, true);
});

test("rapid double submit does not create or charge twice", async () => {
  const h = checkoutHarness(); await h.ready();
  const pending = h.submit();
  if (h.hasForm) await h.submit();
  await h.finish(pending);
  assert.equal(h.requests.length, 1);
  assert.equal(h.payments.length, 1);
});

test("uncertain network result enters recovery only after the active request settles", async () => {
  const h = checkoutHarness(); await h.ready();
  const pending = h.submit();
  const retained = h.hasForm;
  h.create.reject(new Error("Offline"));
  await pending; h.flush();
  assert.equal(retained, true);
  assert.equal(h.hasRecovery, true);
  assert.equal(h.hasForm, false);
  assert.equal(h.context.state.checkoutLocked, true);
  assert.equal(h.payments.length, 0);
});

test("invalid successful create response stays locked and never confirms a payment", async () => {
  const h = checkoutHarness(); await h.ready();
  await h.finish(h.submit(), { success: true, data: { bookingId: "incomplete" } });
  assert.equal(h.hasRecovery, true);
  assert.equal(h.context.state.checkoutLocked, true);
  assert.equal(h.payments.length, 0);
});

for (const code of ["PRICE_CHANGED", "QUOTE_EXPIRED"]) {
  test(`${code} releases only the rejected create and requires a fresh quote`, async () => {
    const h = checkoutHarness(); await h.ready();
    await h.finish(h.submit(), { success: false, code }, false);
    assert.equal(h.hasForm, true);
    assert.equal(h.context.state.checkoutLocked, false);
    assert.equal(h.context.state.quoteStatus, "stale");
    assert.equal(h.payments.length, 0);
    assert.match(h.alert, /quote/i);
  });
}

test("card decline retries the existing session without creating another booking", async () => {
  const h = checkoutHarness({}, { cardFailures: 1 }); await h.ready();
  await h.finish(h.submit());
  assert.equal(h.hasForm, true);
  assert.match(h.alert, /declined/);
  assert.equal(h.context.state.clientSecret, session.clientSecret);
  await h.submit();
  assert.equal(h.requests.length, 1);
  assert.deepEqual(h.payments, [session.clientSecret, session.clientSecret]);
  assert.equal(h.confirmations.length, 1);
});

test("successful Stripe payment with a failed booking confirmation retries confirmation only", async () => {
  const h = checkoutHarness({}, { confirmFailures: 1 }); await h.ready();
  await h.finish(h.submit());
  assert.equal(h.hasForm, true);
  await h.submit();
  assert.equal(h.requests.length, 1);
  assert.equal(h.payments.length, 1);
  assert.equal(h.confirmations.length, 2);
  assert.equal(h.purchases.length, 1);
});

for (const intentStatus of ["processing", "canceled"]) {
  test(`${intentStatus} intent is not charged or marked confirmed`, async () => {
    const h = checkoutHarness({}, { intentStatus }); await h.ready();
    await h.finish(h.submit());
    assert.equal(h.hasForm, true);
    assert.equal(h.context.state.checkoutLocked, true);
    assert.equal(h.context.state.clientSecret, session.clientSecret);
    assert.equal(h.payments.length, 0);
    assert.equal(h.confirmations.length, 0);
  });
}

test("restored checkout still requires recovery and can pay after an authorised release", async () => {
  const h = checkoutHarness({ checkoutLocked: true, bookingId: "old_booking", clientSecret: "" });
  await h.ready();
  assert.equal(h.hasRecovery, true);
  assert.equal(h.hasForm, false);
  assert.equal(h.requests.length, 0);
  // The recovery component owns verification; simulate only its successful reducer action.
  h.context.dispatch({ type: "ABANDON_CHECKOUT" }); h.flush(); await h.ready();
  await h.finish(h.submit());
  assert.equal(h.payments.length, 1);
});

test("unavailable Stripe SDK prevents booking creation", async () => {
  const h = checkoutHarness({}, { sdkUnavailable: true }); await h.ready();
  await h.submit(); h.flush();
  assert.equal(h.requests.length, 0);
  assert.equal(h.context.state.checkoutLocked, false);
  assert.match(h.alert, /unavailable/);
});

test("leaving the page during creation cannot continue to charge the card", async () => {
  const h = checkoutHarness(); await h.ready();
  const pending = h.submit(); h.unmount();
  await h.finish(pending);
  assert.equal(h.payments.length, 0);
  assert.equal(h.confirmations.length, 0);
});

function actionBarHarness() {
  const host = hooks();
  const instance = host.instance();
  const body = {};
  const observers = new Set();
  const timers = new Map();
  let timerId = 0, target = null, tree;
  const state = { step: 5, items: [], quoteStatus: "valid", clientTotal: 146.78, checkoutLocked: false };
  class Observer {
    constructor(callback) { this.callback = callback; this.target = null; observers.add(this); }
    observe(node) { this.target = node; }
    disconnect() { this.target = null; }
  }
  const { BookingActionBar } = loadSource(`${componentDir}BookingActionBar.tsx`, {
    react: host.react,
    "@/lib/booking-store": { useBooking: () => ({ state, dispatch() {} }) },
    "@/lib/booking-steps": { STEP_PRIMARY_CTA_ID: "primary", LEGACY_PRIMARY_CTA_ID: "legacy", stepInfo: () => ({ number: 4, total: 4, label: "Pay", isPay: true }) },
    "next/navigation": { useRouter: () => ({ push() {} }) },
  }, {
    document: { body, getElementById: (id) => id === "primary" ? target : null },
    MutationObserver: Observer,
    window: { setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; }, clearTimeout: (id) => timers.delete(id) },
  });
  function flush() {
    let passes = 0;
    do {
      assert.ok(++passes < 20, "Observer synchronisation must not cause a render loop");
      host.dirty = false;
      tree = host.render(instance, BookingActionBar);
      host.commit(instance);
    } while (host.dirty);
  }
  const emit = (node) => { for (const observer of observers) if (observer.target === node) observer.callback([]); flush(); };
  const harness = {
    timers,
    get primary() { return findNodes(tree, (node) => node.type === "button").at(-1); },
    replace(next) { target = next; emit(body); },
    mutate(node) { emit(node); },
    unmount() { host.unmount(instance); },
    get activeObservers() { return [...observers].filter((observer) => observer.target).length; },
  };
  flush();
  return harness;
}

const button = (disabled = false) => ({ disabled, textContent: "Pay", dataset: { actionBarBehaviour: "submit" }, isConnected: true, form: { requestSubmit() {} }, scrollIntoView() {}, focus() {} });

test("action bar discovers a submit button mounted later on the same step", () => {
  const h = actionBarHarness();
  assert.equal(h.primary.props.disabled, true);
  h.replace(button());
  assert.equal(h.primary.props.disabled, false);
  h.replace(null);
  assert.equal(h.primary.props.disabled, true);
  h.replace(button());
  assert.equal(h.primary.props.disabled, false);
  h.unmount();
});

test("action bar rebinds replacement buttons and mirrors processing and disabled state", () => {
  const h = actionBarHarness();
  const first = button(); h.replace(first);
  const next = button(true); h.replace(next);
  assert.equal(h.primary.props.disabled, true);
  next.disabled = false; h.mutate(next);
  assert.equal(h.primary.props.disabled, false);
  next.disabled = true; next.textContent = "Processing payment..."; h.mutate(next);
  assert.equal(h.primary.props.disabled, true);
  assert.match(JSON.stringify(h.primary.props.children), /Processing payment/);
  first.disabled = false; h.mutate(first);
  assert.equal(h.primary.props.disabled, true);
  h.unmount();
  assert.equal(h.activeObservers, 0);
});

test("action bar cancels deferred focus and disconnects observers on unmount", () => {
  const h = actionBarHarness();
  const target = button(); target.dataset = {}; h.replace(target);
  h.primary.props.onClick();
  assert.equal(h.timers.size, 1);
  h.unmount();
  assert.equal(h.timers.size, 0);
  assert.equal(h.activeObservers, 0);
});

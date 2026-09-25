/** Run with node --test scripts/booking-regression.cjs; no browser, network or new dependency. */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const vm = require("node:vm");
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

/** Exercise the real entry components and their effects without a browser or network. */
function bookingEntryHarness(query, draft = null) {
  let url = new URL(`https://example.test/book${query}`);
  let raw = draft;
  let dirty = false;
  let context;
  let active;
  const provider = { hooks: [], effects: [], cursor: 0 };
  const initializer = { hooks: [], effects: [], cursor: 0 };
  const replacements = [];
  const renderedSteps = [];
  const nextHook = (initialise) => {
    const index = active.cursor++;
    if (!active.hooks[index]) active.hooks[index] = initialise();
    return active.hooks[index];
  };
  const react = {
    createContext: () => ({ Provider: "provider" }),
    useContext: () => context,
    useRef: (value) => nextHook(() => ({ current: value })),
    useState: (value) => {
      const hook = nextHook(() => ({ value: typeof value === "function" ? value() : value }));
      hook.set ??= (next) => {
        const value = typeof next === "function" ? next(hook.value) : next;
        if (!Object.is(hook.value, value)) { hook.value = value; dirty = true; }
      };
      return [hook.value, hook.set];
    },
    useReducer: (reducer, initial) => {
      const hook = nextHook(() => ({ value: initial }));
      hook.dispatch ??= (action) => {
        const next = reducer(hook.value, action);
        if (!Object.is(next, hook.value)) { hook.value = next; dirty = true; }
      };
      return [hook.value, hook.dispatch];
    },
    useEffect: (effect, dependencies) => {
      const hook = nextHook(() => ({ dependencies: undefined }));
      if (!hook.dependencies || dependencies.some((value, i) => !Object.is(value, hook.dependencies[i]))) {
        hook.dependencies = dependencies;
        active.effects.push(effect);
      }
    },
  };
  const router = {
    replace: (href, options) => {
      replacements.push({ href, options });
      url = new URL(href, url);
      dirty = true;
    },
  };
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const window = { get location() { return url; } };
  const localStorage = {
    getItem: () => raw,
    setItem: (_key, value) => { raw = value; },
    removeItem: () => { raw = null; },
  };
  const loaded = new Map();
  function entryModule(relative) {
    const filename = path.join(root, "apps/web/src", relative);
    if (loaded.has(filename)) return loaded.get(filename).exports;
    const module = { exports: {} };
    loaded.set(filename, module);
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: filename,
    }).outputText;
    vm.runInNewContext(compiled, {
      module, exports: module.exports, window, localStorage, URL, URLSearchParams, Date: Clock,
      require(specifier) {
        if (specifier === "react") return react;
        if (specifier === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }) };
        if (specifier === "next/navigation") return {
          useSearchParams: () => new URLSearchParams(url.search),
          useRouter: () => router,
          usePathname: () => url.pathname,
        };
        if (specifier === "@/lib/booking-store") return entryModule("lib/booking-store.tsx");
        const source = specifier.startsWith("@/")
          ? path.join(root, "apps/web/src", `${specifier.slice(2)}.ts`)
          : path.resolve(path.dirname(filename), `${specifier}.ts`);
        return sourceModule(source);
      },
    }, { filename });
    return module.exports;
  }
  const { BookingProvider } = entryModule("lib/booking-store.tsx");
  const { SearchParamsInitializer } = entryModule("components/booking/SearchParamsInitializer.tsx");
  function flush() {
    let renders = 0;
    do {
      dirty = false;
      for (const owner of [provider, initializer]) { owner.cursor = 0; owner.effects = []; }
      active = provider;
      context = BookingProvider({ children: null }).props.value;
      renderedSteps.push({ serviceSlug: context.state.serviceSlug, step: context.state.step });
      active = initializer;
      SearchParamsInitializer();
      // React passive effects mount child-first. Rerender after the batch.
      for (const effect of [...initializer.effects, ...provider.effects]) effect();
      assert.ok(++renders < 12, "booking entry effects must settle without a render loop");
    } while (dirty);
  }
  flush();
  return {
    get state() { return JSON.parse(JSON.stringify(context.state)); },
    get url() { return url; },
    get draft() { return raw; },
    replacements,
    renderedSteps,
    navigate(query) { url = new URL(`/book${query}`, url); flush(); },
    dispatch(action) { context.dispatch(action); flush(); },
  };
}

/** Load the actual payment module; SDK, React lifecycle and booking input are isolated. */
function paymentModuleHarness(publishableKey = "pk_test_offline") {
  let active;
  let mounted = false;
  let dirty = false;
  let stripeClient = null;
  let tree;
  let form;
  let stepOwner;
  let formOwner;
  let resolveSdk;
  let rejectSdk;
  const sdk = new Promise((resolve, reject) => { resolveSdk = resolve; rejectSdk = reject; });
  const calls = [];
  const imports = [];
  const providerPromises = [];
  const nextHook = (initialise) => {
    const index = active.cursor++;
    if (!active.hooks[index]) active.hooks[index] = initialise();
    return active.hooks[index];
  };
  const react = {
    useRef: (value) => nextHook(() => ({ current: value })),
    useState: (initial) => {
      const hook = nextHook(() => ({ value: typeof initial === "function" ? initial() : initial }));
      hook.set ??= (value) => {
        const next = typeof value === "function" ? value(hook.value) : value;
        if (!Object.is(next, hook.value)) { hook.value = next; dirty = true; }
      };
      return [hook.value, hook.set];
    },
    useEffect: (effect, dependencies) => {
      const hook = nextHook(() => ({ dependencies: undefined, cleanup: undefined }));
      if (!hook.dependencies || dependencies.some((value, index) => !Object.is(value, hook.dependencies[index]))) {
        hook.dependencies = dependencies;
        active.effects.push(() => { hook.cleanup?.(); hook.cleanup = effect(); });
      }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const module = { exports: {} };
  const filename = path.join(root, "apps/web/src/components/booking/Step4Payment.tsx");
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  vm.runInNewContext(compiled, {
    module, exports: module.exports, Promise, Date, Intl, encodeURIComponent,
    process: { env: { NODE_ENV: "test", NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: publishableKey } },
    require(specifier) {
      imports.push(specifier);
      if (specifier === "react") return react;
      if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (specifier === "@stripe/stripe-js" || specifier === "@stripe/stripe-js/pure") return {
        loadStripe: (...args) => { calls.push(args); return sdk; },
      };
      if (specifier === "@stripe/react-stripe-js") return {
        Elements: "elements-provider", CardElement: "card-element",
        useStripe: () => stripeClient,
        useElements: () => stripeClient ? {} : null,
      };
      if (specifier === "@/lib/booking-store") return {
        useBooking: () => ({ state: { ...state, checkoutLocked: false }, dispatch() {} }),
        serialiseBookingDraft,
      };
      if (specifier === "next/navigation") return { useRouter: () => ({ push() {} }) };
      if (specifier === "next/image") return "image";
      if (specifier === "./checkout-session") return { completeCardPayment, parseBookingPaymentSession };
      if (specifier === "./PriceExplainerLink") return { PriceExplainerLink: "price-explainer" };
      if (specifier === "./CheckoutRecovery") return { CheckoutRecovery: "checkout-recovery" };
      if (specifier === "@/lib/analytics") return { trackPurchase() {} };
      throw new Error(`Unexpected payment test dependency: ${specifier}`);
    },
  }, { filename });
  function find(node, predicate) {
    if (!node || typeof node !== "object") return null;
    if (Array.isArray(node)) {
      for (const child of node) { const match = find(child, predicate); if (match) return match; }
      return null;
    }
    return predicate(node) ? node : find(node.props?.children, predicate);
  }
  function flush() {
    if (!mounted) return;
    let iterations = 0;
    do {
      dirty = false;
      for (const owner of [stepOwner, formOwner]) { owner.cursor = 0; owner.effects = []; }
      active = stepOwner;
      tree = module.exports.Step4Payment();
      providerPromises.push(tree.props.stripe);
      const checkout = find(tree, (node) => node.type?.name === "CheckoutForm");
      assert.ok(checkout, "the existing checkout form remains reachable");
      active = formOwner;
      form = checkout.type(checkout.props);
      for (const effect of [...formOwner.effects, ...stepOwner.effects]) effect();
      assert.ok(++iterations < 10, "payment loading effects must settle");
    } while (dirty);
  }
  return {
    calls, imports, providerPromises,
    mount() {
      mounted = true;
      stepOwner = { hooks: [], cursor: 0, effects: [] };
      formOwner = { hooks: [], cursor: 0, effects: [] };
      flush();
    },
    unmount() {
      mounted = false;
      for (const owner of [stepOwner, formOwner]) for (const hook of owner.hooks) hook.cleanup?.();
    },
    rerender: flush,
    async settle(client, error = null) {
      stripeClient = client;
      if (error) rejectSdk(error); else resolveSdk(client);
      for (let i = 0; i < 6; i += 1) await Promise.resolve();
      flush();
    },
    get payDisabled() { return find(form, (node) => node.props?.id === "booking-primary-action").props.disabled; },
    get hasCard() { return Boolean(find(form, (node) => node.type === "card-element")); },
    get hasLoadingStatus() { return Boolean(find(form, (node) => node.props?.role === "status")); },
    get unavailable() { return JSON.stringify(form).includes("Online payment unavailable"); },
  };
}

test("prefetching the payment module does not initialise Stripe or import its eager entry point", () => {
  const fixture = paymentModuleHarness();
  assert.equal(fixture.calls.length, 0);
  assert.equal(fixture.imports.includes("@stripe/stripe-js"), false);
  assert.equal(fixture.imports.includes("@stripe/stripe-js/pure"), true);
});

test("mounting payment lazily initialises one stable Stripe promise and reuses it after remount", async () => {
  const fixture = paymentModuleHarness();
  assert.equal(fixture.calls.length, 0);
  fixture.mount();
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.calls[0][0], "pk_test_offline");
  assert.equal(fixture.calls[0][1].locale, "en-GB");
  assert.equal(fixture.hasLoadingStatus, true);
  assert.equal(fixture.payDisabled, true);
  fixture.rerender();
  fixture.unmount();
  fixture.mount();
  assert.equal(fixture.calls.length, 1);
  const promises = fixture.providerPromises.filter(Boolean);
  assert.ok(promises.length > 0);
  assert.equal(new Set(promises).size, 1);
  await fixture.settle({});
  assert.equal(fixture.hasCard, true);
  assert.equal(fixture.hasLoadingStatus, false);
  assert.equal(fixture.payDisabled, false);
});

test("missing payment configuration does not load Stripe and retains unavailable UI", () => {
  const fixture = paymentModuleHarness("");
  fixture.mount();
  assert.equal(fixture.calls.length, 0);
  assert.equal(fixture.unavailable, true);
  assert.equal(fixture.hasCard, false);
  assert.equal(fixture.payDisabled, true);
});

test("SDK rejection retains unavailable UI and cannot enable payment or create a second loader", async () => {
  const fixture = paymentModuleHarness();
  fixture.mount();
  await fixture.settle(null, new Error("Simulated blocked SDK"));
  assert.equal(fixture.unavailable, true);
  assert.equal(fixture.hasCard, false);
  assert.equal(fixture.payDisabled, true);
  fixture.rerender();
  assert.equal(fixture.calls.length, 1);
});

test("direct entry begins at the service selector; unknown service links do not invent a service", () => {
  assert.equal(INITIAL_BOOKING_STATE.step, 1);
  assert.equal(resolveBookingService("not-a-service"), null);
  assert.equal(resolveBookingService(""), null);
  assert.equal(resolveBookingService("house").serviceSlug, "house-removal");
  assert.equal(resolveBookingService("house-removals").inventoryMode, "rooms");
  assert.equal(resolveBookingService("furniture").inventoryMode, "items");
  assert.equal(resolveBookingService("flat-removals").inventoryMode, "rooms");
});

test("refreshing a service entry retains matching draft items, bedrooms and route", () => {
  const flow = bookingEntryHarness("?service=house-removals", envelope({ step: 3 }));
  assert.deepEqual(flow.state.items, state.items);
  assert.deepEqual(flow.state.inventoryRooms, state.inventoryRooms);
  assert.equal(flow.state.bedroomCount, "2");
  assert.equal(flow.state.pickup.postcode, "G1 1AA");
  assert.equal(flow.state.step, 3);
  assert.equal(flow.state.clientTotal, 0);
  assert.equal(flow.state.quoteStatus, "stale");
});

test("an intentional different service entry starts that service without the previous inventory", () => {
  const flow = bookingEntryHarness("?service=furniture", envelope({ step: 4 }));
  assert.equal(flow.state.serviceSlug, "furniture-delivery");
  assert.equal(flow.state.entryServiceSlug, "furniture");
  assert.equal(flow.state.inventoryMode, "items");
  assert.deepEqual(flow.state.items, []);
  assert.equal(flow.state.bedroomCount, "");
  assert.equal(flow.state.step, 2);
  assert.equal(flow.renderedSteps.some((render) => render.serviceSlug === "house-removal" && render.step === 4), false,
    "a different entry must not mount the old service's quote step before applying its selection");
});

test("fresh entries preselect the requested public service and do not turn student moves into a generic service", () => {
  for (const [query, slug, mode] of [
    ["house", "house-removal", "rooms"],
    ["flat-removals", "man-and-van", "rooms"],
    ["furniture", "furniture-delivery", "items"],
    ["student-move", "student-move", "items"],
  ]) {
    const flow = bookingEntryHarness(`?service=${query}`);
    assert.equal(flow.state.serviceSlug, slug);
    assert.equal(flow.state.inventoryMode, mode);
    assert.equal(flow.state.step, 2);
    assert.equal(flow.url.searchParams.has("service"), false);
    assert.equal(flow.replacements.length, 1);
  }
});

test("equivalent aliases resume the same draft, but distinct mapped flat and small moves do not", () => {
  for (const alias of ["house", "house-removal", "house-removals"]) {
    const flow = bookingEntryHarness(`?service=${alias}`, envelope({ step: 3 }));
    assert.deepEqual(flow.state.items, state.items);
    assert.equal(flow.state.bedroomCount, "2");
  }
  const genericDraft = envelope({ serviceSlug: "man-and-van", serviceName: "Other", entryServiceSlug: "other", step: 3 });
  assert.deepEqual(bookingEntryHarness("?service=man-and-van", genericDraft).state.items, state.items);
  const flatDraft = envelope({ serviceSlug: "man-and-van", serviceName: "Flat Removals", entryServiceSlug: "other", step: 3 });
  assert.deepEqual(bookingEntryHarness("?service=flat-removals", flatDraft).state.items, state.items);
  assert.deepEqual(bookingEntryHarness("?service=small-moves", flatDraft).state.items, []);
});

test("direct and unknown service entries preserve a usable saved draft without applying arbitrary dates", () => {
  for (const query of ["", "?service=retired-service", "?service=&date=2000-01-01"]) {
    const flow = bookingEntryHarness(query, envelope({ step: 3 }));
    assert.deepEqual(flow.state.items, state.items);
    assert.equal(flow.state.selectedDate, state.selectedDate);
    assert.equal(flow.replacements.length, 0);
  }
  assert.equal(bookingEntryHarness("?service=retired-service").state.step, 1);
});

test("consuming a service hint retains attribution, other parameters and hash without a history entry", () => {
  const flow = bookingEntryHarness("?utm_source=sample&service=house&date=2026-10-01&tag=one&tag=two#details");
  assert.equal(flow.url.searchParams.get("utm_source"), "sample");
  assert.equal(flow.url.searchParams.get("date"), "2026-10-01");
  assert.deepEqual(flow.url.searchParams.getAll("tag"), ["one", "two"]);
  assert.equal(flow.url.hash, "#details");
  assert.equal(flow.state.selectedDate, "");
  assert.equal(flow.replacements.length, 1);
  assert.equal(flow.replacements[0].options.scroll, false);
});

test("later edits survive refresh and history revisits after the service hint has been consumed", () => {
  const flow = bookingEntryHarness("?service=house-removals", envelope({ step: 3 }));
  flow.dispatch({ type: "SET_SERVICE", slug: "furniture-delivery", name: "Furniture", sourceSlug: "furniture" });
  flow.dispatch({ type: "SET_ITEMS", items: [{ name: "Sofa", quantity: 1 }] });
  const refreshed = bookingEntryHarness(flow.url.search, flow.draft);
  assert.equal(refreshed.state.serviceSlug, "furniture-delivery");
  assert.deepEqual(refreshed.state.items, [{ name: "Sofa", quantity: 1 }]);
  refreshed.navigate("?service=office");
  assert.equal(refreshed.state.serviceSlug, "office-removal");
  refreshed.navigate("?service=retired-service");
  assert.equal(refreshed.state.serviceSlug, "office-removal");
  refreshed.navigate("?service=house-removals");
  assert.equal(refreshed.state.serviceSlug, "house-removal");
  assert.equal(refreshed.state.inventoryMode, "rooms");
  assert.deepEqual(refreshed.state.items, []);
});

test("service query initialisation cannot replace an unresolved checkout after hydration", () => {
  const flow = bookingEntryHarness("?service=furniture", envelope({ checkoutLocked: true }));
  assert.equal(flow.state.checkoutLocked, true);
  assert.equal(flow.state.serviceSlug, "house-removal");
  assert.equal(flow.state.bookingRef, "reference_test");
  assert.equal(flow.state.clientSecret, "");
  assert.equal(flow.state.step, 5);
  assert.deepEqual(flow.state.items, state.items);
  const persisted = JSON.parse(flow.draft).state;
  assert.equal(persisted.checkoutLocked, true);
  assert.equal(persisted.bookingRef, "reference_test");
  assert.equal(persisted.clientSecret, "");
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

const { getBookingPricingKey } = sourceModule(path.join(root, "apps/web/src/lib/booking-quote.ts"));
function quoteCalendar(price = 120, date = state.selectedDate) {
  return { days: [{ date, slots: [{ slot: "morning", price, tier: "green" }] }],
    staticLineItems: [{ label: "Base service", amount: price, type: "base" }],
    staticSubtotal: price, currency: "GBP", symbol: "£" };
}

/** Run the actual persistent quote component with controlled network and timer completion. */
function quoteSyncHarness(initial = state) {
  let current = { ...initial, clientSecret: "", bookingId: "", bookingRef: "" };
  let dirty = true;
  let cursor = 0;
  let effects = [];
  let mounted = true;
  let timerId = 0;
  const hooks = [];
  const timers = new Map();
  const requests = [];
  const dispatch = (action) => { current = bookingReducer(current, action); dirty = true; };
  const hook = (init) => { const index = cursor++; return hooks[index] ??= init(); };
  const react = {
    useRef(value) { return hook(() => ({ current: value })); },
    useEffect(effect, dependencies) {
      const ref = hook(() => ({ dependencies: undefined, cleanup: undefined }));
      if (!ref.dependencies || dependencies.some((value, i) => !Object.is(value, ref.dependencies[i]))) {
        ref.dependencies = dependencies;
        effects.push(() => { ref.cleanup?.(); ref.cleanup = effect(); });
      }
    },
  };
  const filename = path.join(root, "apps/web/src/components/booking/BookingQuoteSync.tsx");
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports, AbortController, Error, process: { env: { NODE_ENV: "test" } },
    window: { setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); } },
    fetch(url, options) {
      return new Promise((resolve, reject) => { requests.push({ url, options, resolve, reject }); });
    },
    require(specifier) {
      if (specifier === "react") return react;
      if (specifier === "@/lib/booking-store") return { useBooking: () => ({ state: current, dispatch }) };
      if (specifier === "@/lib/booking-quote") return sourceModule(path.join(root, "apps/web/src/lib/booking-quote.ts"));
      if (specifier === "./quote-response") return { parsePricingResult };
      throw new Error(`Unexpected dependency: ${specifier}`);
    },
  }, { filename });
  function flush() {
    let renders = 0;
    while (dirty && mounted) {
      dirty = false; cursor = 0; effects = [];
      module.exports.BookingQuoteSync();
      for (const effect of effects) effect();
      assert.ok(++renders < 15, "quote refresh must not loop");
    }
  }
  flush();
  return {
    get state() { return current; }, requests,
    dispatch(action) { dispatch(action); flush(); },
    startRequest() { const batch = [...timers.values()]; timers.clear(); for (const timer of batch) void timer(); flush(); },
    async respond(index, data = quoteCalendar(), ok = true) {
      requests[index].resolve({ ok, json: async () => ({ success: ok, data }) });
      await new Promise((resolve) => setImmediate(resolve)); flush();
    },
    unmount() { mounted = false; for (const ref of hooks) ref.cleanup?.(); },
  };
}

test("a quote refresh stays active after Back, preserves the appointment and replaces the old total", async () => {
  const flow = quoteSyncHarness();
  flow.startRequest();
  await flow.respond(0);
  flow.dispatch({ type: "SET_STEP", step: 3 });
  assert.equal(flow.requests.length, 1);
  flow.dispatch({ type: "SET_HELPERS", count: 2 });
  assert.equal(flow.state.clientTotal, 0);
  assert.equal(flow.state.quoteStatus, "loading");
  assert.equal(flow.state.selectedDate, state.selectedDate);
  assert.equal(flow.state.selectedTimeSlot, state.selectedTimeSlot);
  assert.equal(getReachableBookingStep(flow.state, 5), 4);
  flow.startRequest();
  assert.equal(JSON.parse(flow.requests[1].options.body).helpersCount, 2);
  await flow.respond(1, quoteCalendar(156));
  assert.equal(flow.state.clientTotal, 156);
  assert.equal(flow.state.quoteStatus, "valid");
  assert.equal(flow.state.step, 3);
  flow.unmount();
});

test("quantity edits send the current inventory and late responses cannot overwrite a newer edit", async () => {
  const flow = quoteSyncHarness();
  flow.startRequest();
  flow.dispatch({ type: "SET_ITEMS", items: [{ ...state.items[0], quantity: 3 }] });
  assert.equal(flow.requests[0].options.signal.aborted, true);
  flow.startRequest();
  assert.equal(JSON.parse(flow.requests[1].options.body).selectedItems[0].quantity, 3);
  await flow.respond(1, quoteCalendar(180));
  await flow.respond(0, quoteCalendar(120));
  assert.equal(flow.state.clientTotal, 180);
  assert.equal(flow.state.items[0].quantity, 3);
  flow.unmount();
});

test("request identity rejects stale same-input replies after retry or an A to B to A edit", () => {
  const key = getBookingPricingKey(state);
  let current = bookingReducer(state, { type: "QUOTE_REQUESTED", inputKey: key, requestId: "old" });
  current = bookingReducer(current, { type: "SET_HELPERS", count: 1 });
  current = bookingReducer(current, { type: "SET_HELPERS", count: 0 });
  current = bookingReducer(current, { type: "QUOTE_REQUESTED", inputKey: key, requestId: "new" });
  const stale = bookingReducer(current, { type: "QUOTE_RECEIVED", inputKey: key, requestId: "old", pricing: quoteCalendar(10) });
  assert.strictEqual(stale, current);
  const latest = bookingReducer(current, { type: "QUOTE_RECEIVED", inputKey: key, requestId: "new", pricing: quoteCalendar(120) });
  assert.equal(latest.clientTotal, 120);
});

test("repeated same-value edits during a pending quote restart safely instead of stranding loading", async () => {
  const flow = quoteSyncHarness();
  flow.startRequest();
  flow.dispatch({ type: "SET_PACKING", value: false });
  flow.startRequest();
  assert.equal(flow.requests.length, 2);
  assert.equal(flow.requests[0].options.signal.aborted, true);
  await flow.respond(1);
  assert.equal(flow.state.quoteStatus, "valid");
  flow.unmount();
});

test("date and time selection uses the matching fresh calendar without another request", async () => {
  const flow = quoteSyncHarness();
  flow.startRequest();
  await flow.respond(0);
  flow.dispatch({ type: "SET_DATE", date: state.selectedDate });
  assert.equal(flow.state.clientTotal, 0);
  flow.dispatch({ type: "SET_SLOT", slot: "morning" });
  assert.equal(flow.state.clientTotal, 120);
  assert.equal(flow.state.quoteStatus, "valid");
  flow.startRequest();
  assert.equal(flow.requests.length, 1);
  flow.unmount();
});

test("failed and empty responses clear payable prices; retry obtains a new quote", async () => {
  for (const response of [null, { ...quoteCalendar(), days: [] }]) {
    const flow = quoteSyncHarness();
    flow.startRequest();
    await flow.respond(0, response);
    assert.equal(flow.state.quoteStatus, "failed");
    assert.equal(flow.state.clientTotal, 0);
    assert.equal(flow.state.quoteCalendar, null);
    flow.dispatch({ type: "RETRY_QUOTE" });
    flow.startRequest();
    await flow.respond(1);
    assert.equal(flow.state.quoteStatus, "valid");
    flow.unmount();
  }
});

test("empty inventory, invalid routes and checkout locks stop quote requests and obsolete responses", async () => {
  for (const action of [{ type: "SET_ITEMS", items: [] }, { type: "CLEAR_PICKUP" }, { type: "START_CHECKOUT" }]) {
    const flow = quoteSyncHarness();
    flow.startRequest();
    flow.dispatch(action);
    const beforeResponse = flow.state;
    assert.equal(flow.requests[0].options.signal.aborted, true);
    await flow.respond(0);
    assert.strictEqual(flow.state, beforeResponse);
    flow.startRequest();
    assert.equal(flow.requests.length, 1);
    flow.unmount();
  }
});

test("unavailable old appointments cannot become payable and quote calendars never persist in drafts", async () => {
  const flow = quoteSyncHarness();
  flow.startRequest();
  await flow.respond(0, quoteCalendar(120, "2026-10-01"));
  assert.equal(flow.state.quoteStatus, "stale");
  assert.equal(flow.state.clientTotal, 0);
  assert.match(flow.state.quoteError, /no longer available/);
  const saved = JSON.parse(serialiseBookingDraft(flow.state, now)).state;
  assert.equal(saved.quoteCalendar, null);
  assert.equal(saved.quoteInputKey, "");
  assert.equal(saved.quoteRequestId, "");
  flow.unmount();
});

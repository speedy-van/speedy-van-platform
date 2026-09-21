// Offline regression checks: no provider scripts, network requests or live events.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "apps/web/src/lib/analytics.ts"), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function fixture({ consent, blockedStorage = false, browser } = {}) {
  const events = [];
  const meta = [];
  const listeners = new Map();
  const window = browser ?? {
    location: { origin: "https://example.test", pathname: "/book", search: "?email=private@example.test" },
    localStorage: storage(),
    sessionStorage: storage(),
    dataLayer: [],
    gtag: (...args) => events.push(args),
    fbq: (...args) => meta.push(args),
    addEventListener: (name, callback) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener: (name, callback) => listeners.get(name)?.delete(callback),
    dispatchEvent: (event) => {
      for (const callback of listeners.get(event.type) ?? []) callback(event);
    },
  };
  if (consent) window.localStorage.setItem("sv-cookie-consent", consent);
  if (blockedStorage) {
    window.localStorage = window.sessionStorage = {
      getItem() { throw new Error("Storage unavailable"); },
      setItem() { throw new Error("Storage unavailable"); },
      removeItem() { throw new Error("Storage unavailable"); },
    };
  }
  const context = {
    exports: {}, window, URL, Event,
    process: { env: { NEXT_PUBLIC_GA_ID: "G-TEST" } },
  };
  vm.runInNewContext(javascript, context, { filename: "analytics.ts" });
  return { api: context.exports, window, events, meta, listeners };
}

function loadComponent(relativePath, imports = {}, globals = {}) {
  const componentSource = fs.readFileSync(path.join(root, relativePath), "utf8");
  const componentJs = ts.transpileModule(componentSource, {
    fileName: relativePath,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const context = {
    exports: {}, ...globals,
    require(name) {
      if (Object.hasOwn(imports, name)) return imports[name];
      if (name === "react/jsx-runtime") return {
        jsx: (type, props) => ({ type, props }),
        jsxs: (type, props) => ({ type, props }),
        Fragment: "fragment",
      };
      // Leave unrelated child components unmounted; no providers or effects run.
      return new Proxy({}, { get: (_target, key) => `${name}:${String(key)}` });
    },
  };
  vm.runInNewContext(componentJs, context, { filename: relativePath });
  return context.exports;
}

function descendants(node) {
  if (Array.isArray(node)) return node.flatMap(descendants);
  if (!node || typeof node !== "object") return [];
  return [node, ...descendants(node.props?.children)];
}

function mountCtaTracker(f) {
  let handler;
  let cleanup;
  const document = {
    addEventListener: (_name, callback) => { handler = callback; },
    removeEventListener: (_name, callback) => { assert.equal(callback, handler); handler = undefined; },
  };
  class Element {
    constructor(props) {
      this.props = props;
      this.dataset = {
        trackEvent: props["data-track-event"],
        trackLocation: props["data-track-location"],
        trackLabel: props["data-track-label"],
      };
      this.textContent = "Contact";
    }
    closest() { return this; }
    getAttribute(name) { return this.props[name] ?? null; }
  }
  const component = loadComponent("apps/web/src/components/CtaClickTracker.tsx", {
    react: { useEffect(effect) { cleanup = effect(); } },
    "@/lib/analytics": f.api,
  }, { document, Element });
  component.CtaClickTracker();
  return { click: (props) => handler({ target: new Element(props) }), cleanup: () => cleanup() };
}

test("unknown, declined and invalid choices do not send events even when providers exist", () => {
  for (const consent of [undefined, "declined", "unexpected"]) {
    const f = fixture({ consent });
    f.api.trackAnalyticsEvent("call_click");
    f.api.trackMetaEvent("call_click", {}, true);
    f.api.trackPurchase("booking-a", 100, "man-and-van");
    assert.equal(f.events.length, 0);
    assert.equal(f.meta.length, 0);
    assert.equal(f.window.dataLayer.length, 0);
  }
});

test("acceptance updates subscribers immediately; revocation disables already loaded providers", () => {
  const f = fixture();
  const changes = [];
  const unsubscribe = f.api.subscribeCookieConsent(() => changes.push(f.api.getCookieConsent()));
  f.api.setCookieConsent("accepted");
  assert.deepEqual(changes, ["accepted"]);
  assert.equal(f.window["ga-disable-G-TEST"], false);
  f.api.setCookieConsent("declined");
  assert.deepEqual(changes, ["accepted", "declined"]);
  assert.equal(f.window["ga-disable-G-TEST"], true);
  assert.equal(f.events.at(-1)[2].analytics_storage, "denied");
  assert.equal(f.meta.at(-1)[1], "revoke");
  const eventCount = f.events.length;
  f.api.trackAnalyticsEvent("quote_click");
  assert.equal(f.events.length, eventCount);
  unsubscribe();
  assert.equal([...f.listeners.values()].reduce((n, callbacks) => n + callbacks.size, 0), 0);
});

test("a choice in another tab updates the current tab without a reload", () => {
  const f = fixture({ consent: "accepted" });
  let updates = 0;
  const unsubscribe = f.api.subscribeCookieConsent(() => updates++);
  f.window.dispatchEvent({ type: "storage", key: "sv-cookie-consent", newValue: "declined" });
  assert.equal(f.api.hasAnalyticsConsent(), false);
  assert.equal(updates, 1);
  f.window.dispatchEvent({ type: "storage", key: "unrelated", newValue: "accepted" });
  assert.equal(updates, 1);
  unsubscribe();
});

test("blocked storage fails closed until an explicit choice and preserves in-memory purchase deduplication", () => {
  const f = fixture({ blockedStorage: true });
  assert.equal(f.api.hasAnalyticsConsent(), false);
  f.api.setCookieConsent("accepted");
  assert.equal(f.api.hasAnalyticsConsent(), true);
  f.api.trackPurchase("booking-blocked", 130, "small-moves");
  f.api.trackPurchase("booking-blocked", 130, "small-moves");
  assert.equal(f.events.filter((event) => event[1] === "purchase").length, 1);
  assert.equal(f.meta.filter((event) => event[1] === "Purchase").length, 1);
});

test("an accepted event has one delivery path and no query-string contact details", () => {
  const f = fixture({ consent: "accepted" });
  f.api.trackAnalyticsEvent("call_click", { cta_location: "footer" });
  assert.equal(f.events.length, 1);
  assert.equal(f.window.dataLayer.length, 0);
  assert.equal(f.events[0][2].page_location, "https://example.test/book");
  f.window.gtag = undefined;
  f.api.trackAnalyticsEvent("quote_click");
  assert.equal(f.window.dataLayer.length, 1);
  assert.equal(f.window.dataLayer[0].event, "quote_click");
});

test("the same confirmed booking is sent once to each provider across reloads", () => {
  const f = fixture({ consent: "accepted" });
  f.api.trackPurchase("booking-repeat", 145.5, "house-removal");
  f.api.trackPurchase("booking-repeat", 145.5, "house-removal");
  const reloaded = fixture({ browser: f.window });
  reloaded.api.trackPurchase("booking-repeat", 145.5, "house-removal");
  assert.equal(f.events.filter((event) => event[1] === "purchase").length, 1);
  assert.equal(f.meta.filter((event) => event[1] === "Purchase").length, 1);
  assert.equal(f.events[0][2].transaction_id, "booking-repeat");
  assert.equal(f.events[0][2].currency, "GBP");
});

test("a provider that becomes available later does not repeat the other provider's purchase", () => {
  const f = fixture({ consent: "accepted" });
  const pixel = f.window.fbq;
  f.window.fbq = undefined;
  f.api.trackPurchase("booking-late", 200, "flat-removals");
  f.window.fbq = pixel;
  f.api.trackPurchase("booking-late", 200, "flat-removals");
  assert.equal(f.events.filter((event) => event[1] === "purchase").length, 1);
  assert.equal(f.meta.filter((event) => event[1] === "Purchase").length, 1);
});

test("invalid amounts and incomplete purchase identifiers never create revenue", () => {
  const f = fixture({ consent: "accepted" });
  for (const amount of [NaN, Infinity, -1, 0]) f.api.trackPurchase("booking-bad", amount, "small-moves");
  f.api.trackPurchase(" ", 50, "small-moves");
  f.api.trackPurchase("booking-bad", 50, " ");
  assert.equal(f.events.length, 0);
  assert.equal(f.meta.length, 0);
});

test("initialisation uses denied defaults, disables automatic page views and runs once", () => {
  const f = fixture({ consent: "accepted" });
  f.api.initialiseAnalytics("G-TEST", "pixel-test");
  f.api.initialiseAnalytics("G-TEST", "pixel-test");
  const config = f.events.filter((event) => event[0] === "config");
  assert.equal(config.length, 1);
  assert.equal(config[0][2].send_page_view, false);
  assert.equal(f.events[0][0], "consent");
  assert.equal(f.events[0][1], "default");
  assert.equal(f.events[0][2].ad_user_data, "denied");
  assert.equal(f.meta.filter((event) => event[0] === "init").length, 1);
  assert.equal(f.events.filter((event) => event[1] === "page_view").length, 0);
});

test("private pages never send application events", () => {
  const f = fixture({ consent: "accepted" });
  for (const pathname of ["/admin", "/driver/my-jobs/123", "/auth/login", "/track", "/book/review/private-token"]) {
    f.window.location.pathname = pathname;
    f.api.trackPageView(pathname);
    f.api.trackAnalyticsEvent("click");
  }
  assert.equal(f.events.length, 0);
  assert.equal(f.meta.length, 0);
});

test("blocked providers cannot throw into the customer flow", () => {
  const f = fixture({ consent: "accepted" });
  f.window.gtag = f.window.fbq = () => { throw new Error("Blocked provider"); };
  assert.doesNotThrow(() => f.api.trackPurchase("booking-blocked-provider", 90, "man-and-van"));
  assert.doesNotThrow(() => f.api.setCookieConsent("declined"));
});

test("contact CTA capture sends one event and a custom click, never a Meta Lead", () => {
  const f = fixture({ consent: "accepted" });
  let handler;
  let cleanup;
  const document = {
    addEventListener: (_name, callback) => { handler = callback; },
    removeEventListener: (_name, callback) => { assert.equal(callback, handler); handler = undefined; },
  };
  class Element {
    closest() { return this; }
    getAttribute(name) { return name === "href" ? "/book?email=private@example.test" : null; }
  }
  const element = new Element();
  element.dataset = { trackEvent: "call_click", trackLocation: "footer" };
  element.textContent = "Call us";
  const componentSource = fs.readFileSync(path.join(root, "apps/web/src/components/CtaClickTracker.tsx"), "utf8");
  const componentJs = ts.transpileModule(componentSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = {
    exports: {}, document, Element,
    require(name) {
      if (name === "react") return { useEffect(effect) { cleanup = effect(); } };
      if (name === "@/lib/analytics") return f.api;
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  vm.runInNewContext(componentJs, context);
  context.exports.CtaClickTracker();
  handler({ target: element });
  assert.equal(f.events.length, 1);
  assert.equal(f.events[0][1], "call_click");
  assert.equal(f.events[0][2].destination, "/book");
  assert.equal(f.meta[0][0], "trackCustom");
  assert.equal(f.meta[0][1], "call_click");
  assert.equal(f.window.dataLayer.length, 0);
  cleanup();
  assert.equal(handler, undefined);
});

test("SSR can safely import the helpers without a browser", () => {
  const context = { exports: {}, URL, process: { env: {} } };
  vm.runInNewContext(javascript, context);
  assert.equal(context.exports.getCookieConsent(), null);
  assert.doesNotThrow(() => context.exports.trackPageView("/"));
  assert.doesNotThrow(() => context.exports.trackPurchase("booking-ssr", 99, "man-and-van"));
});

test("marketing and booking layouts each inherit exactly one global CTA listener", () => {
  const imports = { "@/components/CtaClickTracker": { CtaClickTracker: "cta-listener" } };
  const { GlobalProviders } = loadComponent("apps/web/src/components/layout/GlobalProviders.tsx", imports);
  const { default: SiteLayout } = loadComponent("apps/web/src/app/(site)/layout.tsx", imports);
  const { default: BookLayout } = loadComponent("apps/web/src/app/book/layout.tsx", imports);
  for (const Layout of [SiteLayout, BookLayout]) {
    const tree = GlobalProviders({ children: Layout({ children: "page" }) });
    assert.equal(descendants(tree).filter((node) => node.type === "cta-listener").length, 1);
  }
});

test("footer contact destinations emit existing interest events once under consent", () => {
  const { SITE } = loadComponent("packages/config/src/site.ts");
  const { Footer } = loadComponent("apps/web/src/components/layout/Footer.tsx", {
    "@speedy-van/config": { SITE },
    "@/lib/services": { SERVICES: [] },
    "@/lib/areas": { AREAS: [] },
  });
  const contacts = descendants(Footer()).filter((node) => node.type === "a" && node.props["data-track-event"]);
  assert.equal(contacts.length, 3);
  const f = fixture({ consent: "accepted" });
  const tracker = mountCtaTracker(f);
  for (const contact of contacts) tracker.click(contact.props);
  assert.deepEqual(f.events.map((event) => event[1]).sort(), ["call_click", "email_click", "whatsapp_click"]);
  assert.ok(f.events.every((event) => event[2].cta_location === "footer"));
  assert.ok(f.events.some((event) => event[2].destination === `tel:${SITE.phone.replace(/\s/g, "")}`));
  assert.ok(f.events.some((event) => event[2].destination === `mailto:${SITE.email}`));
  assert.ok(f.events.some((event) => event[2].destination === SITE.social.whatsapp));
  assert.equal(f.meta.filter((event) => event[1] === "Lead" || event[1] === "Purchase").length, 0);
  f.api.setCookieConsent("declined");
  const count = f.events.length;
  for (const contact of contacts) tracker.click(contact.props);
  assert.equal(f.events.length, count);
  tracker.cleanup();
});

test("the app-level CTA listener preserves private-route exclusion for booking metadata", () => {
  const f = fixture({ consent: "accepted" });
  const tracker = mountCtaTracker(f);
  const props = { "data-track-event": "booking_shell_call_click", href: "tel:07909032889" };
  tracker.click(props);
  assert.equal(f.events[0][1], "booking_shell_call_click");
  for (const pathname of ["/admin", "/driver", "/track", "/book/review/private-reference"]) {
    f.window.location.pathname = pathname;
    tracker.click(props);
  }
  assert.equal(f.events.length, 1);
  tracker.cleanup();
});

test("exit help offers real navigation, collects no email and does not record a lead", () => {
  const events = [];
  const states = [];
  const component = loadComponent("apps/web/src/components/ExitIntentPopup.tsx", {
    react: {
      useState: () => [true, (value) => states.push(value)],
      useRef: () => ({ current: null }),
      useEffect: () => {},
    },
    "@/lib/analytics": { trackAnalyticsEvent: (name, payload) => events.push({ name, payload }) },
  }, {
    localStorage: { setItem: () => assert.fail("Help must not collect a local email or invent a locked quote") },
  });
  const tree = descendants(component.ExitIntentPopup());
  assert.equal(tree.filter((node) => node.type === "input" || node.type === "form").length, 0);
  const quote = tree.find((node) => node.props?.href === "/book");
  const call = tree.find((node) => node.props?.href === "tel:07909032889");
  assert.ok(quote);
  assert.ok(call);
  assert.equal(quote.props["data-track-event"], "quote_click");
  assert.equal(call.props["data-track-event"], "call_click");
  quote.props.onClick();
  call.props.onClick();
  assert.deepEqual(states, [false]);
  assert.deepEqual(events.map((event) => event.name), ["exit_intent_cta", "exit_intent_cta"]);
});

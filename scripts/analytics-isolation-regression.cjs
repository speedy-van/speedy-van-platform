// Offline tests only. No provider script, HTTP request or real conversion is sent.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");

function compile(relativePath) {
  return ts.transpileModule(fs.readFileSync(path.join(root, relativePath), "utf8"), {
    fileName: relativePath,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}
const analyticsJs = compile("apps/web/src/lib/analytics.ts");
const componentJs = compile("apps/web/src/components/layout/AnalyticsPixels.tsx");

function store() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
function fixture({ consent = "accepted", gaId = "G-TEST", metaId = "pixel-test" } = {}) {
  const events = [];
  const meta = [];
  const window = {
    location: { origin: "https://example.test", pathname: "/book" },
    localStorage: store(), sessionStorage: store(), dataLayer: [],
    gtag: (...args) => events.push(args), fbq: (...args) => meta.push(args),
    dispatchEvent() {}, addEventListener() {}, removeEventListener() {},
  };
  if (consent !== null) window.localStorage.setItem("sv-cookie-consent", consent);
  const process = { env: { NEXT_PUBLIC_GA_ID: gaId, NEXT_PUBLIC_FB_PIXEL_ID: metaId } };
  const context = { exports: {}, window, URL, Event, process };
  vm.runInNewContext(analyticsJs, context);
  const api = context.exports;
  return { window, process, events, meta, api };
}
function scripts(node) {
  if (Array.isArray(node)) return node.flatMap(scripts);
  if (!node || typeof node !== "object") return [];
  return [...(node.type === "script" ? [node.props] : []), ...scripts(node.props?.children)];
}
function component(f) {
  const slots = [];
  let cursor = 0;
  let effects = [];
  let dirty = false;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { if (!Object.is(slots[index], value)) { slots[index] = value; dirty = true; } }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      const old = slots[index];
      if (!old || dependencies.some((value, i) => !Object.is(value, old[i]))) effects.push(effect);
      slots[index] = dependencies;
    },
  };
  const imports = {
    react,
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }), Fragment: "fragment" },
    "next/navigation": { usePathname: () => f.window.location.pathname },
    "next/script": { default: "script" },
    "@/lib/analytics": f.api,
    "./CookieConsent": { useCookieConsent: () => f.api.getCookieConsent() },
  };
  const context = { exports: {}, process: f.process, require(name) {
    if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
    return imports[name];
  } };
  vm.runInNewContext(componentJs, context);
  return { render() {
    let result;
    for (let attempt = 0; attempt < 5; attempt++) {
      cursor = 0; effects = []; dirty = false;
      result = context.exports.AnalyticsPixels();
      for (const effect of effects) effect();
      if (!dirty) return scripts(result);
    }
    throw new Error("Unexpected repeated render");
  } };
}

const adsConfig = f => f.events.filter(e => e[0] === "config" && e[1] === "AW-18483787592");
const conversions = f => f.events.filter(e => e[0] === "event" && e[1] === "conversion");
const consentDefaults = f => f.events.filter(e => e[0] === "consent" && e[1] === "default");
const jsInitialisers = f => f.events.filter(e => e[0] === "js");
function runInlineScript(source, f) {
  vm.runInNewContext(source, { window: f.window, Date }, { filename: "google-tag-bootstrap.js" });
}
function queuedCommands(f) {
  return f.window.dataLayer.map(entry => Array.from(entry));
}

test("a throwing Meta provider cannot suppress the Google script after consent", () => {
  const f = fixture();
  f.window.fbq = () => { throw new Error("Blocked Meta provider"); };
  const mounted = component(f);
  const google = mounted.render().find(s => s.id === "google-tag-library");
  assert.ok(google, "Google script must still mount when Meta initialisation throws");
  assert.equal(google.src, "https://www.googletagmanager.com/gtag/js?id=AW-18483787592");
  assert.equal(adsConfig(f).length, 1);
});

test("a rejected optional GA4 config cannot suppress the Ads destination", () => {
  const f = fixture();
  f.window.gtag = (...args) => {
    if (args[0] === "config" && args[1] === "G-TEST") throw new Error("Rejected GA4 config");
    f.events.push(args);
  };
  assert.doesNotThrow(() => f.api.initialiseAnalytics("G-TEST", "pixel-test"));
  assert.equal(adsConfig(f).length, 1);
  assert.equal(f.meta.filter(e => e[0] === "init").length, 1);
});

test("Google initialisation failure does not suppress the independent Meta provider", () => {
  const f = fixture();
  f.window.gtag = () => { throw new Error("Blocked Google provider"); };
  assert.doesNotThrow(() => f.api.initialiseAnalytics("G-TEST", "pixel-test"));
  assert.equal(f.meta.filter(e => e[0] === "init").length, 1);
});

test("failed Meta initialisation remains retryable without duplicate Google configuration", () => {
  const f = fixture();
  const meta = f.window.fbq;
  f.window.fbq = () => { throw new Error("Temporarily unavailable"); };
  assert.doesNotThrow(() => f.api.initialiseAnalytics("G-TEST", "pixel-test"));
  f.window.fbq = meta;
  f.api.initialiseAnalytics("G-TEST", "pixel-test");
  f.api.initialiseAnalytics("G-TEST", "pixel-test");
  assert.equal(adsConfig(f).length, 1);
  assert.equal(f.meta.filter(e => e[0] === "init").length, 1);
});

test("failed GA4 configuration retries without repeating the successful Ads configuration", () => {
  const f = fixture();
  const gtag = f.window.gtag;
  f.window.gtag = (...args) => {
    if (args[0] === "config" && args[1] === "G-TEST") throw new Error("Temporarily unavailable");
    gtag(...args);
  };
  assert.doesNotThrow(() => f.api.initialiseAnalytics("G-TEST"));
  f.window.gtag = gtag;
  f.api.initialiseAnalytics("G-TEST");
  assert.equal(adsConfig(f).length, 1);
  assert.equal(f.events.filter(e => e[0] === "config" && e[1] === "G-TEST").length, 1);
  assert.equal(f.events.filter(e => e[0] === "js").length, 1);
});

test("the Ads-owned library URL is stable with and without an optional GA4 ID", () => {
  for (const gaId of [undefined, "", "G-TEST"]) {
    const f = fixture({ gaId });
    const google = component(f).render().find(s => s.id === "google-tag-library");
    assert.equal(google.src, "https://www.googletagmanager.com/gtag/js?id=AW-18483787592");
    assert.equal(google.strategy, "afterInteractive");
  }
});

test("component emits bootstrap before the external Google library and shares one owner with prepareGoogleTag", () => {
  const f = fixture();
  const mounted = component(f).render();
  const bootstrapIndex = mounted.findIndex(s => s.id === "google-tag-bootstrap");
  const libraryIndex = mounted.findIndex(s => s.id === "google-tag-library");
  assert.equal(bootstrapIndex, 0);
  assert.equal(libraryIndex, 1);
  assert.ok(bootstrapIndex < libraryIndex, "Default denied consent must be inline before the external library");
  assert.equal(mounted.filter(s => s.id === "google-tag-library").length, 1);
  runInlineScript(mounted[bootstrapIndex].children, f);
  assert.equal(consentDefaults(f).length, 1);
  assert.equal(jsInitialisers(f).length, 1);
  assert.equal(adsConfig(f).length, 1);
});

test("bootstrap can run before runtime initialisation without duplicate defaults or Ads config", () => {
  const f = fixture();
  f.window.gtag = undefined;
  runInlineScript(f.api.googleTagBootstrapScript("AW-18483787592"), f);
  f.api.prepareGoogleTag();
  f.api.initialiseAnalytics("G-TEST", "pixel-test");
  const queued = queuedCommands(f);
  const adsConfigs = queued.filter(e => e[0] === "config" && e[1] === "AW-18483787592");
  const gaConfigs = queued.filter(e => e[0] === "config" && e[1] === "G-TEST");
  const defaultIndex = queued.findIndex(e => e[0] === "consent" && e[1] === "default");
  const adsConfigIndex = queued.findIndex(e => e[0] === "config" && e[1] === "AW-18483787592");
  assert.equal(queued.filter(e => e[0] === "consent" && e[1] === "default").length, 1);
  assert.equal(queued.filter(e => e[0] === "js").length, 1);
  assert.equal(adsConfigs.length, 1);
  assert.equal(gaConfigs.length, 1);
  assert.ok(defaultIndex > -1 && defaultIndex < adsConfigIndex);
  assert.equal(queued[defaultIndex][2].ad_storage, "denied");
  assert.ok(queued.some(e => e[0] === "consent" && e[1] === "update" && e[2].ad_storage === "granted"));
});

test("unknown, declined and invalid consent mount only the denied Google base path", () => {
  for (const consent of [null, "declined", "unexpected"]) {
    const f = fixture({ consent });
    const mounted = component(f).render();
    assert.equal(mounted.filter(s => s.id === "google-tag-bootstrap").length, 1);
    assert.equal(mounted.filter(s => s.id === "google-tag-library").length, 1);
    assert.equal(mounted.filter(s => s.id === "fb-pixel-library").length, 0);
    assert.equal(adsConfig(f).length, 1);
    assert.equal(f.events.filter(e => e[1] === "page_view").length, 0);
    assert.equal(conversions(f).length, 0);
  }
});

test("private routes do not mount optional scripts even with saved acceptance", () => {
  for (const pathname of ["/admin", "/driver/jobs", "/auth/login", "/track", "/book/review/private"]) {
    const f = fixture();
    f.window.location.pathname = pathname;
    assert.deepEqual(component(f).render(), []);
    assert.equal(adsConfig(f).length, 0);
  }
});

test("rerenders and public navigation retain one Google configuration and one page view per route", () => {
  const f = fixture();
  f.window.location.pathname = "/";
  const mounted = component(f);
  assert.equal(mounted.render().filter(s => s.id === "google-tag-library").length, 1);
  mounted.render();
  f.window.location.pathname = "/book";
  mounted.render();
  assert.equal(adsConfig(f).length, 1);
  assert.equal(f.events.filter(e => e[1] === "page_view").length, 2);
  assert.equal(conversions(f).length, 0);
});

test("withdrawal blocks future purchase dispatch and reacceptance does not duplicate config", () => {
  const f = fixture();
  const mounted = component(f);
  mounted.render();
  f.api.setCookieConsent("declined");
  assert.equal(mounted.render().filter(s => s.id === "fb-pixel-library").length, 0);
  f.api.trackPurchase("mock-withdrawn", 125, "house-removal");
  assert.equal(conversions(f).length, 0);
  f.api.setCookieConsent("accepted");
  mounted.render();
  assert.equal(adsConfig(f).length, 1);
});

test("paid booking mock retains independent deduplication, GBP amount and the existing destination", () => {
  const f = fixture();
  f.window.fbq = () => { throw new Error("Blocked Meta provider"); };
  assert.doesNotThrow(() => f.api.initialiseAnalytics("G-TEST", "pixel-test"));
  f.api.trackPurchase("mock-paid", 137.94, "house-removal", { email: " Customer@Example.COM ", phone: "07909 032889" });
  f.api.trackPurchase("mock-paid", 137.94, "house-removal", { email: "dupe@example.test" });
  assert.equal(conversions(f).length, 1);
  const data = conversions(f)[0][2];
  assert.equal(data.send_to, "AW-18483787592/8NSGCPiVpYsdEMju4O1E");
  assert.equal(data.transaction_id, "mock-paid");
  assert.equal(data.value, 137.94);
  assert.equal(data.currency, "GBP");
  assert.equal(f.events.filter(e => e[1] === "purchase").length, 1);
  const userData = f.events.filter(e => e[0] === "set" && e[1] === "user_data");
  assert.equal(userData.length, 1);
  assert.equal(userData[0][2].email, "customer@example.com");
  assert.equal(userData[0][2].phone_number, "+447909032889");
});

test("initialisation queues denied defaults before granted consent and config when no provider exists", () => {
  const f = fixture();
  f.window.gtag = undefined;
  f.window.fbq = undefined;
  f.api.initialiseAnalytics("G-TEST", "pixel-test");
  const queued = queuedCommands(f);
  const defaultIndex = queued.findIndex(e => e[0] === "consent" && e[1] === "default");
  const adsConfigIndex = queued.findIndex(e => e[0] === "config" && e[1] === "AW-18483787592");
  assert.equal(defaultIndex, 0);
  assert.ok(defaultIndex < adsConfigIndex);
  assert.equal(queued[defaultIndex][2].ad_storage, "denied");
  assert.equal(queued.filter(e => e[0] === "consent" && e[1] === "default").length, 1);
  assert.equal(queued.filter(e => e[0] === "js").length, 1);
  assert.equal(queued.filter(e => e[0] === "config" && e[1] === "AW-18483787592").length, 1);
  assert.equal(queued.filter(e => e[0] === "config" && e[1] === "G-TEST").length, 1);
  assert.ok(queued.some(e => e[0] === "consent" && e[1] === "update" && e[2].ad_storage === "granted"));
});

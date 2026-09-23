/* Browser-policy runtime regressions with isolated navigation/cache mocks. */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const origin = "https://example.invalid";

const driverSource = ts.transpileModule(readFileSync(path.join(root, "apps/web/src/app/driver/login/page.tsx"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  fileName: "page.tsx",
}).outputText;
function driverDestination(returnUrl) {
  const destinations = [];
  const module = { exports: {} };
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(driverSource, {
    module, exports: module.exports, URL,
    require(specifier) {
      if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (specifier === "react") return {
        useState: (initial) => [initial, () => {}], useEffect: (effect) => effect(),
        useCallback: (callback) => callback, useRef: (initial) => ({ current: initial }), Suspense: "suspense",
      };
      if (specifier === "next/navigation") return {
        useRouter: () => ({ replace: (url) => destinations.push(url), push: (url) => destinations.push(url) }),
        useSearchParams: () => ({ get: () => returnUrl }),
      };
      if (specifier === "@/lib/auth-client") return { getUser: () => ({ role: "DRIVER" }), login: () => {} };
      throw new Error(`Unexpected import: ${specifier}`);
    },
  });
  const page = module.exports.default();
  page.props.children.type();
  return destinations[0];
}

const shellSource = ts.transpileModule(readFileSync(path.join(root, "apps/web/src/components/driver/DriverShell.tsx"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  fileName: "DriverShell.tsx",
}).outputText;
function driverShell(pathname, authenticated, role = null) {
  const destinations = [], state = [], authReads = [];
  let hookIndex = 0;
  const module = { exports: {} };
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(shellSource, {
    module, exports: module.exports,
    require(specifier) {
      if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (specifier === "react") return {
        useState(initial) {
          const index = hookIndex++;
          if (!(index in state)) state[index] = initial;
          return [state[index], (value) => { state[index] = value; }];
        },
        useEffect: (effect) => effect(),
      };
      if (specifier === "next/navigation") return {
        usePathname: () => pathname,
        useRouter: () => ({ replace: (url) => destinations.push(url) }),
      };
      if (specifier === "@/lib/auth-client") return {
        isAuthenticated() { authReads.push("token"); return authenticated; },
        getUser() { authReads.push("user"); return role ? { role } : null; },
      };
      if (specifier.endsWith("DriverTopBar")) return { DriverTopBar: "driver-top-bar" };
      if (specifier.endsWith("DriverBottomNav")) return { DriverBottomNav: "driver-bottom-nav" };
      throw new Error(`Unexpected import: ${specifier}`);
    },
  });
  return {
    destinations, authReads, state,
    render() { hookIndex = 0; return module.exports.DriverShell({ children: "protected-content" }); },
  };
}

function response(body, options = {}) {
  return {
    body, status: options.status ?? 200, type: "basic", redirected: options.redirected ?? false,
    headers: new Headers({ "content-type": "text/html", ...options.headers }),
    clone() { return response(body, options); },
  };
}
function workerHarness() {
  const handlers = {};
  const storage = new Map();
  let networkResponse = response("public HTML"), offline = false;
  const key = (request) => new URL(typeof request === "string" ? request : request.url, origin).href;
  const caches = {
    async keys() { return Array.from(storage.keys()); },
    async delete(name) { return storage.delete(name); },
    async open(name) {
      if (!storage.has(name)) storage.set(name, new Map());
      const cache = storage.get(name);
      return {
        async match(request) { return cache.get(key(request)); },
        async put(request, value) { cache.set(key(request), value); },
        async addAll(urls) { urls.forEach((url) => cache.set(key(url), response(url === "/offline.html" ? "offline shell" : "asset"))); },
      };
    },
  };
  vm.runInNewContext(readFileSync(path.join(root, "apps/web/public/sw.js"), "utf8"), {
    self: { location: { origin }, addEventListener: (name, handler) => { handlers[name] = handler; }, async skipWaiting() {}, clients: { async claim() {} } },
    caches, URL, Response, Set,
    fetch: async () => { if (offline) throw new Error("Offline"); return networkResponse; },
  });
  return {
    storage, caches,
    setResponse(value) { networkResponse = value; },
    setOffline(value = true) { offline = value; },
    async lifecycle(name) {
      const promises = []; handlers[name]({ waitUntil: (promise) => promises.push(promise) }); await Promise.all(promises);
    },
    async request(url, overrides = {}) {
      const promises = []; let handled;
      handlers.fetch({
        request: { url: new URL(url, origin).href, method: "GET", mode: "navigate", headers: new Headers(), ...overrides },
        waitUntil: (promise) => promises.push(promise), respondWith: (promise) => { handled = promise; },
      });
      const result = await handled; await Promise.all(promises); return result;
    },
    cachedUrls() { return Array.from(storage.values()).flatMap((cache) => Array.from(cache.keys())); },
  };
}

(async () => {
  await test("driver login rejects script, external, private and malformed return destinations", () => {
    for (const value of [null, "", "javascript:alert(1)", "https://evil.invalid/jobs", "//evil.invalid/jobs", "/\\evil.invalid/jobs", "/admin", "/driver/login", "/driver/../admin", "/jobs\n", "/driver/my-jobs/%2fadmin", "/jobs?x=\u0000"]) {
      assert.equal(driverDestination(value), "/driver/dashboard", `Blocked destination: ${JSON.stringify(value)}`);
    }
  });
  await test("driver login preserves existing local driver and job links", () => {
    for (const value of ["/jobs", "/jobs?status=available#jobs", "/driver/dashboard", "/driver/my-jobs", "/driver/my-jobs/job_123", "/driver/earnings", "/driver/messages", "/driver/stats"]) {
      assert.equal(driverDestination(value), value);
    }
  });
  await test("driver login shell leaves return-to-jobs navigation to the login form", () => {
    const shell = driverShell("/driver/login", false);
    assert.equal(shell.render().props.children, "protected-content");
    assert.deepEqual(shell.destinations, []); assert.deepEqual(shell.authReads, []);
    assert.equal(driverDestination("/jobs"), "/jobs");
  });
  await test("protected driver routes redirect unauthenticated users with the encoded current path", () => {
    const shell = driverShell("/driver/my-jobs/job_fixture", false);
    const loading = shell.render();
    assert.deepEqual(shell.destinations, ["/driver/login?returnUrl=%2Fdriver%2Fmy-jobs%2Fjob_fixture"]);
    assert.equal(loading.props.children.props.role, "status");
  });
  await test("authenticated drivers get protected content after verification without redirects", () => {
    const shell = driverShell("/driver/dashboard", true, "DRIVER");
    assert.equal(shell.render().props.children.props.role, "status");
    assert.deepEqual(shell.destinations, []);
    assert.equal(shell.render().props.children[1].props.children, "protected-content");
    assert.equal(shell.state[0], "/driver/dashboard");
  });
  await test("authenticated non-drivers cannot render driver content", () => {
    const shell = driverShell("/driver/dashboard", true, "CUSTOMER");
    assert.equal(shell.render().props.children.props.role, "status");
    assert.deepEqual(shell.destinations, ["/driver/login"]); assert.equal(shell.state[0], null);
  });
  await test("new worker deletes unsafe old application caches and preserves unrelated caches", async () => {
    const worker = workerHarness();
    for (const cache of ["sv-runtime-v5-pricing-white", "sv-shell-v5-pricing-white", "unrelated-app-cache"]) await worker.caches.open(cache);
    await worker.lifecycle("install"); await worker.lifecycle("activate");
    assert.equal(worker.storage.has("sv-runtime-v5-pricing-white"), false);
    assert.equal(worker.storage.has("sv-shell-v5-pricing-white"), false);
    assert.equal(worker.storage.has("unrelated-app-cache"), true);
    assert.equal(worker.cachedUrls().includes(`${origin}/`), false);
  });
  await test("successful public HTML is available offline", async () => {
    const worker = workerHarness(); await worker.lifecycle("install");
    await worker.request("/services/man-and-van"); worker.setOffline();
    assert.equal((await worker.request("/services/man-and-van")).body, "public HTML");
  });
  await test("private pages and URL query strings are never cached or returned from navigation caches", async () => {
    for (const url of ["/book", "/book/review/TEST?email=customer@example.invalid", "/book/confirmation?ref=TEST", "/track?email=customer@example.invalid", "/admin", "/driver/dashboard", "/auth/login", "/jobs", "/?email=customer@example.invalid", "/services/man-and-van?quote=private"]) {
      const worker = workerHarness(); await worker.lifecycle("install");
      worker.setResponse(response("private HTML")); await worker.request(url);
      assert.equal(worker.cachedUrls().includes(new URL(url, origin).href), false, url);
      // Even an unexpected stale entry in the current cache cannot serve a private page.
      await (await worker.caches.open("sv-runtime-v6-public-pages-only")).put(new URL(url, origin).href, response("private stale HTML"));
      worker.setOffline(); assert.equal((await worker.request(url)).body, "offline shell", url);
    }
  });
  await test("404, error, redirect, private and personalised responses are not cached", async () => {
    for (const options of [
      { status: 404 }, { status: 500 }, { redirected: true },
      { headers: { "cache-control": "private, no-store" } },
      { headers: { vary: "Accept-Encoding, Cookie" } },
      { headers: { vary: "Authorization" } },
      { headers: { vary: "*" } },
      { headers: { "content-type": "application/json" } },
    ]) {
      const worker = workerHarness(); worker.setResponse(response("not public", options));
      await worker.request("/services/man-and-van");
      assert.equal(worker.cachedUrls().includes(`${origin}/services/man-and-van`), false);
    }
  });
  await test("exact API root, API descendants, cross-origin and authenticated requests bypass caching", async () => {
    const worker = workerHarness();
    for (const url of ["/api", "/api/booking", "/api/private.png", "https://api.example.invalid/booking", "https://other.invalid/images/picture.png"]) {
      assert.equal(await worker.request(url), undefined);
    }
    assert.equal(await worker.request("/services/man-and-van", { headers: new Headers({ authorization: "Bearer fixture" }) }), undefined);
    assert.equal(await worker.request("/book", { method: "POST" }), undefined);
  });
  await test("only known public assets are cached, never a private URL with an image extension", async () => {
    const worker = workerHarness(); worker.setResponse(response("public image", { headers: { "content-type": "image/png" } }));
    await worker.request("/images/public.png", { mode: "cors" });
    assert.equal(worker.cachedUrls().includes(`${origin}/images/public.png`), true);
    assert.equal(await worker.request("/book/review/private.png", { mode: "cors" }), undefined);
  });
  await test("missing offline shell still returns a valid 503 response", async () => {
    const worker = workerHarness(); worker.setOffline();
    const result = await worker.request("/track"); assert.equal(result.status, 503);
    assert.match(await result.text(), /Reconnect/);
  });
})().catch((error) => { console.error(error); process.exitCode = 1; });

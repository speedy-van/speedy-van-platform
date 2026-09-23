/* Offline pricing regressions. Configuration reads and weather calls are mocked. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const apiRequire = createRequire(path.join(root, "apps/api/package.json"));
const { Hono } = apiRequire("hono");

function loadTs(relative, overrides = {}, globals = {}, modules = new Map()) {
  const filename = path.resolve(root, relative);
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const localRequire = createRequire(filename);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, Date, Error, Response, Buffer, URL, Number, Map, Set,
    console: { ...console, error() {} }, process: { env: { NODE_ENV: "production" } }, ...globals,
    require(specifier) {
      if (Object.hasOwn(overrides, specifier)) return overrides[specifier];
      if (specifier.startsWith(".")) {
        const candidate = path.resolve(path.dirname(filename), `${specifier}.ts`);
        if (fs.existsSync(candidate)) return loadTs(candidate, overrides, globals, modules);
      }
      return localRequire(specifier);
    },
  }, { filename });
  return module.exports;
}
const config = loadTs("packages/config/src/pricing.ts");
const shared = loadTs("packages/shared/src/index.ts");
const fixedTime = Date.parse("2026-09-21T12:00:00Z");
const input = {
  serviceType: "man-and-van", distanceMiles: 0, pickupFloor: 0, pickupHasLift: false,
  dropoffFloor: 0, dropoffHasLift: false, helpersCount: 0, needsPacking: false, needsAssembly: false,
};

function harness(initialRead = async () => []) {
  let time = fixedTime;
  let reads = 0;
  let weatherCalls = 0;
  let read = initialRead;
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [time])); }
    static now() { return time; }
  }
  const service = loadTs("apps/api/src/services/pricing.service.ts", {
    "@speedy-van/db": { db: { pricingConfig: { async findMany() { reads += 1; return read(); } } } },
    "@speedy-van/config": config,
    "@speedy-van/shared": shared,
    "./weather.service": { async getWeatherSurcharge() { weatherCalls += 1; return 0; } },
  }, { Date: Clock });
  return {
    service,
    get reads() { return reads; },
    get weatherCalls() { return weatherCalls; },
    setRead(next) { read = next; },
    advance(ms) { time += ms; },
  };
}
const baseRow = (value) => [{ category: "base", key: "otherBasePrice", value }];
const dateAt = (days) => new Date(fixedTime + days * 86400000);

test("failed configuration read rejects calendar and slot pricing before producing any amount", async () => {
  const cause = new Error("Simulated database outage");
  const fixture = harness(async () => { throw cause; });
  await assert.rejects(() => fixture.service.calculatePrice({ ...input, pickupLat: 55.8, pickupLng: -4.2 }), (error) => {
    assert.equal(error.message, "PRICING_CONFIG_UNAVAILABLE");
    assert.strictEqual(error.cause, cause);
    return true;
  });
  await assert.rejects(() => fixture.service.calculatePriceForSlot(input, dateAt(1), "morning"), /PRICING_CONFIG_UNAVAILABLE/);
  assert.equal(fixture.reads, 2);
  assert.equal(fixture.weatherCalls, 0);
});

test("a failed read is never cached as empty defaults; the next successful read recovers", async () => {
  const fixture = harness(async () => { throw new Error("Offline"); });
  await assert.rejects(() => fixture.service.calculatePrice(input), /PRICING_CONFIG_UNAVAILABLE/);
  fixture.setRead(async () => baseRow(77));
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 77);
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 77);
  assert.equal(fixture.reads, 2);
});

test("successful configuration remains cached for five minutes and then refreshes", async () => {
  const fixture = harness(async () => baseRow(70));
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 70);
  fixture.setRead(async () => baseRow(90));
  fixture.advance(5 * 60000 - 1);
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 70);
  assert.equal(fixture.reads, 1);
  fixture.advance(1);
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 90);
  assert.equal(fixture.reads, 2);
});

test("an expired successful cache is not served when its refresh fails", async () => {
  const fixture = harness(async () => baseRow(70));
  await fixture.service.calculatePrice(input);
  fixture.advance(5 * 60000);
  fixture.setRead(async () => { throw new Error("Offline after cache expiry"); });
  await assert.rejects(() => fixture.service.calculatePrice(input), /PRICING_CONFIG_UNAVAILABLE/);
  await assert.rejects(() => fixture.service.calculatePrice(input), /PRICING_CONFIG_UNAVAILABLE/);
  assert.equal(fixture.reads, 3);
  fixture.setRead(async () => baseRow(110));
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 110);
  assert.equal(fixture.reads, 4);
});

test("documented missing-key defaults remain valid only after a successful configuration read", async () => {
  const empty = harness();
  assert.equal((await empty.service.calculatePrice(input)).staticSubtotal, config.DEFAULT_PRICING_CONFIG.base.otherBasePrice);
  assert.equal(empty.reads, 1);
  const partial = harness(async () => [{ category: "distance", key: "perMileRate", value: 3 }]);
  const miles = config.DEFAULT_PRICING_CONFIG.distance.freeMiles + 2;
  assert.equal((await partial.service.calculatePrice({ ...input, distanceMiles: miles })).staticSubtotal,
    config.DEFAULT_PRICING_CONFIG.base.otherBasePrice + 6);
});

test("explicit cache invalidation performs another real read", async () => {
  const fixture = harness(async () => baseRow(70));
  await fixture.service.calculatePrice(input);
  fixture.setRead(async () => baseRow(90));
  fixture.service.clearPricingCache();
  assert.equal((await fixture.service.calculatePrice(input)).staticSubtotal, 90);
  assert.equal(fixture.reads, 2);
});

test("available date and time return the exact calendar price", async () => {
  const fixture = harness(async () => baseRow(80));
  const calendar = await fixture.service.calculatePrice(input);
  const expected = calendar.days[1].slots.find((slot) => slot.slot === "morning").price;
  assert.equal(await fixture.service.calculatePriceForSlot(input, dateAt(1), "morning"), expected);
  assert.equal(fixture.reads, 1);
});

test("past dates, dates outside the calendar and unknown slots never use the static subtotal", async () => {
  const fixture = harness(async () => baseRow(80));
  for (const date of [dateAt(-1), dateAt(14), dateAt(365)]) {
    await assert.rejects(() => fixture.service.calculatePriceForSlot(input, date, "morning"), /SELECTED_SLOT_UNAVAILABLE/);
  }
  await assert.rejects(() => fixture.service.calculatePriceForSlot(input, dateAt(1), "midnight"), /SELECTED_SLOT_UNAVAILABLE/);
});

test("invalid dates fail with the controlled slot error before loading configuration", async () => {
  const fixture = harness();
  await assert.rejects(() => fixture.service.calculatePriceForSlot(input, new Date("invalid"), "morning"), /SELECTED_SLOT_UNAVAILABLE/);
  assert.equal(fixture.reads, 0);
});

test("zero, negative and non-finite slot prices cannot verify a booking amount", async () => {
  for (const value of [0, -1, 1e308]) {
    const fixture = harness(async () => baseRow(value));
    await assert.rejects(() => fixture.service.calculatePriceForSlot(input, dateAt(1), "morning"), /SELECTED_SLOT_UNAVAILABLE/);
  }
});

function clockFixture(instant, rows = baseRow(100)) {
  const fixture = harness(async () => rows);
  fixture.advance(Date.parse(instant) - fixedTime);
  return fixture;
}

function assertCalendarContract(calendar, firstDate) {
  assert.equal(calendar.days.length, 14);
  assert.equal(calendar.days[0].date, firstDate);
  assert.equal(calendar.currency, "GBP");
  const dates = Array.from(calendar.days, (day) => day.date);
  assert.equal(new Set(dates).size, 14);
  for (let index = 0; index < calendar.days.length; index += 1) {
    const expectedDate = new Date(Date.parse(`${firstDate}T00:00:00Z`) + index * 86400000).toISOString().slice(0, 10);
    assert.equal(calendar.days[index].date, expectedDate);
    assert.deepEqual(Array.from(calendar.days[index].slots, (slot) => slot.slot), ["morning", "afternoon", "evening"]);
  }
}

test("BST midnight starts on the London date, rejects yesterday and keeps urgency aligned", async () => {
  const fixture = clockFixture("2026-09-21T23:30:00Z");
  const calendar = await fixture.service.calculatePrice(input);
  assertCalendarContract(calendar, "2026-09-22");
  assert.deepEqual(Array.from(calendar.days.slice(0, 4), (day) => day.slots.find((slot) => slot.slot === "afternoon").price), [140, 120, 110, 100]);
  await assert.rejects(() => fixture.service.calculatePriceForSlot(input, new Date("2026-09-21"), "morning"), /SELECTED_SLOT_UNAVAILABLE/);
  assert.equal(await fixture.service.calculatePriceForSlot(input, new Date("2026-09-22"), "afternoon"), 140);
});

test("calendar rolls over at London midnight even while configuration remains cached", async () => {
  const fixture = clockFixture("2026-09-21T22:59:00Z");
  assert.equal((await fixture.service.calculatePrice(input)).days[0].date, "2026-09-21");
  fixture.advance(2 * 60000);
  assertCalendarContract(await fixture.service.calculatePrice(input), "2026-09-22");
  assert.equal(fixture.reads, 1);
});

test("winter GMT does not apply a permanent one-hour offset", async () => {
  const fixture = clockFixture("2026-01-15T23:30:00Z");
  assertCalendarContract(await fixture.service.calculatePrice(input), "2026-01-15");
  fixture.advance(60 * 60000);
  assertCalendarContract(await fixture.service.calculatePrice(input), "2026-01-16");
});

test("London month and year rollovers preserve the existing ISO calendar dates", async () => {
  for (const [instant, expectedDate] of [
    ["2026-04-30T23:30:00Z", "2026-05-01"],
    ["2026-12-31T23:30:00Z", "2026-12-31"],
    ["2027-01-01T00:30:00Z", "2027-01-01"],
  ]) {
    assertCalendarContract(await clockFixture(instant).service.calculatePrice(input), expectedDate);
  }
});

test("weekend pricing follows the London civil day across BST midnight", async () => {
  const fixture = clockFixture("2026-05-01T23:30:00Z");
  const calendar = await fixture.service.calculatePrice(input);
  assertCalendarContract(calendar, "2026-05-02");
  assert.equal(calendar.days[0].slots.find((slot) => slot.slot === "afternoon").price, 161);
});

test("spring DST transition produces consecutive civil dates before and after the clock change", async () => {
  for (const [instant, expectedDate] of [
    ["2026-03-29T00:30:00Z", "2026-03-29"],
    ["2026-03-29T01:30:00Z", "2026-03-29"],
    ["2026-03-29T23:30:00Z", "2026-03-30"],
  ]) {
    assertCalendarContract(await clockFixture(instant).service.calculatePrice(input), expectedDate);
  }
});

test("autumn DST repeated hour and return to GMT preserve a single London civil date", async () => {
  for (const instant of ["2026-10-24T23:30:00Z", "2026-10-25T00:30:00Z", "2026-10-25T01:30:00Z", "2026-10-25T23:30:00Z"]) {
    assertCalendarContract(await clockFixture(instant).service.calculatePrice(input), "2026-10-25");
  }
});

const { errorHandler } = loadTs("apps/api/src/middleware/error.ts", { "@speedy-van/shared": shared });

test("real pricing route and middleware return 503 fail envelope when configuration is unavailable", async () => {
  const fixture = harness(async () => { throw new Error("Private database connection detail"); });
  const routes = loadTs("apps/api/src/routes/pricing.ts", {
    "@speedy-van/shared": shared, "../services/pricing.service": fixture.service,
  }).default;
  const app = new Hono();
  app.onError(errorHandler);
  app.route("/pricing", routes);
  const response = await app.request("/pricing/calculate", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.equal(body.code, "PRICING_CONFIG_UNAVAILABLE");
  assert.equal(typeof body.error, "string");
  assert.equal(Object.hasOwn(body, "data"), false);
  assert.equal(JSON.stringify(body).includes("Private database"), false);
});

test("real middleware returns 409 fail envelope for an unavailable slot", async () => {
  const fixture = harness();
  const app = new Hono();
  app.onError(errorHandler);
  app.get("/slot", async (context) => context.json(shared.ok(await fixture.service.calculatePriceForSlot(input, dateAt(-1), "morning"))));
  const response = await app.request("/slot");
  assert.equal(response.status, 409);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.equal(body.code, "SELECTED_SLOT_UNAVAILABLE");
  assert.equal(typeof body.error, "string");
  assert.equal(Object.hasOwn(body, "data"), false);
});

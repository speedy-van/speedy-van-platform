/* Source deployment and request-adapter checks; no live API or database calls. */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");
const vm = require("node:vm");
const { PassThrough } = require("node:stream");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");
const ts = require("typescript");
const { buildStandalone } = require("../apps/api/scripts/build-standalone.cjs");
const { buildServer } = require("../apps/api/scripts/build-server.cjs");

const root = path.resolve(__dirname, "..");
const apiRoot = path.join(root, "apps/api");
const compiled = ts.transpileModule(readFileSync(path.join(apiRoot, "src/handler.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

async function invokeHandler(url, method = "GET", body = null) {
  let observed;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: module.exports, module, URL, Request, Response, Buffer,
    require(name) {
      assert.equal(name, "./app");
      return { default: { async fetch(request) {
        observed = {
          url: request.url, method: request.method,
          signature: request.headers.get("stripe-signature"),
          body: Buffer.from(await request.arrayBuffer()),
        };
        return new Response("fixture response", { status: 202, headers: { "content-type": "text/plain" } });
      } }, __esModule: true };
    },
  });
  const req = new PassThrough();
  req.url = url; req.method = method;
  req.headers = { host: "api.example.invalid", "stripe-signature": "fixture-signature", "content-type": "application/json" };
  const headers = {};
  const res = { statusCode: 0, setHeader(name, value) { headers[name] = value; }, end(value) { this.body = value; } };
  const pending = module.exports.default(req, res);
  if (body) {
    req.write(body.subarray(0, 3)); req.end(body.subarray(3));
  } else req.end();
  await pending;
  return { observed, res, headers, config: module.exports.config };
}

(async () => {
  await test("Vercel builds a fresh source bundle behind its tracked bootstrap", () => {
    const config = JSON.parse(readFileSync(path.join(apiRoot, "vercel.json"), "utf8"));
    const pkg = JSON.parse(readFileSync(path.join(apiRoot, "package.json"), "utf8"));
    assert.equal(config.builds[0].src, "api-entry.cjs");
    assert.equal(config.routes[0].dest, "api-entry.cjs");
    assert.equal(config.installCommand, "npm ci --include=dev");
    assert.match(pkg.scripts["vercel-build"], /prisma generate/);
    assert.match(pkg.scripts["vercel-build"], /node scripts\/build-server\.cjs/);
    assert.doesNotMatch(JSON.stringify(config), /_api\.js/);
    assert.ok(config.builds[0].config.includeFiles.includes("../../node_modules/.prisma/client/**"));
    const module = { exports: {} };
    const handler = () => {};
    vm.runInNewContext(readFileSync(path.join(apiRoot, "api-entry.cjs"), "utf8"), {
      module,
      require(name) {
        assert.equal(name, "./dist/vercel/handler.cjs");
        return { default: handler };
      },
    });
    assert.equal(module.exports, handler);
    assert.equal(module.exports.config.api.bodyParser, false);
  });
  await test("the fresh Vercel handler starts on Node without TypeScript loaders or extension rewriting", async () => {
    const output = path.join(apiRoot, "dist/vercel-build-regression");
    try {
      await buildServer({ outputDirectory: output });
      const manifest = JSON.parse(await fs.readFile(path.join(output, "source-manifest.json"), "utf8"));
      assert.ok(manifest.sources["apps/api/src/lib/payment-validation.ts"]);
      assert.ok(manifest.sources["packages/db/src/index.ts"]);
      const start = spawnSync(process.execPath, ["-e", "const entry = require(process.argv[1]); if (typeof entry.default !== 'function' || entry.config.api.bodyParser !== false) process.exit(1);", path.join(output, "handler.cjs")], {
        encoding: "utf8",
        env: { PATH: process.env.PATH, NODE_ENV: "production" },
      });
      assert.equal(start.status, 0, start.stderr);
    } finally {
      await fs.rm(output, { recursive: true, force: true });
    }
  });
  await test("root API routes remain unchanged while exactly one /api segment is removed", async () => {
    for (const [input, expected] of [
      ["/health", "/health"], ["/booking/check?email=a%40example.invalid", "/booking/check?email=a%40example.invalid"],
      ["/api", "/"], ["/api/", "/"], ["/api?check=1", "/?check=1"],
      ["/api/health?x=a%2Fb&x=c", "/health?x=a%2Fb&x=c"],
      ["/api/api/health", "/api/health"], ["/apiary", "/apiary"],
    ]) {
      const result = await invokeHandler(input);
      assert.equal(result.observed.url, `https://api.example.invalid${expected}`);
      assert.equal(result.res.statusCode, 202);
    }
  });
  await test("webhook adapter preserves the signature, raw body, query and request method", async () => {
    const body = Buffer.from('{ "amount": 123.45, "currency": "GBP", "text": "£" }\n');
    const result = await invokeHandler("/api/stripe/webhook?fixture=1", "POST", body);
    assert.equal(result.observed.url, "https://api.example.invalid/stripe/webhook?fixture=1");
    assert.equal(result.observed.method, "POST");
    assert.equal(result.observed.signature, "fixture-signature");
    assert.deepEqual(result.observed.body, body);
    assert.equal(result.config.api.bodyParser, false);
    assert.equal(result.res.body.toString(), "fixture response");
  });
  await test("standalone packaging bundles current workspace source and pins installed runtime versions", async () => {
    const output = path.join(apiRoot, "dist/build-regression");
    try {
      await buildStandalone({ outputDirectory: output, generateLock: false });
      const manifest = JSON.parse(await fs.readFile(path.join(output, "source-manifest.json"), "utf8"));
      const pkg = JSON.parse(await fs.readFile(path.join(output, "package.json"), "utf8"));
      const bundle = await fs.readFile(path.join(output, "handler.js"), "utf8");
      for (const name of ["apps/api/src/handler.ts", "apps/api/src/lib/payment-validation.ts", "apps/api/src/services/booking.service.ts", "packages/db/src/index.ts", "packages/config/src/site.ts", "packages/shared/src/validations.ts"]) {
        assert.match(manifest.sources[name], /^[a-f0-9]{64}$/, name);
      }
      assert.ok(Object.keys(manifest.sources).every((name) => !name.endsWith("_api.js")));
      assert.match(bundle, /PAYMENT_MISMATCH/); assert.match(bundle, /BOOKING_CANCELLED/); assert.match(bundle, /isPaid: booking\.isPaid/);
      assert.doesNotMatch(bundle, /require\(["']@speedy-van\//);
      assert.ok(Object.values(pkg.dependencies).every((version) => /^\d+\.\d+\.\d+/.test(version)));
      assert.equal(pkg.optionalDependencies, undefined); assert.equal(pkg.engines.node, "24.x");
      assert.equal(await fs.readFile(path.join(output, "prisma/schema.prisma"), "utf8"), await fs.readFile(path.join(apiRoot, "prisma/schema.prisma"), "utf8"));
    } finally {
      await fs.rm(output, { recursive: true, force: true });
    }
  });
  await test("standalone build refuses to overwrite source directories", async () => {
    await assert.rejects(() => buildStandalone({ outputDirectory: path.join(apiRoot, "src"), generateLock: false }), /must be a child directory/);
  });
})().catch((error) => { console.error(error); process.exitCode = 1; });

/**
 * Exercise the installed Next.js title resolver and existing metadata helper
 * with the actual page export. No app rendering, network or new dependency.
 * Run: node --test scripts/seo-metadata-regression.cjs
 */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const webRequire = Module.createRequire(path.join(root, "apps/web/package.json"));
// Test-only use of the resolver shipped in the application's pinned Next build.
const { resolveTitle } = webRequire("next/dist/lib/metadata/resolvers/resolve-title");
const cache = new Map();

function sourceModule(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    fileName: filename,
  });
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, loaded);
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (specifier) => {
    const base = specifier === "@speedy-van/config"
      ? path.join(root, "packages/config/src/index")
      : specifier.startsWith("@/")
        ? path.join(root, "apps/web/src", specifier.slice(2))
        : specifier.startsWith(".") ? path.resolve(path.dirname(filename), specifier) : null;
    if (base) {
      const source = [base, `${base}.ts`, path.join(base, "index.ts")].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (source && source.endsWith(".ts")) return sourceModule(source);
    }
    return originalRequire(specifier);
  };
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}

function metadataInitialiser(relativePath) {
  const filename = path.join(root, relativePath);
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true);
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const exported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(source) === "metadata" && declaration.initializer) return declaration.initializer;
    }
  }
  throw new Error(`Expected exported metadata in ${relativePath}; update the regression loader if this API changes.`);
}

function property(object, name) {
  assert.ok(ts.isObjectLiteralExpression(object), `${name}: expected an object literal`);
  const match = object.properties.find((entry) => ts.isPropertyAssignment(entry) && entry.name.getText().replace(/^["']|["']$/g, "") === name);
  assert.ok(match, `Missing metadata property: ${name}`);
  return match.initializer;
}

function stringValue(node) {
  assert.ok(ts.isStringLiteral(node), "Expected a literal root title template");
  return node.text;
}

const rootMetadata = metadataInitialiser("apps/web/src/app/layout.tsx");
const pageInitialiser = metadataInitialiser("apps/web/src/app/(site)/services/european-removals/page.tsx");
const template = stringValue(property(property(rootMetadata, "title"), "template"));
const { buildPageMetadata } = sourceModule(path.join(root, "apps/web/src/lib/seo/metadata.ts"));
// Evaluate only the inspected metadata expression, without loading page/client components.
const pageMetadata = Function("buildPageMetadata", `return (${pageInitialiser.getText()});`)(buildPageMetadata);
const brandCount = (value) => (value.match(/\bspeedy\s*van\b/gi) || []).length;

test("European document title resolves to one business label under the actual root template", () => {
  const resolved = resolveTitle(pageMetadata.title, template);
  assert.equal(brandCount(resolved.absolute), 1, `Repeated business label in emitted title: ${resolved.absolute}`);
  assert.match(resolved.absolute, /^European Removals from Scotland\s*\|\s*SpeedyVan$/);
});

test("European sharing metadata stays page-specific and uses the canonical page URL", () => {
  assert.equal(pageMetadata.twitter.title, pageMetadata.openGraph.title);
  assert.match(pageMetadata.twitter.title, /^European Removals from Scotland/);
  assert.equal(brandCount(pageMetadata.twitter.title), 1);
  assert.equal(pageMetadata.twitter.description, pageMetadata.description);
  assert.equal(pageMetadata.openGraph.description, pageMetadata.description);
  assert.equal(pageMetadata.openGraph.url, pageMetadata.alternates.canonical);
  assert.equal(new URL(pageMetadata.alternates.canonical).pathname, "/services/european-removals");
});

test("the title guard recognises both existing business-label spellings", () => {
  assert.equal(brandCount("European Removals | Speedy Van | SpeedyVan"), 2);
  assert.equal(brandCount("European Removals | SpeedyVan"), 1);
});

test("actual host middleware leaves API and mutation contracts unredirected without network probes", () => {
  const { NextRequest } = webRequire("next/server");
  const { middleware } = sourceModule(path.join(root, "apps/web/src/middleware.ts"));
  for (const host of ["speedyvan.uk", "speedy-van.co.uk", "www.speedy-van.co.uk"]) {
    for (const pathname of ["/api", "/api/qa-no-handler"]) {
      const response = middleware(new NextRequest(`https://${host}${pathname}`, { headers: { host } }));
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("x-middleware-next"), "1");
    }
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      const response = middleware(new NextRequest(`https://${host}/qa-no-handler`, { method, headers: { host } }));
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("x-middleware-next"), "1");
    }
  }
});

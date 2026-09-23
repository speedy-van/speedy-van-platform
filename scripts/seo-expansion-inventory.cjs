const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const cache = new Map();

/** Load pure TypeScript registries with the project's existing compiler. */
function loadSource(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, loaded);
  const fallback = loaded.require.bind(loaded);
  loaded.require = (specifier) => {
    const base = specifier === "@speedy-van/config" ? path.join(root, "packages/config/src/index")
      : specifier.startsWith("@/") ? path.join(root, "apps/web/src", specifier.slice(2))
      : specifier.startsWith(".") ? path.resolve(path.dirname(filename), specifier) : null;
    if (base) {
      const source = [base, `${base}.ts`, path.join(base, "index.ts")].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (source?.endsWith(".ts")) return loadSource(source);
    }
    return fallback(specifier);
  };
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), { fileName: filename, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}

function readContent() {
  return {
    areas: loadSource("apps/web/src/lib/areas.ts").AREAS,
    services: loadSource("apps/web/src/lib/services.ts").SERVICES,
    localServices: loadSource("apps/web/src/lib/content/city-service-pages.ts").LOCAL_SERVICE_PAGES,
    routes: loadSource("apps/web/src/lib/content/moving-route-pages.ts").MOVING_ROUTE_PAGES,
    sitemap: loadSource("apps/web/src/app/sitemap.ts").default(),
  };
}

function inventory() {
  const { areas, localServices, routes, sitemap } = readContent();
  return {
    requestedTotal: 3500,
    implementedTotal: sitemap.length,
    remainingToResearchAndReview: 3500 - sitemap.length,
    milestones: [250, 1000, 3500],
    scope: "Collections in Scotland; destinations throughout Britain. Named pages are planning guides, not a real-time availability claim.",
    evidenceLimits: "No measured search demand, Google indexing, local driver allocation, completed jobs or reviews are inferred from this inventory.",
    counts: { areas: areas.length, localServices: localServices.length, routes: routes.length },
    pages: sitemap.map(({ url }) => {
      const pathname = new URL(url).pathname;
      const area = areas.find((entry) => pathname === `/areas/${entry.slug}`);
      const localService = localServices.find((entry) => pathname === `/areas/${entry.areaSlug}/${entry.serviceSlug}`);
      const route = routes.find((entry) => pathname === `/moving-routes/${entry.slug}`);
      const sections = area?.moveAdvice ?? localService?.sections ?? route?.sections ?? [];
      return { path: pathname, canonical: url, kind: area ? "area" : localService ? "city-service" : route ? "moving-route" : pathname === "/moving-routes" ? "route-hub" : "existing", sources: [...new Set(sections.flatMap((section) => section.source ? [section.source.href] : []))] };
    }),
  };
}

module.exports = { loadSource, readContent, inventory };
if (require.main === module) {
  const data = inventory();
  if (process.argv.includes("--write")) {
    const destination = path.join(root, "docs/seo/scotland-expansion-inventory-2026-09-23.json");
    fs.writeFileSync(destination, JSON.stringify(data, null, 2) + "\n");
  }
  console.log(JSON.stringify({ implemented: data.implementedTotal, remaining: data.remainingToResearchAndReview, counts: data.counts }));
}

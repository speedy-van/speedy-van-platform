"""Assert public HTML and crawl controls against a running local production build.

No browser, credentials, database, analytics or payment requests are used.
Run: python scripts/seo-local-qa.py --base-url http://localhost:3002
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener
from xml.etree import ElementTree

PRIMARY = "https://www.speedyvan.uk"
CORE = [
    "man-and-van", "furniture-delivery", "house-removal", "flat-removals",
    "office-removal", "small-moves", "student-move", "long-distance-removals",
]
PRIVATE = ["/book", "/book/review/QA-NONEXISTENT", "/auth/login", "/driver/login", "/track", "/jobs"]


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        return None


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.h1s = []
        self.canonicals = []
        self.meta = {}
        self.links = set()
        self.main_links = set()
        self.ids = []
        self._main = False
        self.schemas = []
        self.schema_errors = []
        self._title = False
        self._h1 = False
        self._json = False
        self._buffer = ""
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self._main = True
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "title":
            self._title = True
        if tag == "h1":
            self._h1 = True
            self.h1s.append("")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta":
            key = attrs.get("name", attrs.get("property", ""))
            self.meta.setdefault(key, []).append(attrs.get("content", ""))
        if tag == "a" and attrs.get("href"):
            self.links.add(attrs["href"])
            if self._main:
                self.main_links.add(attrs["href"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._json = True
            self._buffer = ""

    def handle_data(self, data):
        if self._title:
            self.title += data
        if self._h1:
            self.h1s[-1] += data
        if self._json:
            self._buffer += data

    def handle_endtag(self, tag):
        if tag == "main":
            self._main = False
        if tag == "title":
            self._title = False
        if tag == "h1":
            self._h1 = False
        if tag == "script" and self._json:
            try:
                self.schemas.append(json.loads(self._buffer))
            except json.JSONDecodeError as error:
                self.schema_errors.append(str(error))
            self._json = False


def schema_nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from schema_nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from schema_nodes(child)


def source_inventory():
    """Read the actual pure source modules without installing, building or writing files."""
    root = Path(__file__).resolve().parent.parent
    node_script = r"""
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = process.cwd();
const cache = new Map();
function load(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }, fileName: filename,
  });
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
      if (source && source.endsWith(".ts")) return load(source);
    }
    return fallback(specifier);
  };
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}
const web = path.join(root, "apps/web/src");
const sitemap = load(path.join(web, "app/sitemap.ts")).default();
const { AREAS } = load(path.join(web, "lib/areas.ts"));
const { SERVICES } = load(path.join(web, "lib/services.ts"));
process.stdout.write(JSON.stringify({
  urls: sitemap.map((entry) => entry.url),
  area_paths: AREAS.map((area) => `/areas/${area.slug}`),
  service_paths: SERVICES.filter((service) => service.indexable !== false).map((service) => `/services/${service.slug}`),
}));
"""
    result = subprocess.run(["node", "-e", node_script], cwd=root, capture_output=True, text=True, timeout=30, check=True)
    return json.loads(result.stdout)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://localhost:3002")
    parser.add_argument("--output", help="Optional JSON evidence path")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    if urlparse(base).hostname not in {"localhost", "127.0.0.1", "::1"}:
        parser.error("This initial-HTML regression is local-only; use the read-only public crawl for live evidence.")
    expected = source_inventory()
    results = []
    pages = {}
    transport_errors = []

    def fetch(path, host=None, method="GET"):
        headers = {"User-Agent": "Local-SEO-Regression/1.0"}
        if host:
            headers["Host"] = host
        request = Request(base + path, headers=headers, method=method)
        for attempt in range(2):
            try:
                try:
                    response = build_opener(NoRedirect()).open(request, timeout=30)
                except HTTPError as error:
                    response = error
                with response:
                    return response.status, response.headers, response.read().decode("utf-8", errors="replace")
            except (URLError, TimeoutError, ConnectionError) as error:
                if attempt == 1:
                    transport_errors.append({"path": path, "error": str(error), "attempts": 2})
                    return 0, {}, ""

    def check(name, condition):
        results.append({"check": name, "passed": bool(condition)})

    status, _, sitemap = fetch("/sitemap.xml")
    check("Sitemap returns HTTP 200", status == 200)
    try:
        root = ElementTree.fromstring(sitemap)
    except ElementTree.ParseError:
        evidence = {"checked_at": datetime.now(timezone.utc).isoformat(), "base_url": base,
                    "scope": "Incomplete: sitemap could not be read", "passed": 0,
                    "failed": ["Sitemap could not be read"], "transport_errors": transport_errors}
        if args.output:
            with open(args.output, "w", encoding="utf-8") as output:
                json.dump(evidence, output, indent=2)
                output.write("\n")
        print(json.dumps(evidence, indent=2))
        return 1
    urls = [element.text for element in root.findall("{*}url/{*}loc")]
    check("Sitemap contains the actual source URLs without duplicates", bool(urls) and len(urls) == len(set(urls)) and set(urls) == set(expected["urls"]))
    check("Source sitemap has no duplicate URL definitions", len(expected["urls"]) == len(set(expected["urls"])))
    check("Sitemap contains only canonical HTTPS URLs", all(url and url.startswith(PRIMARY + "/") or url == PRIMARY for url in urls))
    check("Sitemap has no fabricated lastmod dates", not root.findall("{*}url/{*}lastmod"))
    check("Sitemap excludes private and unsupported routes", not any(any(part in urlparse(url).path.split("/") for part in ["book", "auth", "driver", "admin", "track", "jobs", "api", "rubbish-removal"]) for url in urls))
    paths = [urlparse(url).path or "/" for url in urls]
    with ThreadPoolExecutor(max_workers=4) as executor:
        responses = dict(zip(paths, executor.map(fetch, paths)))
    for url in urls:
        path = urlparse(url).path or "/"
        status, headers, body = responses[path]
        page = Page(body)
        pages[path] = page
        canonical = PRIMARY if path == "/" else PRIMARY + path
        check(f"{path}: canonical public HTTP 200", status == 200 and page.canonicals == [canonical])
        check(f"{path}: useful initial HTML H1", len(page.h1s) == 1 and len(page.h1s[0].strip()) > 5)
        check(f"{path}: indexable in HTML and HTTP headers", "noindex" not in headers.get("X-Robots-Tag", "") and "noindex" not in ",".join(page.meta.get("robots", [])))
        check(f"{path}: title has one business label across spelling variants", len(re.findall(r"\bspeedy\s*van\b", page.title, re.IGNORECASE)) == 1)
        check(f"{path}: structured data syntax is valid when present", not page.schema_errors)
        check(f"{path}: page-specific Open Graph URL", page.meta.get("og:url") == [canonical])
        check(f"{path}: useful description", any(len(value) >= 40 for value in page.meta.get("description", [])))
        check(f"{path}: no internal SEO instructions", not any(text in body for text in ["one strong service page", "keyword stuffing", "search intent cluster"]))
        if path.startswith("/services/") or path.startswith("/areas/"):
            check(f"{path}: parseable structured data", bool(page.schemas))

    empty_page = Page("")
    home = pages.get("/", empty_page)
    service_hub = pages.get("/services", empty_page)
    area_hub = pages.get("/areas", empty_page)
    for slug in CORE:
        path = f"/services/{slug}"
        page = pages.get(path, empty_page)
        check(f"{path}: linked from home and service hub", path in home.links and path in service_hub.links)
        check(f"{path}: crawlable booking action", any(link.startswith("/book?") for link in page.links))
        service_nodes = [node for schema in page.schemas for node in schema_nodes(schema) if node.get("@type") == "Service"]
        check(f"{path}: canonical Service entity", any(node.get("@id") == PRIMARY + path + "#service" for node in service_nodes))
    area_paths = [path for path in pages if path.startswith("/areas/")]
    check("Every configured area is in the sitemap and linked from the area hub", set(area_paths) == set(expected["area_paths"]) and all(path in area_hub.links for path in expected["area_paths"]))
    check("Every configured indexable service is in the sitemap and linked from the service hub", all(path in pages and path in service_hub.links for path in expected["service_paths"]))
    hourly_nodes = [node for schema in pages.get("/services/man-and-van", empty_page).schemas for node in schema_nodes(schema)]
    check("Hourly service schema includes GBP per-hour unit", any(node.get("@type") == "UnitPriceSpecification" and node.get("unitCode") == "HUR" and node.get("priceCurrency") == "GBP" for node in hourly_nodes))
    home_nodes = [node for schema in home.schemas for node in schema_nodes(schema)]
    check("Homepage WebSite has stable entity ID", any(node.get("@type") == "WebSite" and node.get("@id") == PRIMARY + "/#website" for node in home_nodes))

    choice_path = "/guides/man-and-van-or-house-removals"
    choice = pages.get(choice_path, empty_page)
    guides = pages.get("/guides", empty_page)
    pricing = pages.get("/pricing", empty_page)
    check("Guide hub and comparison guide link to each other in main content", choice_path in guides.main_links and "/guides" in choice.main_links)
    check("Guide hub is discoverable from the homepage", "/guides" in home.links)
    for path in ["/pricing", "/areas/aberdeen", "/areas/inverness"] + [f"/services/{slug}" for slug in CORE]:
        check(f"{path}: contextual comparison guide link", choice_path in pages.get(path, empty_page).main_links)
    for path in ["/guides", choice_path]:
        page = pages.get(path, empty_page)
        check(f"{path}: quote entry preserves the existing draft URL", "/book" in page.main_links and not any(link.startswith("/book?") for link in page.main_links))
        check(f"{path}: comparison resources reach both cities and pricing", all(link in page.main_links for link in ["/areas/aberdeen", "/areas/inverness", "/pricing"]))
        breadcrumbs = [node for schema in page.schemas for node in schema_nodes(schema) if node.get("@type") == "BreadcrumbList"]
        check(f"{path}: breadcrumb ends on the canonical guide", any(node.get("itemListElement", [{}])[-1].get("item") == PRIMARY + path for node in breadcrumbs))
    for city in ["aberdeen", "inverness"]:
        target = f"/pricing#{city}"
        check(f"{city}: local pricing link reaches a unique section", pricing.ids.count(city) == 1 and target in choice.main_links and target in pages.get(f"/areas/{city}", empty_page).main_links)
        check(f"{city}: pricing links back to the local guide", f"/areas/{city}" in pricing.main_links)
        city_page = pages.get(f"/areas/{city}", empty_page)
        section_links = [link[1:] for link in city_page.main_links if link.startswith("#")]
        check(f"{city}: guide navigation reaches unique section headings", bool(section_links) and all(city_page.ids.count(target_id) == 1 for target_id in section_links))
        check(f"{city}: commercial quote actions preserve draft entry", "/book" in city_page.main_links and not any(link.startswith("/book?") for link in city_page.main_links))

    for slug in ["man-and-van", "house-removal", "furniture-delivery", "office-removal", "long-distance-removals", "same-day-delivery"]:
        page = pages.get(f"/services/{slug}", empty_page)
        check(f"{slug}: search and sharing titles remain aligned", bool(page.title) and page.meta.get("og:title") == [page.title] and page.meta.get("twitter:title") == [page.title])

    for path in ["/services/qa-invalid-service", "/areas/qa-invalid-area", "/guides/qa-invalid-guide", "/qa-not-a-page"]:
        status, _, body = fetch(path)
        page = Page(body)
        check(f"{path}: real 404 with noindex", status == 404 and "noindex" in ",".join(page.meta.get("robots", [])))
        check(f"{path}: no inherited canonical on an unknown route", not page.canonicals)
    for path in PRIVATE:
        status, headers, body = fetch(path)
        page = Page(body)
        check(f"{path}: private HTML remains noindex", status == 200 and "noindex" in headers.get("X-Robots-Tag", "") and "noindex" in ",".join(page.meta.get("robots", [])))
        check(f"{path}: no inherited public canonical", not page.canonicals)
    status, _, robots = fetch("/robots.txt")
    check("Robots permits reading HTML noindex and names canonical sitemap", status == 200 and f"Sitemap: {PRIMARY}/sitemap.xml" in robots and "Disallow: /book" not in robots and "Disallow: /admin" not in robots and "Disallow: /api/" in robots)

    if urlparse(base).hostname in {"localhost", "127.0.0.1", "::1"}:
        for host in ["speedyvan.uk", "speedy-van.co.uk", "www.speedy-van.co.uk"]:
            for path in ["/services/man-and-van?utm_source=qa&ref=a%2Fb", "/areas/glasgow", "/privacy", "/book?service=house-removals&utm_source=qa"]:
                for method in ["GET", "HEAD"]:
                    status, headers, _ = fetch(path, host, method)
                    check(f"{host} {method} {path}: one permanent redirect preserving path/query", status == 308 and headers.get("Location") == PRIMARY + path)
            status, headers, _ = fetch("/api/qa-no-handler", host)
            check(f"{host}: API host bypass", status not in {301, 302, 307, 308} and "Location" not in headers)
            # Mutation methods are exercised in memory by seo-metadata-regression.cjs.
            # This HTTP harness never sends a POST or submits a private form.
        _, headers, _ = fetch("/services", "qa-preview.vercel.app")
        check("Preview host gets HTTP noindex", "noindex" in headers.get("X-Robots-Tag", ""))
        _, headers, _ = fetch("/bookish", "www.speedyvan.uk")
        check("Private-route boundary does not include /bookish", "X-Robots-Tag" not in headers)

    evidence = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "base_url": base,
        "scope": "Local GET/HEAD and initial HTML only; no writes, browser interaction, field-performance or provider-payment claim",
        "source_inventory": {"expected_urls": len(expected["urls"]), "configured_areas": len(expected["area_paths"]), "configured_indexable_services": len(expected["service_paths"])},
        "passed": sum(result["passed"] for result in results),
        "failed": [result["check"] for result in results if not result["passed"]],
        "pages": [{"path": path, "canonical": page.canonicals, "title": page.title, "h1": page.h1s} for path, page in pages.items()],
        "checks": results,
        "transport_errors": transport_errors,
        "transport_policy": "At most four concurrent public-page requests; one retry for transport errors only. HTTP error responses are not retried.",
    }
    if args.output:
        with open(args.output, "w", encoding="utf-8") as output:
            json.dump(evidence, output, indent=2)
            output.write("\n")
    print(json.dumps({key: evidence[key] for key in ["scope", "passed", "failed"]}, indent=2))
    return 1 if evidence["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())

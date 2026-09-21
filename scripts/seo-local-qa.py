"""Assert public HTML and crawl controls against a running local production build.

No browser, credentials, database, analytics or payment requests are used.
Run: python scripts/seo-local-qa.py --base-url http://localhost:3002
"""
import argparse
import json
import sys
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
    "office-removal", "small-moves", "long-distance-removals",
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
        self.schemas = []
        self._title = False
        self._h1 = False
        self._json = False
        self._buffer = ""
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
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
        if tag == "title":
            self._title = False
        if tag == "h1":
            self._h1 = False
        if tag == "script" and self._json:
            self.schemas.append(json.loads(self._buffer))
            self._json = False


def schema_nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from schema_nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from schema_nodes(child)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://localhost:3002")
    parser.add_argument("--output", help="Optional JSON evidence path")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
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
    check("Sitemap contains the 47 intended pages without duplicates", len(urls) == 47 and len(set(urls)) == 47)
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
        check(f"{path}: title has one brand suffix", page.title.count("SpeedyVan") == 1)
        check(f"{path}: page-specific Open Graph URL", page.meta.get("og:url") == [canonical])
        check(f"{path}: useful description", any(len(value) >= 40 for value in page.meta.get("description", [])))
        check(f"{path}: no internal SEO instructions", not any(text in body for text in ["one strong service page", "keyword stuffing", "search intent cluster"]))
        if path.startswith("/services/") or path.startswith("/areas/"):
            check(f"{path}: parseable structured data", bool(page.schemas))

    for slug in CORE:
        path = f"/services/{slug}"
        check(f"{path}: linked from home and service hub", path in pages["/"].links and path in pages["/services"].links)
        check(f"{path}: crawlable booking action", any(link.startswith("/book?") for link in pages[path].links))
        service_nodes = [node for schema in pages[path].schemas for node in schema_nodes(schema) if node.get("@type") == "Service"]
        check(f"{path}: canonical Service entity", any(node.get("@id") == PRIMARY + path + "#service" for node in service_nodes))
    area_paths = [path for path in pages if path.startswith("/areas/")]
    check("All 27 existing area pages linked from area hub", len(area_paths) == 27 and all(path in pages["/areas"].links for path in area_paths))
    hourly_nodes = [node for schema in pages["/services/man-and-van"].schemas for node in schema_nodes(schema)]
    check("Hourly service schema includes GBP per-hour unit", any(node.get("@type") == "UnitPriceSpecification" and node.get("unitCode") == "HUR" and node.get("priceCurrency") == "GBP" for node in hourly_nodes))
    home_nodes = [node for schema in pages["/"].schemas for node in schema_nodes(schema)]
    check("Homepage WebSite has stable entity ID", any(node.get("@type") == "WebSite" and node.get("@id") == PRIMARY + "/#website" for node in home_nodes))

    for path in ["/services/qa-invalid-service", "/areas/qa-invalid-area", "/qa-not-a-page"]:
        status, _, body = fetch(path)
        page = Page(body)
        check(f"{path}: real 404 with noindex", status == 404 and "noindex" in ",".join(page.meta.get("robots", [])))
    for path in PRIVATE:
        status, headers, body = fetch(path)
        page = Page(body)
        check(f"{path}: private HTML remains noindex", status == 200 and "noindex" in headers.get("X-Robots-Tag", "") and "noindex" in ",".join(page.meta.get("robots", [])))
        check(f"{path}: no inherited public canonical", not page.canonicals)
    status, _, robots = fetch("/robots.txt")
    check("Robots permits reading HTML noindex and names canonical sitemap", status == 200 and f"Sitemap: {PRIMARY}/sitemap.xml" in robots and "Disallow: /book" not in robots and "Disallow: /admin" not in robots and "Disallow: /api/" in robots)

    if urlparse(base).hostname in {"localhost", "127.0.0.1", "::1"}:
        for host in ["speedyvan.uk", "speedy-van.co.uk", "www.speedy-van.co.uk"]:
            for method in ["GET", "HEAD"]:
                path = "/services/man-and-van?utm_source=qa&ref=a%2Fb"
                status, headers, _ = fetch(path, host, method)
                check(f"{host} {method}: one permanent redirect preserving path/query", status == 308 and headers.get("Location") == PRIMARY + path)
            status, headers, _ = fetch("/api/qa-no-handler", host)
            check(f"{host}: API host bypass", status not in {301, 302, 307, 308} and "Location" not in headers)
            status, headers, _ = fetch("/qa-no-handler", host, "POST")
            check(f"{host}: non-GET host bypass", status not in {301, 302, 307, 308} and "Location" not in headers)
        _, headers, _ = fetch("/services", "qa-preview.vercel.app")
        check("Preview host gets HTTP noindex", "noindex" in headers.get("X-Robots-Tag", ""))
        _, headers, _ = fetch("/bookish", "www.speedyvan.uk")
        check("Private-route boundary does not include /bookish", "X-Robots-Tag" not in headers)

    evidence = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "base_url": base,
        "scope": "HTTP and initial HTML only; no visual, JavaScript, field-performance or provider-payment claim",
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

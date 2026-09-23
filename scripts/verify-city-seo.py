"""Check city SEO locally, or on the primary production origin when requested."""

import argparse
import json
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, build_opener
from xml.etree import ElementTree


PRIMARY = "https://www.speedyvan.uk"
DEFAULT_BASE = "http://localhost:3002"


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.canonicals = []
        self.links = []
        self.main_links = []
        self.footer_links = []
        self.meta = {}
        self.robots = []
        self.main_depth = 0
        self.footer_depth = 0
        self.faq_count = 0
        self.headings = []
        self.title = ""
        self.schemas = []
        self.ids = []
        self.capture = None
        self.buffer = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.main_depth += 1
        if tag == "footer":
            self.footer_depth += 1
        if tag == "details" and self.main_depth and not self.footer_depth:
            self.faq_count += 1
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "a":
            href = attrs.get("href", "")
            self.links.append(href)
            if self.footer_depth:
                self.footer_links.append(href)
            elif self.main_depth:
                self.main_links.append(href)
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content", "")
            if attrs.get("name") in ("robots", "googlebot"):
                self.robots.append(attrs.get("content", "").lower())
        if tag in ("title", "h1") or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.capture = tag
            self.buffer = []

    def handle_data(self, data):
        if self.capture:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "main":
            self.main_depth = max(0, self.main_depth - 1)
        if tag == "footer":
            self.footer_depth = max(0, self.footer_depth - 1)
        if tag != self.capture:
            return
        value = "".join(self.buffer)
        if tag == "title":
            self.title = value
        elif tag == "h1":
            self.headings.append(value)
        else:
            schema = json.loads(value)
            self.schemas.extend(schema if isinstance(schema, list) else [schema])
        self.capture = None


class NoRedirect(HTTPRedirectHandler):
    """Do not follow redirects outside the selected origin or hide route changes."""

    def redirect_request(self, request, response, code, message, headers, new_url):
        return None


def resolve_base(base=None, production=False):
    if production:
        if base not in (None, PRIMARY, PRIMARY + "/"):
            raise ValueError("--production is restricted to " + PRIMARY)
        return PRIMARY

    base = base or DEFAULT_BASE
    parsed = urlparse(base)
    if (parsed.scheme not in {"http", "https"}
            or parsed.hostname not in {"localhost", "127.0.0.1", "::1"}
            or parsed.username is not None or parsed.password is not None
            or parsed.path not in {"", "/"} or parsed.query or parsed.fragment):
        raise ValueError("Use a localhost HTTP(S) origin, or --production for " + PRIMARY)
    # Accessing port also rejects malformed or out-of-range values before any request.
    _ = parsed.port
    return base.rstrip("/")


def fetch(base, path):
    try:
        response = build_opener(NoRedirect()).open(base + path, timeout=30)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read().decode("utf-8"), response.geturl()


def verify(base=None, production=False):
    base = resolve_base(base, production)
    checked_at = datetime.now(timezone.utc).isoformat()
    primary = PRIMARY
    services = ["man-and-van", "furniture-delivery", "house-removal", "flat-removals", "office-removal", "small-moves", "long-distance-removals", "student-move"]
    results = []
    for city in ("inverness", "aberdeen"):
        path = "/areas/" + city
        status, headers, html, final_url = fetch(base, path)
        page = Page(html)
        assert status == 200, (path, status)
        assert page.canonicals == [primary + path], (path, page.canonicals)
        assert page.meta["og:url"] == primary + path
        assert page.title.count("SpeedyVan") == 1, page.title
        assert page.title == page.meta["og:title"] == page.meta["twitter:title"]
        assert len(page.headings) == 1 and city.title() in page.headings[0]
        assert not any("noindex" in directive for directive in page.robots)
        assert "noindex" not in headers.get("X-Robots-Tag", "").lower()
        assert len(page.ids) == len(set(page.ids)), "Duplicate HTML IDs"
        assert "/book" in page.main_links and "tel:07909032889" in page.main_links, (path, "Missing main quote/contact link")
        assert "/pricing" in page.main_links, (path, "Missing main pricing link")
        assert all("/services/" + service in page.main_links for service in services), (path, "Missing main service link")
        service_schema = next(s for s in page.schemas if s.get("@type") == "Service")
        assert service_schema["@id"] == primary + path + "#service"
        assert service_schema["provider"]["@id"] == primary + "/#organization"
        assert service_schema["areaServed"] == {"@type": "City", "name": city.title()}
        assert "offers" not in service_schema and "address" not in service_schema["provider"]
        breadcrumb = next(s for s in page.schemas if s.get("@type") == "BreadcrumbList")
        assert breadcrumb["itemListElement"][-1]["item"] == primary + path
        assert page.faq_count == 4
        results.append({"path": path, "status": status, "final_url": final_url, "title": page.title, "canonical": page.canonicals[0], "service_links": len(services), "link_scope": "main", "quote_and_pricing_links": "present in main", "faq_count": 4, "schema": "Service and BreadcrumbList pass"})

    for path in ["/"] + ["/services/" + service for service in services]:
        status, _, html, final_url = fetch(base, path)
        page = Page(html)
        assert status == 200, (path, status)
        links = page.links if path == "/" else page.main_links
        assert all("/areas/" + city in links for city in ("inverness", "aberdeen")), (path, "Missing contextual city link")
        results.append({"path": path, "status": status, "final_url": final_url, "city_links": "both present", "link_scope": "document" if path == "/" else "main"})

    for path in ("/areas/city-seo-invalid-slug", "/services/city-seo-invalid-slug"):
        status, _, html, final_url = fetch(base, path)
        assert status == 404, (path, status)
        assert any("noindex" in directive for directive in Page(html).robots), path
        results.append({"path": path, "status": status, "final_url": final_url, "robots": "noindex"})

    status, _, html, final_url = fetch(base, "/book")
    assert status == 200 and any("noindex" in directive for directive in Page(html).robots)
    results.append({"path": "/book", "status": status, "final_url": final_url, "robots": "noindex"})

    status, _, xml, final_url = fetch(base, "/sitemap.xml")
    assert status == 200
    urls = [node.text for node in ElementTree.fromstring(xml).iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert len(urls) == len(set(urls))
    for city in ("inverness", "aberdeen"):
        assert urls.count(primary + "/areas/" + city) == 1
    results.append({"path": "/sitemap.xml", "status": status, "final_url": final_url, "url_count": len(urls), "city_entries": "once each"})
    status, _, robots, final_url = fetch(base, "/robots.txt")
    assert status == 200 and primary + "/sitemap.xml" in robots
    assert "Disallow: /areas" not in robots
    results.append({"path": "/robots.txt", "status": status, "final_url": final_url, "city_crawling": "allowed"})
    return {"checked_at_utc": checked_at, "base": base, "mode": "production" if production else "local", "result": "PASS", "checks": results, "limits": "GET and initial HTML checks only; redirects are not followed. No payment, database mutation, browser interaction or field performance measurement."}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", help="Local HTTP(S) origin; defaults to " + DEFAULT_BASE)
    parser.add_argument("--production", action="store_true", help="Explicitly check only " + PRIMARY)
    args = parser.parse_args()
    try:
        base = resolve_base(args.base, args.production)
    except ValueError as error:
        parser.error(str(error))
    print(json.dumps(verify(base, args.production), indent=2))

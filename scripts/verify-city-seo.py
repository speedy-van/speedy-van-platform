"""Check rendered city SEO against a locally running production build."""

import argparse
import json
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import urlparse
from urllib.request import urlopen
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.canonicals = []
        self.links = []
        self.meta = {}
        self.robots = []
        self.in_main = False
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
            self.in_main = True
        if tag == "details" and self.in_main:
            self.faq_count += 1
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "a":
            self.links.append(attrs.get("href", ""))
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
            self.in_main = False
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


def fetch(base, path):
    try:
        response = urlopen(base + path, timeout=30)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read().decode("utf-8")


def verify(base):
    primary = "https://www.speedyvan.uk"
    services = ["man-and-van", "furniture-delivery", "house-removal", "flat-removals", "office-removal", "small-moves", "long-distance-removals", "student-move"]
    results = []
    for city in ("inverness", "aberdeen"):
        path = "/areas/" + city
        status, headers, html = fetch(base, path)
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
        assert "/book" in page.links and "tel:07909032889" in page.links
        assert "/pricing" in page.links
        assert all("/services/" + service in page.links for service in services)
        service_schema = next(s for s in page.schemas if s.get("@type") == "Service")
        assert service_schema["@id"] == primary + path + "#service"
        assert service_schema["provider"]["@id"] == primary + "/#organization"
        assert service_schema["areaServed"] == {"@type": "City", "name": city.title()}
        assert "offers" not in service_schema and "address" not in service_schema["provider"]
        breadcrumb = next(s for s in page.schemas if s.get("@type") == "BreadcrumbList")
        assert breadcrumb["itemListElement"][-1]["item"] == primary + path
        assert page.faq_count == 4
        results.append({"path": path, "status": status, "title": page.title, "canonical": page.canonicals[0], "service_links": len(services), "faq_count": 4, "schema": "Service and BreadcrumbList pass"})

    for path in ["/"] + ["/services/" + service for service in services]:
        status, _, html = fetch(base, path)
        page = Page(html)
        assert status == 200, (path, status)
        assert all("/areas/" + city in page.links for city in ("inverness", "aberdeen")), path
        results.append({"path": path, "status": status, "city_links": "both present"})

    for path in ("/areas/city-seo-invalid-slug", "/services/city-seo-invalid-slug"):
        status, _, html = fetch(base, path)
        assert status == 404, (path, status)
        assert any("noindex" in directive for directive in Page(html).robots), path
        results.append({"path": path, "status": status, "robots": "noindex"})

    status, _, html = fetch(base, "/book")
    assert status == 200 and any("noindex" in directive for directive in Page(html).robots)
    results.append({"path": "/book", "status": status, "robots": "noindex"})

    status, _, xml = fetch(base, "/sitemap.xml")
    assert status == 200
    urls = [node.text for node in ElementTree.fromstring(xml).iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert len(urls) == len(set(urls))
    for city in ("inverness", "aberdeen"):
        assert urls.count(primary + "/areas/" + city) == 1
    results.append({"path": "/sitemap.xml", "status": status, "url_count": len(urls), "city_entries": "once each"})
    status, _, robots = fetch(base, "/robots.txt")
    assert status == 200 and primary + "/sitemap.xml" in robots
    assert "Disallow: /areas" not in robots
    results.append({"path": "/robots.txt", "status": status, "city_crawling": "allowed"})
    return {"base": base, "result": "PASS", "checks": results, "limits": "HTTP and initial HTML checks; no payment, database mutation, browser interaction or field performance measurement."}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:3002")
    args = parser.parse_args()
    if urlparse(args.base).hostname not in {"localhost", "127.0.0.1", "::1"}:
        parser.error("This check is restricted to a local production build.")
    print(json.dumps(verify(args.base.rstrip("/")), indent=2))

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("SEO_QA_BASE_URL", "http://localhost:3002")
SCREENSHOT_DIR = Path.cwd() / ".screens"
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)


def make_draft(**overrides):
    draft = {
        "serviceSlug": "man-and-van",
        "serviceName": "Man and Van",
        "serviceVariant": "",
        "entryServiceSlug": "man-and-van",
        "pickup": {
            "address": "15 Byres Road, Glasgow G11 5RD",
            "postcode": "G11 5RD",
            "lat": 55.8753,
            "lng": -4.2935,
        },
        "pickupFloor": 0,
        "pickupHasLift": False,
        "dropoff": {
            "address": "47 Princes Street, Edinburgh EH2 2YJ",
            "postcode": "EH2 2YJ",
            "lat": 55.9524,
            "lng": -3.1913,
        },
        "dropoffFloor": 0,
        "dropoffHasLift": False,
        "distanceMiles": 46.2,
        "items": [{"name": "Medium boxes", "quantity": 3}],
        "inventoryMode": "items",
        "bedroomCount": "",
        "exactBedroomCount": 5,
        "inventoryRooms": [],
        "selectedDate": "",
        "selectedTimeSlot": "afternoon",
        "helpersCount": 0,
        "needsPacking": False,
        "needsAssembly": False,
        "customerName": "",
        "customerEmail": "",
        "customerPhone": "",
        "clientTotal": 0,
        "clientSecret": "",
        "bookingId": "",
        "bookingRef": "",
        "priceBreakdown": [],
        "step": 1,
    }
    draft.update(overrides)
    return draft


def set_draft(page, state):
    state_json = json.dumps(state)
    page.add_init_script(
        f"""
            localStorage.setItem(
              'sv_booking_draft_v1',
              JSON.stringify({{ savedAt: Date.now(), state: {state_json} }})
            );
        """,
    )


def page_metrics(page):
    return page.evaluate(
        """() => ({
            url: location.href,
            title: document.title,
            h1: document.querySelector('h1')?.textContent?.trim() || '',
            canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
            robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
            jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
            horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            viewport: { width: innerWidth, height: innerHeight }
        })"""
    )


results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        desktop = browser.new_context(viewport={"width": 1366, "height": 900})
        page = desktop.new_page()

        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        page.screenshot(path=SCREENSHOT_DIR / "seo-home-desktop-2026-09-19.png", full_page=True)
        results.append({"check": "home desktop", **page_metrics(page)})

        page.goto(f"{BASE_URL}/services/man-and-van", wait_until="networkidle")
        page.screenshot(
            path=SCREENSHOT_DIR / "seo-service-man-and-van-desktop-2026-09-19.png",
            full_page=True,
        )
        service_body = page.locator("body").inner_text()
        results.append(
            {
                "check": "service copy",
                "containsPlanSection": "Plan Your Man and Van" in service_body,
                "leakedSeoPhrase": "one strong service page" in service_body
                or "synonyms" in service_body,
                "bookHref": page.locator('a[href="/book?service=man-and-van"]').first.get_attribute("href"),
                **page_metrics(page),
            }
        )

        page.goto(f"{BASE_URL}/areas/glasgow", wait_until="networkidle")
        area_body = page.locator("body").inner_text()
        results.append(
            {
                "check": "area glasgow copy",
                "hasBookCta": page.locator('a[href="/book"]').count(),
                "hasMoveAdvice": "Tenement and close access" in area_body
                and "Glasgow City Council parking guidance" in area_body,
                **page_metrics(page),
            }
        )

        page.goto(f"{BASE_URL}/book?service=man-and-van", wait_until="networkidle")
        page.wait_for_function("() => document.body.innerText.includes('Pickup location')")
        body_text = page.locator("body").inner_text()
        results.append(
            {
                "check": "booking prefill",
                "h1": page.locator("h1").first.inner_text(),
                "stepText": "Pickup location" in body_text and "Man and Van" in body_text,
            }
        )
        page.get_by_role("button", name="Continue to Schedule").click()
        page.wait_for_selector("text=Please enter a pickup address.")
        page.screenshot(path=SCREENSHOT_DIR / "seo-book-validation-2026-09-19.png", full_page=True)
        results.append(
            {
                "check": "booking validation empty addresses",
                "errorVisible": page.locator("text=Please enter a pickup address.").is_visible(),
            }
        )

        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        postcode_input = page.get_by_role("textbox", name="Check your postcode")
        postcode_input.fill("XYZ")
        postcode_input.blur()
        page.wait_for_selector("text=That doesn't look like a UK postcode.")
        postcode_input.fill("SW1A 1AA")
        page.wait_for_selector("text=SW is outside our coverage")
        results.append({"check": "postcode invalid and out of coverage", "invalidAndOutsideVisible": True})
        desktop.close()

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page = mobile.new_page()
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        page.screenshot(path=SCREENSHOT_DIR / "seo-home-mobile-2026-09-19.png", full_page=True)
        results.append({"check": "home mobile", **page_metrics(page)})

        page.goto(f"{BASE_URL}/areas/glasgow", wait_until="networkidle")
        page.screenshot(path=SCREENSHOT_DIR / "seo-area-glasgow-mobile-2026-09-19.png", full_page=True)
        results.append({"check": "area mobile", **page_metrics(page)})
        mobile.close()

        failure_context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page = failure_context.new_page()
        set_draft(page, make_draft(step=3))
        page.route(
            "**/pricing/calculate",
            lambda route: route.fulfill(
                status=500,
                content_type="application/json",
                body=json.dumps({"success": False, "error": "Simulated pricing outage"}),
            ),
        )
        page.goto(f"{BASE_URL}/book", wait_until="domcontentloaded")
        page.wait_for_selector("text=Quote unavailable")
        results.append(
            {
                "check": "pricing failure state",
                "quoteUnavailable": page.locator("text=Quote unavailable").is_visible(),
                "retryVisible": page.get_by_role("button", name="Retry quote").is_visible(),
            }
        )
        failure_context.close()

        repeat_context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page = repeat_context.new_page()
        set_draft(
            page,
            make_draft(
                step=4,
                selectedDate="2026-09-25",
                selectedTimeSlot="morning",
                clientTotal=120,
                priceBreakdown=[{"label": "Base move price", "amount": 120, "type": "base"}],
            ),
        )
        create_calls = {"count": 0}
        pending_route = {"route": None}

        def hold_create(route):
            create_calls["count"] += 1
            pending_route["route"] = route

        page.route("**/booking/create", hold_create)
        page.goto(f"{BASE_URL}/book", wait_until="domcontentloaded")
        page.wait_for_selector("text=Almost there!")
        page.get_by_placeholder("Jane Smith").fill("SEO Test User")
        page.get_by_placeholder("jane@example.com").fill("seo-test@example.com")
        page.get_by_placeholder("+44 7700 900000").fill("07700900123")
        submit = page.locator('form button[type="submit"]').last
        submit.click()
        page.wait_for_function(
            """() => {
                const buttons = [...document.querySelectorAll('form button[type="submit"]')];
                const button = buttons.at(-1);
                return button && button.textContent.includes('Processing');
            }"""
        )
        button_state = page.evaluate(
            """() => {
                const buttons = [...document.querySelectorAll('form button[type="submit"]')];
                const button = buttons.at(-1);
                return button ? { disabled: button.disabled, text: button.textContent.trim() } : null;
            }"""
        )
        try:
            submit.click(timeout=500)
        except Exception:
            pass
        page.wait_for_timeout(500)
        results.append(
            {
                "check": "payment repeated submit guard",
                "disabledDuringSubmit": button_state["disabled"] if button_state else False,
                "buttonTextDuringSubmit": button_state["text"] if button_state else "",
                "createCalls": create_calls["count"],
            }
        )
        if pending_route["route"]:
            pending_route["route"].abort()
        repeat_context.close()

        payment_failure_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
        )
        page = payment_failure_context.new_page()
        set_draft(
            page,
            make_draft(
                step=4,
                selectedDate="2026-09-25",
                selectedTimeSlot="morning",
                clientTotal=120,
                priceBreakdown=[{"label": "Base move price", "amount": 120, "type": "base"}],
            ),
        )
        page.route(
            "**/booking/create",
            lambda route: route.fulfill(
                status=500,
                content_type="application/json",
                body=json.dumps({"success": False, "error": "Simulated booking create failure"}),
            ),
        )
        page.goto(f"{BASE_URL}/book", wait_until="domcontentloaded")
        page.wait_for_selector("text=Almost there!")
        page.get_by_placeholder("Jane Smith").fill("SEO Test User")
        page.get_by_placeholder("jane@example.com").fill("seo-test@example.com")
        page.get_by_placeholder("+44 7700 900000").fill("07700900123")
        page.locator('form button[type="submit"]').last.click()
        page.wait_for_selector("text=Simulated booking create failure")
        page.screenshot(path=SCREENSHOT_DIR / "seo-book-payment-failure-2026-09-19.png", full_page=True)
        results.append(
            {
                "check": "payment failure state",
                "failureVisible": page.locator("text=Simulated booking create failure").is_visible(),
            }
        )
        payment_failure_context.close()
    finally:
        browser.close()

print(json.dumps(results, indent=2))

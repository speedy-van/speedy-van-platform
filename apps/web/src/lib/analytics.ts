// Optional measurement must never interrupt a quote or a booking.
export type ConsentState = "accepted" | "declined" | null;

export const COOKIE_CONSENT_KEY = "sv-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "sv:cookie-settings";
const CONSENT_CHANGED_EVENT = "sv:cookie-consent-changed";
const PURCHASE_KEY = "sv-purchase:";

type AnalyticsFunction = (...args: unknown[]) => void;
type MetaPixelFunction = AnalyticsFunction & {
  callMethod?: AnalyticsFunction;
  queue?: unknown[][];
  push?: MetaPixelFunction;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    gtag?: AnalyticsFunction;
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    dataLayer?: unknown[];
  }
}

let memoryConsent: ConsentState | undefined;
const sentPurchases = new Set<string>();
const initialisedGoogleIds = new Set<string>();
const initialisedMetaIds = new Set<string>();

function parseConsent(value: string | null): ConsentState {
  return value === "accepted" || value === "declined" ? value : null;
}

export function getCookieConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  if (memoryConsent !== undefined) return memoryConsent;
  try {
    return parseConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY));
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "accepted";
}

export function isPublicAnalyticsPath(pathname: string): boolean {
  return !/^\/(?:admin|driver|auth|api|track|jobs)(?:\/|$)/.test(pathname)
    && !/^\/book\/review(?:\/|$)/.test(pathname);
}

function consentParameters(accepted: boolean) {
  const value = accepted ? "granted" : "denied";
  return {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  };
}

export function syncAnalyticsConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  const accepted = state === "accepted";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = !accepted;
  }
  try {
    window.gtag?.("consent", "update", consentParameters(accepted));
  } catch { /* A blocked provider must not affect consent controls. */ }
  try {
    window.fbq?.("consent", accepted ? "grant" : "revoke");
  } catch { /* A blocked provider must not affect consent controls. */ }
}

export function setCookieConsent(state: Exclude<ConsentState, null>) {
  if (typeof window === "undefined") return;
  memoryConsent = state;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, state);
  } catch { /* Retain the choice for this page when storage is unavailable. */ }
  // Revoke synchronously, before another click can send an event.
  syncAnalyticsConsent(state);
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

export function subscribeCookieConsent(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== COOKIE_CONSENT_KEY && event.key !== null) return;
    memoryConsent = event.key === null ? null : parseConsent(event.newValue);
    syncAnalyticsConsent(memoryConsent);
    onChange();
  };
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function initialiseAnalytics(gaId?: string, metaId?: string) {
  if (!hasAnalyticsConsent() || typeof window === "undefined") return;
  if (gaId && !initialisedGoogleIds.has(gaId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function (..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params -- gtag consumes an IArguments queue entry.
      window.dataLayer?.push(arguments);
    };
    window.gtag("consent", "default", consentParameters(false));
    window.gtag("consent", "update", consentParameters(true));
    window.gtag("js", new Date());
    // Page views have one owner, including App Router navigation.
    window.gtag("config", gaId, { send_page_view: false });
    initialisedGoogleIds.add(gaId);
  }
  if (metaId && !initialisedMetaIds.has(metaId)) {
    if (!window.fbq) {
      const pixel: MetaPixelFunction = (...args) => {
        if (pixel.callMethod) pixel.callMethod(...args);
        else pixel.queue?.push(args);
      };
      pixel.queue = [];
      pixel.push = pixel;
      pixel.loaded = true;
      pixel.version = "2.0";
      window.fbq = pixel;
      window._fbq = pixel;
    }
    window.fbq("consent", "grant");
    window.fbq("init", metaId);
    initialisedMetaIds.add(metaId);
  }
  syncAnalyticsConsent("accepted");
}

function analyticsLocation(path?: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const url = new URL(path || window.location.pathname, window.location.origin);
    // Booking links can contain contact details or addresses in query strings.
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

export function trackAnalyticsEvent(name: string, payload: Record<string, unknown> = {}): boolean {
  if (!hasAnalyticsConsent() || typeof window === "undefined") return false;
  if (!isPublicAnalyticsPath(window.location.pathname)) return false;
  const parameters = { ...payload, page_location: analyticsLocation() };
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, parameters);
      return true;
    }
    if (window.dataLayer) {
      // A tag manager receives one event only when gtag is not the active path.
      window.dataLayer.push({ event: name, ...parameters });
      return true;
    }
  } catch { /* Measurement failure must not block the customer action. */ }
  return false;
}

export function trackMetaEvent(name: string, params?: Record<string, unknown>, custom = false): boolean {
  if (!hasAnalyticsConsent() || typeof window === "undefined") return false;
  if (!isPublicAnalyticsPath(window.location.pathname)) return false;
  try {
    if (typeof window.fbq === "function") {
      window.fbq(custom ? "trackCustom" : "track", name, params);
      return true;
    }
  } catch { /* Measurement failure must not block the customer action. */ }
  return false;
}

export function trackPageView(url: string) {
  const location = analyticsLocation(url);
  if (!location) return;
  trackAnalyticsEvent("page_view", { page_path: new URL(location).pathname });
  trackMetaEvent("PageView");
}

export function trackBookingStart(serviceSlug: string) {
  trackAnalyticsEvent("begin_checkout", { items: [{ item_id: serviceSlug }] });
  trackMetaEvent("InitiateCheckout", { content_ids: [serviceSlug] });
}

export function trackAddToCart(serviceSlug: string, price: number) {
  if (!Number.isFinite(price) || price < 0) return;
  trackAnalyticsEvent("add_to_cart", {
    currency: "GBP", value: price, items: [{ item_id: serviceSlug, price }],
  });
  trackMetaEvent("AddToCart", { content_ids: [serviceSlug], value: price, currency: "GBP" });
}

function purchaseWasSent(key: string): boolean {
  if (sentPurchases.has(key)) return true;
  try { return window.sessionStorage.getItem(key) === "1"; } catch { return false; }
}

function markPurchaseSent(key: string) {
  sentPurchases.add(key);
  try { window.sessionStorage.setItem(key, "1"); } catch { /* The memory guard remains active. */ }
}

// Call only after the server has confirmed the booking and successful payment.
export function trackPurchase(bookingRef: string, value: number, serviceSlug: string) {
  if (!hasAnalyticsConsent() || !bookingRef.trim() || !serviceSlug.trim() || !Number.isFinite(value) || value <= 0) return;
  const googleKey = `${PURCHASE_KEY}google:${bookingRef}`;
  if (!purchaseWasSent(googleKey) && trackAnalyticsEvent("purchase", {
    transaction_id: bookingRef, currency: "GBP", value, items: [{ item_id: serviceSlug }],
  })) markPurchaseSent(googleKey);
  const metaKey = `${PURCHASE_KEY}meta:${bookingRef}`;
  if (!purchaseWasSent(metaKey) && trackMetaEvent("Purchase", {
    value, currency: "GBP", content_ids: [serviceSlug],
  })) markPurchaseSent(metaKey);
}

export function trackLead(serviceSlug?: string) {
  trackAnalyticsEvent("generate_lead", { currency: "GBP", items: serviceSlug ? [{ item_id: serviceSlug }] : [] });
  trackMetaEvent("Lead");
}

export function trackButtonClick(label: string) {
  trackAnalyticsEvent("click", { event_category: "engagement", event_label: label });
}

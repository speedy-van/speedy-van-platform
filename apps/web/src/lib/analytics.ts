// Analytics event tracking helpers
// Fires GA4 gtag events and Meta Pixel events when available

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

function fbq(event: string, name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(event, name, params);
  }
}

export function trackPageView(url: string) {
  gtag("event", "page_view", { page_path: url });
}

export function trackBookingStart(serviceSlug: string) {
  gtag("event", "begin_checkout", { items: [{ item_id: serviceSlug }] });
  fbq("track", "InitiateCheckout", { content_ids: [serviceSlug] });
}

export function trackAddToCart(serviceSlug: string, price: number) {
  gtag("event", "add_to_cart", {
    currency: "GBP",
    value: price,
    items: [{ item_id: serviceSlug, price }],
  });
  fbq("track", "AddToCart", { content_ids: [serviceSlug], value: price, currency: "GBP" });
}

export function trackPurchase(bookingRef: string, value: number, serviceSlug: string) {
  gtag("event", "purchase", {
    transaction_id: bookingRef,
    currency: "GBP",
    value,
    items: [{ item_id: serviceSlug }],
  });
  fbq("track", "Purchase", { value, currency: "GBP", content_ids: [serviceSlug] });
}

export function trackLead(serviceSlug?: string) {
  gtag("event", "generate_lead", { currency: "GBP", items: serviceSlug ? [{ item_id: serviceSlug }] : [] });
  fbq("track", "Lead");
}

export function trackButtonClick(label: string) {
  gtag("event", "click", { event_category: "engagement", event_label: label });
}

export const SITE = {
  name: "Speedy Van",
  shortName: "SpeedyVan",
  domain: "speedy-van.co.uk",
  url: "https://www.speedy-van.co.uk",
  email: "hello@speedy-van.co.uk",
  supportEmail: "support@speedy-van.co.uk",
  phone: "+44 800 000 0000",
  address: "London, United Kingdom",
  // Public link to leave / read Google Business Profile reviews.
  // TODO: replace with the real GBP link once the listing is verified.
  googleReviewsUrl: "https://g.page/speedyvan/review",
  social: {
    facebook: "https://www.facebook.com/share/1Dd8NQPV4f/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@speedyvan0",
    whatsapp: "https://wa.me/message/J6EO772GDPHFO1",
  },
} as const;

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://www.speedy-van.co.uk",
  "https://speedy-van.co.uk",
  "https://speedyvan.uk",
  "https://www.speedyvan.uk",
] as const;

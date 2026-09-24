export const SITE = {
  name: "Speedy Van",
  shortName: "SpeedyVan",
  domain: "speedyvan.uk",
  url: "https://www.speedyvan.uk",
  email: "hello@speedyvan.uk",
  supportEmail: "support@speedyvan.uk",
  phone: "+44 7909 032889",
  address: "1 Barrack Street, Office 2.18, Hamilton ML3 0HS, Scotland",
  social: {
    facebook: "https://www.facebook.com/share/1Dd8NQPV4f/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@speedyvan0",
    whatsapp: "https://wa.me/447909032889",
  },
} as const;

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:8082",
  "https://speedyvan.uk",
  "https://www.speedyvan.uk",
  "https://speedy-van.co.uk",
  "https://www.speedy-van.co.uk",
] as const;

const LOCAL_DEV_ORIGIN_RE =
  /^https?:\/\/(?:(?:localhost|127\.0\.0\.1|\[::1\])|(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})|(?:192\.168\.\d{1,3}\.\d{1,3})|(?:[\w.-]+\.local))(?::(?:3000|3002|8081|8082))?$/;

export function isAllowedOrigin(origin: string): boolean {
  return (ALLOWED_ORIGINS as readonly string[]).includes(origin) || LOCAL_DEV_ORIGIN_RE.test(origin);
}

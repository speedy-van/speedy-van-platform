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
  "https://speedyvan.uk",
  "https://www.speedyvan.uk",
  "https://speedy-van.co.uk",
  "https://www.speedy-van.co.uk",
] as const;

import { SITE } from "@speedy-van/config";

export const SITE_URL = SITE.url.replace(/\/$/, "");
export const SITE_NAME = "SpeedyVan";
export const SITE_LEGAL_NAME = "Speedy Van";
export const SITE_DOMAIN = SITE.domain;
export const SITE_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const SITE_PHONE_DISPLAY = "07909 032889";
export const SITE_PHONE_HREF = "tel:07909032889";
export const SITE_PHONE_E164 = "+44 7909 032889";
export const SITE_EMAIL = SITE.email;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

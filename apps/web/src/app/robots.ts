import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/driver/", "/auth/", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

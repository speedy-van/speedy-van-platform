import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private HTML routes send noindex headers and must be crawlable to read them.
      // Authentication remains enforced independently of crawler directives.
      disallow: ["/api$", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

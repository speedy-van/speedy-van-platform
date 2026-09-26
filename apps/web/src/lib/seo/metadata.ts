import type { Metadata } from "next";
import { SITE_NAME, SITE_OG_IMAGE, SITE_OG_IMAGE_HEIGHT, SITE_OG_IMAGE_WIDTH, absoluteUrl } from "./constants";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

/** Keep public-page search and sharing metadata on the same canonical URL. */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      title: socialTitle,
      description,
      url: canonical,
      images: [{ url: SITE_OG_IMAGE, width: SITE_OG_IMAGE_WIDTH, height: SITE_OG_IMAGE_HEIGHT, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}

import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

/**
 * Renders a <script type="application/ld+json"> tag with the given schema(s).
 * Accepts a single schema object or an array of schemas.
 */
export function JsonLd({ data, id = "json-ld" }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

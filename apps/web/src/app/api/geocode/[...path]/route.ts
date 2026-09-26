import { DEFAULT_API_BASE, getApiBaseUrl } from "@/lib/api-base";

type GeocodeRouteContext = {
  params: Promise<{
    path: string[] | string;
  }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);

function geocodeUpstreamBases(): string[] {
  const primary = getApiBaseUrl();
  return Array.from(new Set([primary, DEFAULT_API_BASE]));
}

function responseFromUpstream(response: Response, body: string): Response {
  const headers = new Headers();
  const contentType = response.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", "no-store");

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function proxyGeocodeRequest(request: Request, context: GeocodeRouteContext): Promise<Response> {
  const params = context.params ? await context.params : null;
  const sourceUrl = new URL(request.url);
  const fallbackPath = sourceUrl.pathname.replace(/^\/api\/geocode\/?/, "").split("/").filter(Boolean);
  const path = params?.path ?? fallbackPath;
  const pathParts = Array.isArray(path) ? path : [path];
  const upstreamPath = pathParts.map((part) => encodeURIComponent(part)).join("/");
  const requestBody = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  const headers = new Headers();

  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  let lastResponse: { response: Response; body: string } | null = null;
  let lastError: unknown = null;

  for (const base of geocodeUpstreamBases()) {
    const url = `${base}/geocode/${upstreamPath}${sourceUrl.search}`;

    try {
      const response = await fetch(url, {
        method: request.method,
        headers,
        body: requestBody,
        cache: "no-store",
      });
      const body = await response.text();

      if (!RETRYABLE_STATUS_CODES.has(response.status)) {
        return responseFromUpstream(response, body);
      }

      lastResponse = { response, body };
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) {
    return responseFromUpstream(lastResponse.response, lastResponse.body);
  }

  console.warn("[geocode/proxy] upstream unavailable", lastError);
  return Response.json(
    {
      success: false,
      error: "Address lookup is unavailable. Please try again.",
      code: "GEOCODE_UPSTREAM_UNAVAILABLE",
    },
    {
      status: 503,
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}

export function GET(request: Request, context: GeocodeRouteContext): Promise<Response> {
  return proxyGeocodeRequest(request, context);
}

export function POST(request: Request, context: GeocodeRouteContext): Promise<Response> {
  return proxyGeocodeRequest(request, context);
}

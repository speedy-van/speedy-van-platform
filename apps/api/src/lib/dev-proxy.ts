const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

function getProxyTarget(): string | null {
  if (process.env["NODE_ENV"] === "production") return null;

  const target = process.env["LOCAL_API_PROXY_TARGET"]?.trim();
  if (!target) return null;

  return target.replace(/\/+$/, "");
}

export const localApiProxyTarget = getProxyTarget();

export function shouldProxyRequest(path: string, method: string): boolean {
  if (!localApiProxyTarget) return false;
  if (method === "OPTIONS") return false;
  return path !== "/" && path !== "/health";
}

export async function proxyRequest(request: Request, path: string): Promise<Response> {
  if (!localApiProxyTarget) {
    throw new Error("LOCAL_API_PROXY_TARGET is not configured");
  }

  const sourceUrl = new URL(request.url);
  const targetUrl = `${localApiProxyTarget}${path}${sourceUrl.search}`;
  const headers = new Headers(request.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });

  const responseHeaders = new Headers(response.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => responseHeaders.delete(header));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

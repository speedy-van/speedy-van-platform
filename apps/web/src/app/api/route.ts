import app from "@/server/api/app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleApiRoot(request: Request): Promise<Response> {
  const sourceUrl = new URL(request.url);
  sourceUrl.pathname = "/";
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  return app.fetch(
    new Request(sourceUrl, {
      method: request.method,
      headers: request.headers,
      body,
    }),
  );
}

export function GET(request: Request): Promise<Response> {
  return handleApiRoot(request);
}

export function HEAD(request: Request): Promise<Response> {
  return handleApiRoot(request);
}

export function POST(request: Request): Promise<Response> {
  return handleApiRoot(request);
}

export function OPTIONS(request: Request): Promise<Response> {
  return handleApiRoot(request);
}

import app from "@/server/api/app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiRouteContext = {
  params: Promise<{
    path?: string[] | string;
  }>;
};

async function handleApiRequest(request: Request, context: ApiRouteContext): Promise<Response> {
  const sourceUrl = new URL(request.url);
  if (sourceUrl.pathname === "/api") {
    sourceUrl.pathname = "/";
  } else if (sourceUrl.pathname.startsWith("/api/")) {
    sourceUrl.pathname = sourceUrl.pathname.slice(4);
  } else {
    const params = context.params ? await context.params : null;
    const path = params?.path ?? [];
    const pathParts = Array.isArray(path) ? path : [path];
    sourceUrl.pathname = `/${pathParts.map((part) => encodeURIComponent(part)).join("/")}`;
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;
  const apiRequest = new Request(sourceUrl, {
    method: request.method,
    headers: request.headers,
    body,
  });

  return app.fetch(apiRequest);
}

export function GET(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

export function HEAD(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

export function POST(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

export function PUT(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

export function PATCH(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

export function DELETE(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

export function OPTIONS(request: Request, context: ApiRouteContext): Promise<Response> {
  return handleApiRequest(request, context);
}

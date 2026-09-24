import { NextResponse, type NextRequest } from "next/server";

const PRIMARY_HOST = "www.speedyvan.uk";
const REDIRECT_HOSTS = new Set([
  "speedyvan.uk",
  "speedy-van.co.uk",
  "www.speedy-van.co.uk",
]);

const PRIVATE_PATHS = ["/book", "/admin", "/driver", "/auth", "/track", "/jobs"];

function shouldPreventIndexing(pathname: string, host: string | undefined): boolean {
  return Boolean(host?.endsWith(".vercel.app")) || PRIVATE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];

  if (request.nextUrl.pathname === "/api" || request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  let response = NextResponse.next();
  if ((request.method === "GET" || request.method === "HEAD") && host && REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = PRIMARY_HOST;
    url.port = "";
    response = NextResponse.redirect(url, 308);
  }

  if (shouldPreventIndexing(request.nextUrl.pathname, host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};

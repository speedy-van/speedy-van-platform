import { NextResponse, type NextRequest } from "next/server";

const PRIMARY_HOST = "www.speedyvan.uk";
const REDIRECT_HOSTS = new Set([
  "speedyvan.uk",
  "speedy-van.co.uk",
  "www.speedy-van.co.uk",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];

  if (request.nextUrl.pathname === "/api" || request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (!host || !REDIRECT_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = PRIMARY_HOST;
  url.port = "";

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/:path*",
};

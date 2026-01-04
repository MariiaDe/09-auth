
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAuthPath(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}


function hasAuthCookie(req: NextRequest) {
  return (
    req.cookies.has("accessToken") ||
    req.cookies.has("refreshToken") ||
    req.cookies.has("token")
  );
}


export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const authed = hasAuthCookie(req);

  if (!authed && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (authed && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

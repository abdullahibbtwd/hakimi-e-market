import { NextResponse, NextRequest } from "next/server";
import { getTokenFromRequest, verifyJWT } from "@/utils/auth";
import {
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicApiRoute,
  adminRoute,
} from "@/route";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  if (
    pathname.startsWith(apiAuthPrefix) ||
    pathname.startsWith(publicApiRoute)
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(req);
  const decodedToken = token ? await verifyJWT(token) : null;
  const isAuthenticated = !!decodedToken;

  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (pathname.startsWith(adminRoute)) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (decodedToken?.payload.role === "USER") {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api/public|_next/static|_next/image|favicon.ico).*)"],
};

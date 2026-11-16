import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

import { product } from "@/lib/product";

/**
 * Optimistic redirect only: checks that a session cookie exists, not that it is
 * valid. Real checks happen in lib/session.ts (pages, actions) and in the API.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: product.name.toLowerCase(),
  });
  if (!sessionCookie) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/onboarding/:path*"],
};

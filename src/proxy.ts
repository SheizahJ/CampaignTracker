/**
 * Handles redirection if the user is not yet logged into the site.
 * 
 * If logged in: redirect to homepage
 * If not logged in: redirect to login
 * 
 * Prevents user from routing into homepage or login if not verified
 */

import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.has("signed_in");
  const pathname = request.nextUrl.pathname;

  if (!isLoggedIn && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};

import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "./src/lib/auth-session.js";

export function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};

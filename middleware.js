import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { NextResponse } from "next/server";
const intlMiddleware = createMiddleware(routing);

const protectedRoutePath = "dashboard";
const publicRoutesPath = "/login";
export default async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute = pathname.includes(protectedRoutePath);
  const isPublicRoute = pathname.includes(publicRoutesPath);

  const session = (await cookies()).get("session")?.value;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(`/login`, req.nextUrl));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL(`/dashboard`, req.nextUrl));
  }
  if (intlMiddleware) {
    return intlMiddleware(req);
  }
  // return intlMiddleware(req);
}
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

/**
 * old version with a bug
 * matcher: [
    "/",
    "/(en|ar)/:path*",
    // "/dashboard/:path*",
    // "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
 */

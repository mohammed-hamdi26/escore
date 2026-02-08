import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/register"];

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Remove locale prefix to check the actual path
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";

  // Check if route is protected (requires auth)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Check if route is an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Get session token
  const session = (await cookies()).get("session")?.value;

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const locale = pathname.match(/^\/(en|ar)/)?.[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/login`, req.nextUrl));
  }

  // Redirect to dashboard if accessing auth routes with valid session
  if (isAuthRoute && session) {
    const locale = pathname.match(/^\/(en|ar)/)?.[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.nextUrl));
  }

  // Continue with internationalization middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - Next.js internals (_next, _vercel)
    // - Static files (files with extensions like .png, .ico, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

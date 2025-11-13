import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req) {
  return intlMiddleware(req);
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

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req) {
  const intlResponse = intlMiddleware(req);

  if (intlResponse.ok) {
    return intlResponse;
  }
}
export const config = {
  matcher: [
    "/",
    "/(en|ar)/:path*",
    // "/dashboard/:path*",
    // "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Force logout route handler
 * Clears the session cookie and redirects to login
 * Used when session is invalid (e.g., after database reset)
 */
export async function GET(request) {
  const cookieStore = await cookies();

  // Delete all auth cookies
  cookieStore.delete("session");
  cookieStore.delete("refresh_token");
  cookieStore.delete("token_exp");

  // Get the locale from query param, referer, or default to 'en'
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const referer = request.headers.get("referer") || "";
  const localeMatch = referer.match(/\/(en|ar)\//);
  const locale = localeParam || (localeMatch ? localeMatch[1] : "en");

  // Build URL from forwarded headers (handles reverse proxy correctly)
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");
  const loginUrl = new URL(`/${locale}/login`, `${proto}://${host}`);
  return NextResponse.redirect(loginUrl);
}

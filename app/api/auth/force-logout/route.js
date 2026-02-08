import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Force logout route handler
 * Clears the session cookie and redirects to login
 * Used when session is invalid (e.g., after database reset)
 */
export async function GET(request) {
  const cookieStore = await cookies();

  // Delete the session cookie
  cookieStore.delete("session");

  // Get the locale from the referer or default to 'en'
  const referer = request.headers.get("referer") || "";
  const localeMatch = referer.match(/\/(en|ar)\//);
  const locale = localeMatch ? localeMatch[1] : "en";

  // Redirect to login page
  const loginUrl = new URL(`/${locale}/login`, request.url);
  return NextResponse.redirect(loginUrl);
}

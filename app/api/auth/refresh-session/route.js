import { NextResponse } from "next/server";
import {
  getRefreshToken,
  saveSession,
  saveRefreshToken,
  deleteSession,
} from "../../../[locale]/_Lib/session";

/**
 * Token refresh route handler.
 * Called by middleware when the access token is expired.
 * Route Handlers CAN write cookies (unlike Server Components).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/en/dashboard";
  const locale = searchParams.get("locale") || "en";

  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");
  const baseUrl = `${proto}://${host}`;

  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await deleteSession();
      return NextResponse.redirect(new URL(`/${locale}/login`, baseUrl));
    }

    const axios = (await import("axios")).default;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/refresh-token`,
      { refreshToken }
    );

    const tokens = res?.data?.data?.tokens;
    if (tokens?.accessToken && tokens?.refreshToken) {
      await saveSession(tokens.accessToken);
      await saveRefreshToken(tokens.refreshToken);
      return NextResponse.redirect(new URL(redirectTo, baseUrl));
    }

    // Refresh returned no tokens
    await deleteSession();
    return NextResponse.redirect(new URL(`/${locale}/login`, baseUrl));
  } catch {
    // Refresh failed (token expired or invalid)
    try {
      await deleteSession();
    } catch {
      // Ignore cleanup errors
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, baseUrl));
  }
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AlertTriangle, LogOut } from "lucide-react";
import { forceLogout } from "../_Lib/actions";

/**
 * Dashboard-specific error handler
 * Any error in dashboard routes will clear the session and redirect to login
 * This handles the case where the user's session is invalid (e.g., after DB reset)
 */
export default function DashboardError({ error, reset }) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(true);
  console.log(error);

  useEffect(() => {
    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("Dashboard error:", error);
    }

    // Always clear session and redirect for any dashboard error
    // This handles auth errors that are hidden in production
    handleClearAndRedirect();
  }, [error]);

  const handleClearAndRedirect = async () => {
    setIsClearing(true);
    try {
      await forceLogout();
      // Wait a moment for the cookie to be cleared
      await new Promise((resolve) => setTimeout(resolve, 200));
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Failed to clear session:", e);
      // Even if forceLogout fails, try to redirect
      router.push("/login");
    }
  };

  // Show loading state while clearing session
  if (isClearing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-primary mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            Session expired, redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-yellow-500/10 p-5 rounded-full border border-yellow-500/30">
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            Session Expired
          </h1>

          {/* Description */}
          <p className="text-gray-400 mb-6">
            Your session has expired or is invalid. Please log in again to
            continue.
          </p>

          {/* Login Button */}
          <button
            onClick={handleClearAndRedirect}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-primary hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  ArrowLeft,
  Copy,
  CheckCircle,
} from "lucide-react";

export default function Error({ error, reset }) {
  const t = useTranslations("Error");
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by error boundary:", error);
    }

    // Check if it's an auth error (401/403) and redirect to login
    const errorMessage = error?.message?.toLowerCase() || "";
    const isAuthError =
      error?.isAuthError ||
      errorMessage.includes("401") ||
      errorMessage.includes("403") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("forbidden") ||
      errorMessage.includes("authentication") ||
      errorMessage.includes("not authenticated");

    if (isAuthError) {
      // Clear any stale session data and redirect to login
      router.push("/login");
    }
  }, [error, router]);

  const errorMessage = error?.message || "An unexpected error occurred";
  const errorDigest = error?.digest || "Unknown";

  const copyErrorDetails = () => {
    const details = `Error: ${errorMessage}\nDigest: ${errorDigest}\nTime: ${new Date().toISOString()}`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-red-500/10 p-5 rounded-full border border-red-500/30">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            {t("title")}
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-center mb-6 max-w-md mx-auto">
            {t("description")}
          </p>

          {/* Error Details Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                {t("errorDetails")}
              </span>
              <span
                className={`transform transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showDetails && (
              <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {t("errorMessage")}
                  </span>
                  <button
                    onClick={copyErrorDetails}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {t("copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        {t("copy")}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-red-400 text-sm font-mono break-all">
                  {errorMessage}
                </p>

                {errorDigest && errorDigest !== "Unknown" && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {t("errorId")}
                    </span>
                    <p className="text-gray-400 text-sm font-mono">
                      {errorDigest}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-primary hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-primary/25"
            >
              <RefreshCw className="w-5 h-5" />
              {t("tryAgain")}
            </button>

            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <Home className="w-5 h-5" />
              {t("goHome")}
            </Link>
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => window.history.back()}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("goBack")}
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {t("persistentError")}{" "}
            <Link
              href="/dashboard/support-center"
              className="text-green-primary hover:underline"
            >
              {t("contactSupport")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

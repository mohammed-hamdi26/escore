"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-gray-800 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-green-primary to-green-500 text-transparent bg-clip-text text-6xl md:text-8xl font-bold animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gray-800 p-6 rounded-full border border-gray-700">
              <AlertCircle className="w-12 h-12 text-green-primary" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          {t("description")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-primary hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-primary/25"
          >
            <Home className="w-5 h-5" />
            {t("goHome")}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("goBack")}
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-700 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700 max-w-md mx-auto">
          <p className="text-gray-400 text-sm">
            {t("helpText")}{" "}
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

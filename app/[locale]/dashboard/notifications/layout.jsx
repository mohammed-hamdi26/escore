"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { Bell, Send, Smartphone, BarChart3, Sparkles, History, FileText, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/contexts/PermissionsContext";

const navItems = [
  {
    href: "/dashboard/notifications",
    icon: BarChart3,
    labelKey: "dashboard",
    exact: true,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    href: "/dashboard/notifications/send",
    icon: Send,
    labelKey: "send",
    exact: false,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    href: "/dashboard/notifications/devices",
    icon: Smartphone,
    labelKey: "devices",
    exact: false,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    href: "/dashboard/notifications/history",
    icon: History,
    labelKey: "history",
    exact: false,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    href: "/dashboard/notifications/templates",
    icon: FileText,
    labelKey: "templates",
    exact: false,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
];

export default function NotificationsLayout({ children }) {
  const pathname = usePathname();
  const t = useTranslations("Notifications");
  const tCommon = useTranslations("common");
  const { isAdmin } = usePermissions();
  const router = useRouter();

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-8 max-w-md text-center">
          <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="size-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {tCommon("accessDenied") || "Access Denied"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {tCommon("noRoutePermission") || "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 bg-green-primary hover:bg-green-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            {tCommon("backToDashboard") || "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  const isActive = (href, exact) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-6 overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-primary/10 to-transparent rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-green-primary to-green-primary/70 flex items-center justify-center shadow-lg shadow-green-primary/25 transition-transform duration-300 group-hover:scale-105">
                <Bell className="size-7 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 size-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t("description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-2">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  active
                    ? "bg-gradient-to-r from-green-primary/10 to-green-primary/5 text-green-primary ring-1 ring-green-primary/20 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1d2e]"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  active
                    ? "bg-green-primary/10"
                    : `${item.bgColor} group-hover:scale-110`
                }`}>
                  <Icon className={`size-4 ${active ? "text-green-primary" : item.color}`} />
                </div>
                <span>{t(item.labelKey)}</span>
                {active && (
                  <div className="ml-auto size-1.5 rounded-full bg-green-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

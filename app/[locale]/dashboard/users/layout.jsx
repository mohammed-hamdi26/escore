"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { Users, BarChart3, UserPlus, UserCheck, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/contexts/PermissionsContext";

const navItems = [
  {
    href: "/dashboard/users",
    icon: BarChart3,
    labelKey: "dashboard",
    exact: true,
  },
  {
    href: "/dashboard/users/list",
    icon: Users,
    labelKey: "allUsers",
    exact: false,
  },
  {
    href: "/dashboard/users/add",
    icon: UserPlus,
    labelKey: "addUser",
    exact: true,
  },
  {
    href: "/dashboard/users/content-requests",
    icon: UserCheck,
    labelKey: "contentRequestsNav",
    exact: false,
  },
];

export default function UsersLayout({ children }) {
  const pathname = usePathname();
  const t = useTranslations("UsersManagement");
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

  // Don't show tabs on edit pages
  const isEditPage =
    pathname.includes("/edit") || pathname.includes("/following");

  if (isEditPage) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
            <Users className="size-5 text-green-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("description") || "Manage users, roles and permissions"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-[#1a1d2e] rounded-xl w-fit">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                active
                  ? "bg-white dark:bg-[#0f1118] text-green-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

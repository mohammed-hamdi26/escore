"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  Users,
  BarChart3,
  UserPlus,
  Shield,
  UserCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

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
    labelKey: "contentRequests",
    exact: false,
  },
];

export default function UsersLayout({ children }) {
  const pathname = usePathname();
  const t = useTranslations("UsersManagement");

  const isActive = (href, exact) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Don't show tabs on edit pages
  const isEditPage = pathname.includes("/edit") || pathname.includes("/following");

  if (isEditPage) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Users className="w-8 h-8 text-green-primary" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-green-primary/20 text-green-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
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

"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Bell, Send, Smartphone, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

const navItems = [
  {
    href: "/dashboard/notifications",
    icon: BarChart3,
    labelKey: "dashboard",
    exact: true,
  },
  {
    href: "/dashboard/notifications/send",
    icon: Send,
    labelKey: "send",
    exact: false,
  },
  {
    href: "/dashboard/notifications/devices",
    icon: Smartphone,
    labelKey: "devices",
    exact: false,
  },
];

export default function NotificationsLayout({ children }) {
  const pathname = usePathname();
  const t = useTranslations("Notifications");

  const isActive = (href, exact) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Bell className="w-8 h-8 text-green-primary" />
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-700 pb-4">
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
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
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

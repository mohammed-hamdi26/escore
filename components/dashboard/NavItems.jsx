"use client";

import NavItem from "./NavItem";
import SettingsIcon from "./SettingsIcon";
import { logout } from "@/app/[locale]/_Lib/actions";
import { LogOut } from "lucide-react";
import PasswordIcon from "../icons/PasswordIcon";
import { usePathname } from "@/i18n/navigation";

const pages = [
  {
    icon: <SettingsIcon />,
    title: "Settings",
    href: "/dashboard/settings",
  },
  {
    icon: <PasswordIcon width="18" height="18" />,
    title: "Change Password",
    href: "/dashboard/change-password",
  },
];

function NavItems({ t }) {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {/* Main Navigation */}
      <ul className="space-y-1">
        {pages.map((page) => (
          <NavItem
            isActive={pathname === page.href}
            key={page.title}
            icon={page.icon}
            label={t(page.title)}
            href={page.href}
          />
        ))}
      </ul>

      {/* Divider */}
      <div className="nav-divider" />

      {/* Logout Button */}
      <div
        className="group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer nav-item-hover"
        onClick={() => logout()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && logout()}
      >
        <span className="flex items-center justify-center size-9 rounded-lg bg-muted/50 transition-all duration-200 group-hover:bg-red-500/20">
          <LogOut className="size-[18px] text-muted-foreground transition-colors duration-200 group-hover:text-red-500 rtl:rotate-180" />
        </span>
        <span className="text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-red-500">
          {t("Logout")}
        </span>
      </div>
    </div>
  );
}

export default NavItems;

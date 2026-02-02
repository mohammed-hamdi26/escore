"use client";
import { useTranslations } from "next-intl";
import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

function SideNavBar({ user }) {
  const t = useTranslations("nav");

  return (
    <div className="hidden lg:block w-[260px] flex-shrink-0">
      <nav className="sticky top-[72px] relative bg-white dark:bg-[#0f1118] rounded-2xl py-6 overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none max-h-[calc(100vh-90px)]">
        {/* Accent line on left (LTR) or right (RTL) */}
        <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-primary via-green-primary/50 to-transparent" />

        {/* User Profile Section */}
        <div className="px-5 mb-4">
          <HeaderSideNavBar user={user} t={t} />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

        {/* Navigation Items */}
        <div className="px-3 mt-3">
          <NavItems user={user} t={t} />
        </div>
      </nav>
    </div>
  );
}

export default SideNavBar;

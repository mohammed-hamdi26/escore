"use client";
import { useTranslations } from "next-intl";
import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

function SideNavBar({ user }) {
  const t = useTranslations("nav");

  return (
    <div className="hidden lg:block w-[220px] flex-shrink-0">
      <nav className="sticky top-[72px] relative bg-white dark:bg-[#0f1118] rounded-xl py-4 overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none max-h-[calc(100vh-90px)]">
        {/* Accent line on left (LTR) or right (RTL) */}
        <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-green-primary via-green-primary/50 to-transparent rounded-r-full rtl:rounded-r-none rtl:rounded-l-full" />

        {/* User Profile Section */}
        <div className="px-4 mb-3">
          <HeaderSideNavBar user={user} t={t} />
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-gray-200 dark:bg-white/10" />

        {/* Navigation Items */}
        <div className="px-2 mt-2">
          <NavItems user={user} t={t} />
        </div>
      </nav>
    </div>
  );
}

export default SideNavBar;

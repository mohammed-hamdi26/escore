"use client";
import { useTranslations } from "next-intl";
import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

function SideNavBar({ user }) {
  const t = useTranslations("nav");

  return (
    <aside className="hidden lg:flex flex-col w-[260px] min-w-[260px] sticky top-16 h-[calc(100vh-64px)] bg-white dark:bg-[#0a0c10] border-r border-gray-200 dark:border-white/10">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <HeaderSideNavBar user={user} t={t} />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3">
        <NavItems user={user} t={t} />
      </div>
    </aside>
  );
}

export default SideNavBar;

"use client";
import { useTranslations } from "next-intl";
import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

function SideNavBar({ user }) {
  const t = useTranslations("nav");

  return (
    <div className="hidden lg:block w-[290px] flex-shrink-0">
      <nav className="relative glass rounded-2xl min-h-[calc(100vh-140px)] py-8 overflow-hidden border border-transparent dark:border-white/5">
        {/* Accent line on left (LTR) or right (RTL) */}
        <div className="sidebar-accent-line" />

        {/* User Profile Section */}
        <div className="px-6 mb-6">
          <HeaderSideNavBar user={user} t={t} />
        </div>

        {/* Divider */}
        <div className="nav-divider" />

        {/* Navigation Items */}
        <div className="px-4 mt-4">
          <NavItems user={user} t={t} />
        </div>
      </nav>
    </div>
  );
}

export default SideNavBar;

"use client";
import { useTranslations } from "next-intl";
import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

function SideNavBar({ user }) {
  const t = useTranslations("nav");

  return (
    <div className="hidden lg:block w-[260px] flex-shrink-0">
      <nav className="sticky top-[72px] relative glass rounded-2xl py-6 overflow-hidden border border-transparent dark:border-white/5 max-h-[calc(100vh-90px)]">
        {/* Accent line on left (LTR) or right (RTL) */}
        <div className="sidebar-accent-line" />

        {/* User Profile Section */}
        <div className="px-5 mb-4">
          <HeaderSideNavBar user={user} t={t} />
        </div>

        {/* Divider */}
        <div className="nav-divider" />

        {/* Navigation Items */}
        <div className="px-3 mt-3">
          <NavItems user={user} t={t} />
        </div>
      </nav>
    </div>
  );
}

export default SideNavBar;

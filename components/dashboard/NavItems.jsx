"use client";

import NavItem from "./NavItem";
import SettingsIcon from "./SettingsIcon";
import { logout } from "@/app/[locale]/_Lib/actions";
import {
  LogOut,
  Trophy,
  Swords,
  Users,
  UsersRound,
  ArrowRightLeft,
  Building2,
  Gamepad2,
  Newspaper,
  UserCog,
  HeadphonesIcon,
  Bell,
  LayoutDashboard,
  Settings,
  KeyRound,
} from "lucide-react";
import { usePathname } from "@/i18n/navigation";

/**
 * Check if user has permission for an entity
 */
function hasPermission(user, entity) {
  if (user?.role === "admin") return true;
  return user?.permissions?.some((perm) => perm.entity === entity) || false;
}

function NavItems({ user, t }) {
  const pathname = usePathname();
  const isAdmin = user?.role === "admin";

  // Dashboard modules
  const dashboardModules = [
    {
      icon: <LayoutDashboard />,
      title: "Dashboard",
      href: "/dashboard",
      isShowed: true,
    },
    {
      icon: <Trophy />,
      title: "Tournaments",
      href: "/dashboard/tournaments-management",
      isShowed: hasPermission(user, "Tournament"),
    },
    {
      icon: <Swords />,
      title: "Matches",
      href: "/dashboard/matches-management",
      isShowed: hasPermission(user, "Match"),
    },
    {
      icon: <Users />,
      title: "Players",
      href: "/dashboard/player-management",
      isShowed: hasPermission(user, "Player"),
    },
    {
      icon: <UsersRound />,
      title: "Teams",
      href: "/dashboard/teams-management",
      isShowed: hasPermission(user, "Team"),
    },
    {
      icon: <Building2 />,
      title: "Clubs",
      href: "/dashboard/clubs-management",
      isShowed: hasPermission(user, "Club"),
    },
    {
      icon: <ArrowRightLeft />,
      title: "Transfers",
      href: "/dashboard/transfers-management",
      isShowed: hasPermission(user, "Transfer"),
    },
    {
      icon: <Gamepad2 />,
      title: "Games",
      href: "/dashboard/games-management",
      isShowed: hasPermission(user, "Game"),
    },
    {
      icon: <Newspaper />,
      title: "News",
      href: "/dashboard/news",
      isShowed: hasPermission(user, "News"),
    },
    {
      icon: <UserCog />,
      title: "Users",
      href: "/dashboard/users",
      isShowed: isAdmin,
    },
    {
      icon: <HeadphonesIcon />,
      title: "Support",
      href: "/dashboard/support-center",
      isShowed: hasPermission(user, "Support"),
    },
    {
      icon: <Bell />,
      title: "Notifications",
      href: "/dashboard/notifications",
      isShowed: isAdmin,
    },
  ];

  // Settings pages
  const settingsPages = [
    {
      icon: <Settings />,
      title: "Settings",
      href: "/dashboard/settings",
      isShowed: hasPermission(user, "Settings"),
    },
    {
      icon: <KeyRound />,
      title: "Change Password",
      href: "/dashboard/change-password",
      isShowed: true, // All users can change their password
    },
  ];

  const visibleSettings = settingsPages.filter((page) => page.isShowed);

  const visibleModules = dashboardModules.filter((module) => module.isShowed);

  return (
    <div className="space-y-1">
      {/* Dashboard Modules */}
      <div className="px-3 py-1.5">
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {t("modules") || "Modules"}
        </span>
      </div>
      <ul className="space-y-0.5">
        {visibleModules.map((module) => {
          // Dashboard should only be active when exactly on /dashboard
          const isActive = module.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === module.href || pathname.startsWith(module.href + "/");

          return (
            <NavItem
              isActive={isActive}
              key={module.title}
              icon={module.icon}
              label={t(module.title) || module.title}
              href={module.href}
            />
          );
        })}
      </ul>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-gray-200 dark:bg-white/10" />

      {/* Settings Section */}
      <div className="px-3 py-1.5">
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {t("settings") || "Settings"}
        </span>
      </div>
      <ul className="space-y-0.5">
        {visibleSettings.map((page) => {
          // Settings should be active on /dashboard/settings and all sub-pages
          const isSettingsActive = page.href === "/dashboard/settings"
            ? pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")
            : pathname === page.href;

          return (
            <NavItem
              isActive={isSettingsActive}
              key={page.title}
              icon={page.icon}
              label={t(page.title) || page.title}
              href={page.href}
            />
          );
        })}
      </ul>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-gray-200 dark:bg-white/10" />

      {/* Logout Button */}
      <div className="px-3 pt-2">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 font-medium text-sm"
          onClick={() => logout()}
          type="button"
        >
          <LogOut className="size-4 rtl:rotate-180" />
          <span>{t("Logout")}</span>
        </button>
      </div>
    </div>
  );
}

export default NavItems;

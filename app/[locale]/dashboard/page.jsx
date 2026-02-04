import ServicesContainer from "@/components/dashboard/ServicesContainer";
import Champion from "@/components/icons/Champion";
import GamesManagement from "@/components/icons/GamesManagement";
import MatchesManagement from "@/components/icons/MatchesManagement";
import News from "@/components/icons/News";
import Player from "@/components/icons/Player";
import SupportCenter from "@/components/icons/SuppotCenter";
import TeamsManagement from "@/components/icons/TeamsManagement";
import User from "@/components/icons/User";
import { ArrowRightLeft, Bell, Newspaper } from "lucide-react";
import { getLoginUser } from "../_Lib/usersApi";

/**
 * Check if user has permission for an entity
 */
function hasPermission(user, entity) {
  if (user?.role === "admin") return true;
  return user?.permissions?.some((perm) => perm.entity === entity) || false;
}

export default async function page() {
  const user = await getLoginUser();
  const isAdmin = user?.role === "admin";

  const links = [
    {
      title: "Tournaments Management",
      href: "/tournaments-management",
      icon: (
        <Champion
          width="57"
          height="56"
          className={"text-green-primary icon-transition"}
        />
      ),
      isShowed: hasPermission(user, "Tournament"),
    },
    {
      title: "Matches Management",
      href: "/matches-management",
      icon: <MatchesManagement width="57" height="56" />,
      isShowed: hasPermission(user, "Match"),
    },
    {
      title: "Players",
      href: "/player-management",
      icon: <Player width="57" height="56" />,
      isShowed: hasPermission(user, "Player"),
    },
    {
      title: "Teams Management",
      href: "/teams-management",
      icon: <TeamsManagement width="57" height="56" />,
      isShowed: hasPermission(user, "Team"),
    },
    {
      title: "Transfers Management",
      href: "/transfers-management",
      icon: (
        <ArrowRightLeft className="icon-transition" width="57" height="56" />
      ),
      isShowed: hasPermission(user, "Transfer"),
    },
    {
      title: "Games Management",
      href: "/games-management",
      icon: <GamesManagement width="57" height="56" />,
      isShowed: hasPermission(user, "Game"),
    },
    {
      title: "News & Updates",
      href: "/news/edit",
      icon: <News width="57" height="56" />,
      isShowed: hasPermission(user, "News"),
    },
    {
      title: "Users",
      href: "/users/",
      icon: <User />,
      isShowed: isAdmin,
    },
    {
      title: "Support Center",
      href: "/support-center",
      icon: <SupportCenter width="57" height="56" />,
      isShowed: hasPermission(user, "Support"),
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: <Bell className="icon-transition" width="57" height="56" />,
      isShowed: isAdmin,
    },
    {
      title: "Become Content Creator",
      href: "/content-request",
      icon: <Newspaper className="icon-transition" width="57" height="56" />,
      isShowed: user?.role === "user", // Only show to regular users
    },
  ];

  return <ServicesContainer links={links} />;
}

"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";

// Map pathname segments to permission entities
const PATHNAME_TO_ENTITY = {
  "matches-management": ENTITIES.MATCH,
  "player-management": ENTITIES.PLAYER,
  "teams-management": ENTITIES.TEAM,
  "games-management": ENTITIES.GAME,
  "tournaments-management": ENTITIES.TOURNAMENT,
  "transfers-management": ENTITIES.TRANSFER,
  "news": ENTITIES.NEWS,
  "users": ENTITIES.USER,
  "support-center": ENTITIES.SUPPORT,
  "settings": ENTITIES.SETTINGS,
};

function LinksButtons() {
  const pathname = usePathname();
  const t = useTranslations("buttonLinks");
  const { hasPermission, isAdmin } = usePermissions();

  // Hide on specific pages
  if (
    pathname.includes("links") ||
    pathname.includes("favorites-characters") ||
    pathname.includes("awards") ||
    pathname.includes("lineups") ||
    pathname.includes("/add") ||
    pathname.includes("/edit/") ||
    pathname.includes("/view/") ||
    pathname.endsWith("/matches-management")
  )
    return null;

  // Determine entity from pathname
  const pathSegment = pathname.split("/").find((seg) => PATHNAME_TO_ENTITY[seg]);
  const entity = pathSegment ? PATHNAME_TO_ENTITY[pathSegment] : null;

  // Check create permission for the entity
  if (entity && !hasPermission(entity, ACTIONS.CREATE)) {
    return null;
  }

  return (
    <Link href={`${pathname}/add`}>
      <Button className="h-10 px-5 rounded-xl font-medium bg-green-primary hover:bg-green-primary/90 text-white transition-all">
        <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
        {t("add new")}
      </Button>
    </Link>
  );
}

export default LinksButtons;

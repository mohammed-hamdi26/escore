"use client";

import { usePathname } from "@/i18n/navigation";
import LinksButtons from "@/components/ui app/LinksButtons";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";

function PlayersHeader() {
  const t = useTranslations("PlayerManagement");
  const pathname = usePathname();

  // Hide header on main list page (has its own header) and view page
  if (pathname === "/dashboard/player-management" || pathname.includes("/view/")) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
          <User className="size-5 text-green-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Player Management"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("description") || "Manage all players and their profiles"}
          </p>
        </div>
      </div>
      <LinksButtons />
    </div>
  );
}

export default PlayersHeader;

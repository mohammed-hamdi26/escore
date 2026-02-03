"use client";

import { usePathname } from "@/i18n/navigation";
import LinksButtons from "@/components/ui app/LinksButtons";
import { useTranslations } from "next-intl";
import { Gamepad2 } from "lucide-react";

function GamesHeader() {
  const t = useTranslations("GamesManagement");
  const pathname = usePathname();

  // Hide header on view page
  if (pathname.includes("/view/")) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
          <Gamepad2 className="size-5 text-green-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Games Management"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("description") || "Manage all games and their settings"}
          </p>
        </div>
      </div>
      <LinksButtons />
    </div>
  );
}

export default GamesHeader;

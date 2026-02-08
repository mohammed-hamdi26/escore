"use client";

import { usePathname } from "@/i18n/navigation";
import LinksButtons from "@/components/ui app/LinksButtons";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";

function TournamentsHeader() {
  const t = useTranslations("TournamentsManagement");
  const pathname = usePathname();

  // Hide header on view and standings pages
  if (pathname.includes("/view/") || pathname.includes("/standings/")) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
          <Trophy className="size-5 text-green-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Tournaments Management"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("description") || "Manage all tournaments and competitions"}
          </p>
        </div>
      </div>
      <LinksButtons />
    </div>
  );
}

export default TournamentsHeader;

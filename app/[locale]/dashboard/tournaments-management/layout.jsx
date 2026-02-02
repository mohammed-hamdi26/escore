import React from "react";
import LinksButtons from "@/components/ui app/LinksButtons";
import { getTranslations } from "next-intl/server";
import { Trophy } from "lucide-react";

export default async function TournamentsManagementLayout({ children }) {
  const t = await getTranslations("TournamentsManagement");

  return (
    <div className="space-y-6">
      {/* Page Header */}
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

      {/* Content */}
      {children}
    </div>
  );
}

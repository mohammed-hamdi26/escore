"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, Swords } from "lucide-react";

function MatchesHeader({ matchesCount = 0 }) {
  const t = useTranslations("MatchesList");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-primary/10">
            <Swords className="size-6 text-green-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("subtitle", { count: matchesCount })}
            </p>
          </div>
        </div>
      </div>
      <Link href="/dashboard/matches-management/add">
        <Button className="bg-green-primary hover:bg-green-primary/90 gap-2">
          <Plus className="size-4" />
          {t("addMatch")}
        </Button>
      </Link>
    </div>
  );
}

export default MatchesHeader;

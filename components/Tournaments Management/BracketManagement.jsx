"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeft, Trophy, Pencil, BarChart3 } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import BracketView from "./BracketView";

function BracketManagement({ tournament }) {
  const t = useTranslations("TournamentDetails");
  const tournamentId = tournament.id || tournament._id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/tournaments-management/view/${tournamentId}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {tournament.logo?.light && (
              <img
                src={getImgUrl(tournament.logo.light, "thumbnail")}
                alt={tournament.name}
                className="size-10 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {tournament.name}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Trophy className="size-3.5" />
                {t("bracketManagement") || "Bracket Management"}
                {tournament.bracketType && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50">
                    {tournament.bracketType.replace(/_/g, " ")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/tournaments-management/standings/${tournamentId}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-green-primary/30 text-green-primary hover:bg-green-primary/10"
            >
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">{t("manageStandings") || "Standings"}</span>
            </Button>
          </Link>
          <Link href={`/dashboard/tournaments-management/edit/${tournamentId}`}>
            <Button
              size="sm"
              className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
            >
              <Pencil className="size-4" />
              <span className="hidden sm:inline">{t("edit") || "Edit"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Bracket View - Full Page */}
      <BracketView tournament={tournament} />
    </div>
  );
}

export default BracketManagement;

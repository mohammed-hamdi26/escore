"use client";

import { useTranslations } from "next-intl";
import { Trophy, Users, Swords, Settings2 } from "lucide-react";
import { estimateMatchCount, getBracketConfigSummary } from "@/lib/bracket-preview";

const BRACKET_TYPE_LABELS = {
  single_elimination: "Single Elimination",
  double_elimination: "Double Elimination",
  round_robin: "Round Robin",
  swiss: "Swiss System",
  battle_royale: "Battle Royale",
  custom: "Custom",
  multi_stage: "Multi-Stage",
};

function BracketPreviewSummary({ bracketType, teamCount, config }) {
  const t = useTranslations("TournamentDetails");

  const matchCount = estimateMatchCount(bracketType, teamCount, config);
  const configDetails = getBracketConfigSummary(bracketType, config);
  const typeLabel = t(bracketType === "single_elimination" ? "singleElimination" :
    bracketType === "double_elimination" ? "doubleElimination" :
    bracketType === "round_robin" ? "roundRobin" :
    bracketType === "swiss" ? "swissSystem" :
    bracketType === "battle_royale" ? "battleRoyaleBracket" :
    bracketType === "custom" ? "customBracket" :
    "multiStage") || BRACKET_TYPE_LABELS[bracketType] || bracketType;

  return (
    <div className="space-y-3 mt-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 dark:bg-[#1a1d2e]">
          <Trophy className="size-4 text-green-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{t("bracketType") || "Bracket Type"}</p>
            <p className="text-sm font-medium text-foreground">{typeLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 dark:bg-[#1a1d2e]">
          <Users className="size-4 text-green-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{t("teamsCount") || "Teams"}</p>
            <p className="text-sm font-medium text-foreground">{teamCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 dark:bg-[#1a1d2e]">
          <Swords className="size-4 text-green-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{t("estimatedMatches") || "Estimated Matches"}</p>
            <p className="text-sm font-medium text-foreground">~{matchCount}</p>
          </div>
        </div>
        {configDetails.length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 dark:bg-[#1a1d2e]">
            <Settings2 className="size-4 text-green-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t("configuration") || "Configuration"}</p>
              <p className="text-sm font-medium text-foreground">{configDetails.join(" · ")}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-amber-500 dark:text-amber-400">
        {t("thisCannotBeUndone") || "This action cannot be undone. The bracket will need to be deleted to regenerate."}
      </p>
    </div>
  );
}

export default BracketPreviewSummary;

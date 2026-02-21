"use client";

import { useTranslations } from "next-intl";
import BracketRounds from "./BracketRounds";

function SingleElimDisplay({ bracket }) {
  const t = useTranslations("TournamentDetails");

  if (!bracket.rounds?.winners || bracket.rounds.winners.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-muted-foreground mb-4">
        {t("winnersBracket") || "Winners Bracket"}
      </h4>
      <BracketRounds rounds={bracket.rounds.winners} />
    </div>
  );
}

export default SingleElimDisplay;

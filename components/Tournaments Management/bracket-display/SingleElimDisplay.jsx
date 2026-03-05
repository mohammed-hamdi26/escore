"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import BracketRounds from "./BracketRounds";
import MatchResultDialog from "../MatchResultDialog";
import { updateBracketMatchResultAction } from "@/app/[locale]/_Lib/actions";

function SingleElimDisplay({ bracket, tournament, onRefresh, participationType }) {
  const t = useTranslations("TournamentDetails");
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (!bracket.rounds?.winners || bracket.rounds.winners.length === 0) {
    return null;
  }

  const handleMatchClick = tournament ? (match) => {
    if (!match.team1 && !match.team2 && !match.player1 && !match.player2) return;
    setSelectedMatch(match);
  } : undefined;

  const handleResultSet = () => {
    setSelectedMatch(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-muted-foreground mb-4">
        {t("winnersBracket") || "Winners Bracket"}
      </h4>
      <BracketRounds rounds={bracket.rounds.winners} onMatchClick={handleMatchClick} />

      {selectedMatch && tournament && (
        <MatchResultDialog
          open={!!selectedMatch}
          onOpenChange={(open) => { if (!open) setSelectedMatch(null); }}
          tournament={tournament}
          match={selectedMatch}
          onResultSet={handleResultSet}
          participationType={participationType || "team"}
          saveAction={updateBracketMatchResultAction}
        />
      )}
    </div>
  );
}

export default SingleElimDisplay;

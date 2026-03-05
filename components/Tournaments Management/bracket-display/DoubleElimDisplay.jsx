"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import BracketMatchCard from "../BracketMatchCard";
import BracketRounds from "./BracketRounds";
import MatchResultDialog from "../MatchResultDialog";
import { updateBracketMatchResultAction } from "@/app/[locale]/_Lib/actions";

function DoubleElimDisplay({ bracket, tournament, onRefresh, participationType }) {
  const t = useTranslations("TournamentDetails");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleMatchClick = tournament ? (match) => {
    if (!match.team1 && !match.team2 && !match.player1 && !match.player2) return;
    setSelectedMatch(match);
  } : undefined;

  const handleResultSet = () => {
    setSelectedMatch(null);
    if (onRefresh) onRefresh();
  };

  return (
    <>
      {/* Winners Bracket */}
      {bracket.rounds?.winners && bracket.rounds.winners.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            {t("winnersBracket") || "Winners Bracket"}
          </h4>
          <BracketRounds rounds={bracket.rounds.winners} onMatchClick={handleMatchClick} />
        </div>
      )}

      {/* Losers Bracket */}
      {bracket.rounds?.losers && bracket.rounds.losers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            {t("losersBracket") || "Losers Bracket"}
          </h4>
          <BracketRounds rounds={bracket.rounds.losers} onMatchClick={handleMatchClick} />
        </div>
      )}

      {/* Grand Finals */}
      {bracket.rounds?.grandFinals &&
        bracket.rounds.grandFinals.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              {t("grandFinals") || "Grand Finals"}
            </h4>
            <div className="flex justify-center">
              <div className="flex flex-col gap-3">
                {bracket.rounds.grandFinals.map((match) => (
                  <BracketMatchCard key={match.id} match={match} onClick={handleMatchClick} />
                ))}
              </div>
            </div>
          </div>
        )}

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
    </>
  );
}

export default DoubleElimDisplay;

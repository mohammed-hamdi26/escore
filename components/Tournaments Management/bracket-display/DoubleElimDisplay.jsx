"use client";

import { useTranslations } from "next-intl";
import BracketMatchCard from "../BracketMatchCard";
import BracketRounds from "./BracketRounds";

function DoubleElimDisplay({ bracket }) {
  const t = useTranslations("TournamentDetails");

  return (
    <>
      {/* Winners Bracket */}
      {bracket.rounds?.winners && bracket.rounds.winners.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            {t("winnersBracket") || "Winners Bracket"}
          </h4>
          <BracketRounds rounds={bracket.rounds.winners} />
        </div>
      )}

      {/* Losers Bracket */}
      {bracket.rounds?.losers && bracket.rounds.losers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            {t("losersBracket") || "Losers Bracket"}
          </h4>
          <BracketRounds rounds={bracket.rounds.losers} />
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
                  <BracketMatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          </div>
        )}
    </>
  );
}

export default DoubleElimDisplay;

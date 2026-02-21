"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import { Play, Loader2 } from "lucide-react";
import BracketMatchCard from "../BracketMatchCard";
import ConfirmationDialog from "../shared/ConfirmationDialog";

function SwissDisplay({ bracket, onAdvanceRound, advancingRound }) {
  const t = useTranslations("TournamentDetails");
  const [showAdvanceConfirm, setShowAdvanceConfirm] = useState(false);

  if (!bracket.swissRounds || bracket.swissRounds.length === 0) {
    return null;
  }

  const currentRoundIndex = (bracket.currentSwissRound || 1) - 1;
  const currentRoundMatches = bracket.swissRounds[currentRoundIndex]?.matches || [];
  const incompleteCount = currentRoundMatches.filter((m) => m.status !== "completed" && !m.result?.winner).length;
  const nextRound = (bracket.currentSwissRound || 1) + 1;

  const advanceDescription = incompleteCount > 0
    ? (t("advanceSwissIncomplete") || "Warning: {count} matches in the current round are incomplete. Generate Round {next} anyway?")
        .replace("{count}", String(incompleteCount))
        .replace("{next}", String(nextRound))
    : (t("advanceSwissConfirm") || "Generate Round {next} matches based on current standings. Teams with the same record will be paired.")
        .replace("{next}", String(nextRound));

  const handleAdvanceConfirmed = async () => {
    setShowAdvanceConfirm(false);
    await onAdvanceRound();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          {t("swissRounds") || "Swiss Rounds"}
        </h4>
        {bracket.bracketStatus !== "completed" && (
          <Button
            onClick={() => setShowAdvanceConfirm(true)}
            disabled={advancingRound}
            size="sm"
            className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
          >
            {advancingRound ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("advancing") || "Advancing..."}
              </>
            ) : (
              <>
                <Play className="size-4" />
                {t("advanceToNextRound") || "Advance to Next Round"}
              </>
            )}
          </Button>
        )}
      </div>

      <ConfirmationDialog
        open={showAdvanceConfirm}
        onOpenChange={setShowAdvanceConfirm}
        title={(t("advanceToRound") || "Advance to Round {next}").replace("{next}", String(nextRound))}
        description={advanceDescription}
        confirmLabel={(t("generateRound") || "Generate Round {next}").replace("{next}", String(nextRound))}
        onConfirm={handleAdvanceConfirmed}
      />
      <div className="space-y-6">
        {bracket.swissRounds.map((round, roundIndex) => (
          <div key={roundIndex}>
            <div className="text-center mb-3">
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  roundIndex === (bracket.currentSwissRound || 1) - 1
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {round.name || `Round ${roundIndex + 1}`}
                {roundIndex === (bracket.currentSwissRound || 1) - 1 &&
                  ` (${t("current") || "Current"})`}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
              {round.matches.map((match) => (
                <BracketMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SwissDisplay;

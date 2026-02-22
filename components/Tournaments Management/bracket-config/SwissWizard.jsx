"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

const COMPETITIVENESS_PRESETS = [
  { label: "Quick", rounds: 3, icon: "3" },
  { label: "Standard", rounds: 5, icon: "5" },
  { label: "Thorough", rounds: 7, icon: "7" },
  { label: "Extended", rounds: 9, icon: "9" },
];

function SwissWizard({ swissConfig, teamCount, onConfigChange }) {
  const t = useTranslations("TournamentDetails");
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const { totalRounds, winsToQualify, lossesToEliminate } = swissConfig;

  const setRounds = (rounds) => {
    // Auto-adjust wins/losses to be sensible for the round count
    const wins = Math.ceil(rounds / 2) + (rounds > 4 ? 1 : 0);
    const losses = Math.min(wins, rounds - wins + 1);
    onConfigChange({
      swissConfig: {
        totalRounds: rounds,
        winsToQualify: Math.min(wins, rounds),
        lossesToEliminate: Math.min(losses, rounds),
      },
    });
  };

  const adjustQualify = (delta) => {
    const newVal = Math.max(1, Math.min(totalRounds, winsToQualify + delta));
    onConfigChange({ swissConfig: { ...swissConfig, winsToQualify: newVal } });
  };

  const adjustEliminate = (delta) => {
    const newVal = Math.max(1, Math.min(totalRounds, lossesToEliminate + delta));
    onConfigChange({ swissConfig: { ...swissConfig, lossesToEliminate: newVal } });
  };

  // Estimate qualifying teams
  const estimateQualifying = () => {
    if (teamCount <= 0) return "?";
    // Rough estimate: teams that can reach winsToQualify
    const ratio = winsToQualify / totalRounds;
    return Math.max(1, Math.round(teamCount * (1 - ratio)));
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Team Count (read-only) */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
        <span className="text-xs font-bold text-green-primary bg-green-primary/10 px-2 py-0.5 rounded">1</span>
        <div>
          <p className="text-sm font-medium text-foreground">
            {teamCount} {t("teamsCount") || "teams"}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("teamsInTournament") || "Teams in this tournament"}
          </p>
        </div>
      </div>

      {/* Step 2: Competitiveness (rounds) */}
      <div className="p-3 rounded-lg bg-muted/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold text-green-primary bg-green-primary/10 px-2 py-0.5 rounded">2</span>
          <p className="text-sm font-medium text-foreground">
            {t("howCompetitive") || "How competitive?"}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {COMPETITIVENESS_PRESETS.map((preset) => (
            <button
              key={preset.rounds}
              type="button"
              onClick={() => setRounds(preset.rounds)}
              className={`p-3 rounded-lg border text-center transition-all ${
                totalRounds === preset.rounds
                  ? "border-green-primary bg-green-primary/10 text-green-primary"
                  : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
              }`}
            >
              <div className="text-lg font-bold">{preset.icon}</div>
              <div className="text-xs mt-0.5">
                {t(`swiss${preset.label}`) || preset.label}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t("roundsExplanation") || `${totalRounds} rounds — more rounds = more accurate rankings`}
        </p>
      </div>

      {/* Step 3: Thresholds */}
      <div className="p-3 rounded-lg bg-muted/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold text-green-primary bg-green-primary/10 px-2 py-0.5 rounded">3</span>
          <p className="text-sm font-medium text-foreground">
            {t("qualificationThresholds") || "Qualification Thresholds"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Wins to qualify */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              {t("winsToQualify") || "Wins to Qualify"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => adjustQualify(-1)}
                disabled={winsToQualify <= 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
              >
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              <span className="text-2xl font-bold text-green-primary w-8 text-center">
                {winsToQualify}
              </span>
              <button
                type="button"
                onClick={() => adjustQualify(1)}
                disabled={winsToQualify >= totalRounds}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
              >
                <ChevronUp className="size-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-[10px] text-green-primary/70 mt-1">
              ~{estimateQualifying()} {t("qualify") || "qualify"}
            </p>
          </div>
          {/* Losses to eliminate */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              {t("lossesToEliminate") || "Losses to Eliminate"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => adjustEliminate(-1)}
                disabled={lossesToEliminate <= 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
              >
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              <span className="text-2xl font-bold text-red-500 w-8 text-center">
                {lossesToEliminate}
              </span>
              <button
                type="button"
                onClick={() => adjustEliminate(1)}
                disabled={lossesToEliminate >= totalRounds}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
              >
                <ChevronUp className="size-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-[10px] text-red-500/70 mt-1">
              {t("eliminated") || "eliminated"}
            </p>
          </div>
        </div>
      </div>

      {/* How Swiss Works */}
      <button
        type="button"
        onClick={() => setShowHowItWorks(!showHowItWorks)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="size-3.5" />
        {t("howSwissWorks") || "How Swiss format works"}
        <ChevronDown className={`size-3 transition-transform ${showHowItWorks ? "rotate-180" : ""}`} />
      </button>
      {showHowItWorks && (
        <div className="p-3 rounded-lg bg-muted/10 border border-gray-200 dark:border-gray-700 text-xs text-muted-foreground space-y-2">
          <p><strong>Round 1:</strong> {t("swissRound1") || "Random pairing. All teams start 0-0."}</p>
          <p><strong>Round 2+:</strong> {t("swissRound2") || "Teams with similar records are paired (1-0 vs 1-0, 0-1 vs 0-1)."}</p>
          <p><strong>{t("qualify") || "Qualify"}:</strong> {t("swissQualifyExplain") || `Reach ${winsToQualify} wins → advance to next stage.`}</p>
          <p><strong>{t("eliminated") || "Eliminated"}:</strong> {t("swissEliminateExplain") || `Reach ${lossesToEliminate} losses → out of tournament.`}</p>
        </div>
      )}
    </div>
  );
}

export default SwissWizard;

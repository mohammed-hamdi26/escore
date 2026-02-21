"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

function countMatches(bracket) {
  let total = 0;
  let completed = 0;

  const countFromRounds = (rounds) => {
    if (!rounds) return;
    rounds.forEach((r) => {
      if (r.matches) {
        total += r.matches.length;
        completed += r.matches.filter((m) => m.status === "completed" || m.result?.winner).length;
      }
    });
  };

  const countFromMatchArray = (matches) => {
    if (!matches) return;
    total += matches.length;
    completed += matches.filter((m) => m.status === "completed" || m.result?.winner).length;
  };

  // Multi-stage
  if (bracket.isMultiStage && bracket.stages) {
    bracket.stages.forEach((stage) => {
      if (!stage.isGenerated) return;
      if (stage.groups) {
        stage.groups.forEach((g) => countFromRounds(g.rounds));
      }
      if (stage.swissRounds) {
        countFromRounds(stage.swissRounds);
      }
      if (stage.rounds) {
        if (stage.rounds.winners) countFromRounds(stage.rounds.winners);
        if (stage.rounds.losers) countFromRounds(stage.rounds.losers);
        if (stage.rounds.grandFinals) countFromMatchArray(stage.rounds.grandFinals);
      }
    });
    return { total, completed };
  }

  // Custom bracket
  if (bracket.bracketType === "custom") {
    countFromMatchArray(bracket.matches);
    return { total, completed };
  }

  // Round robin
  if (bracket.groups) {
    bracket.groups.forEach((g) => countFromRounds(g.rounds));
  }

  // Swiss
  if (bracket.swissRounds) {
    countFromRounds(bracket.swissRounds);
  }

  // Battle royale
  if (bracket.battleRoyaleRounds) {
    bracket.battleRoyaleRounds.forEach((r) => {
      if (r.matches) {
        total += r.matches.length;
        completed += r.matches.filter((m) => m.status === "completed" || m.result?.winner || m.participants?.some((p) => p.placement)).length;
      }
    });
  }

  // SE / DE
  if (bracket.rounds) {
    if (bracket.rounds.winners) countFromRounds(bracket.rounds.winners);
    if (bracket.rounds.losers) countFromRounds(bracket.rounds.losers);
    if (bracket.rounds.grandFinals) countFromMatchArray(bracket.rounds.grandFinals);
    // Single elim uses rounds directly as array
    if (Array.isArray(bracket.rounds)) countFromRounds(bracket.rounds);
  }

  return { total, completed };
}

function BracketProgressBar({ bracket }) {
  const t = useTranslations("TournamentDetails");

  const { total, completed } = useMemo(() => countMatches(bracket), [bracket]);

  if (total === 0) return null;

  const percentage = Math.round((completed / total) * 100);
  const remaining = total - completed;

  return (
    <div className="mb-5">
      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-green-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${t("bracketProgress") || "Bracket progress"}: ${percentage}%`}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[11px] text-muted-foreground">
          {completed} / {total} {t("matchesCompleted") || "matches completed"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default BracketProgressBar;

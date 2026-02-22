"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { generatePreviewStructure } from "@/lib/bracket-structure";

// --- Preview Match Card ---

function PreviewMatchCard({ seed1, seed2 }) {
  return (
    <div className="rounded-lg border border-gray-300/50 dark:border-gray-600/50 overflow-hidden min-w-[150px] max-w-[180px] bg-background/50">
      <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className={`text-xs truncate ${seed1 === "BYE" ? "text-muted-foreground/40 italic" : "text-foreground/70"}`}>
            {seed1}
          </span>
          <span className="text-xs text-muted-foreground/50 font-mono">-</span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className={`text-xs truncate ${seed2 === "BYE" ? "text-muted-foreground/40 italic" : "text-foreground/70"}`}>
            {seed2}
          </span>
          <span className="text-xs text-muted-foreground/50 font-mono">-</span>
        </div>
      </div>
    </div>
  );
}

// --- Single Elimination Preview ---

function SingleElimPreview({ structure }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-6 min-w-fit">
        {structure.rounds.map((round, ri) => (
          <div key={ri} className="flex flex-col">
            <div className="text-center mb-2">
              <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                {round.name}
              </span>
            </div>
            <div className="flex flex-col justify-around flex-1 gap-3">
              {round.matches.map((match, mi) => (
                <PreviewMatchCard key={mi} seed1={match.seed1} seed2={match.seed2} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Double Elimination Preview ---

function DoubleElimPreview({ structure }) {
  return (
    <div className="space-y-4">
      {/* Winners */}
      <div>
        <h5 className="text-xs font-medium text-green-500 mb-2">Winners</h5>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-6 min-w-fit">
            {structure.winners.map((round, ri) => (
              <div key={ri} className="flex flex-col">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                    {round.name}
                  </span>
                </div>
                <div className="flex flex-col justify-around flex-1 gap-3">
                  {round.matches.map((match, mi) => (
                    <PreviewMatchCard key={mi} seed1={match.seed1} seed2={match.seed2} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Losers */}
      <div>
        <h5 className="text-xs font-medium text-red-400 mb-2">Losers</h5>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-6 min-w-fit">
            {structure.losers.map((round, ri) => (
              <div key={ri} className="flex flex-col">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                    {round.name}
                  </span>
                </div>
                <div className="flex flex-col justify-around flex-1 gap-3">
                  {round.matches.map((match, mi) => (
                    <PreviewMatchCard key={mi} seed1={match.seed1} seed2={match.seed2} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grand Finals */}
      <div>
        <h5 className="text-xs font-medium text-purple-400 mb-2">Grand Finals</h5>
        <div className="flex gap-6">
          {structure.grandFinals.map((round, ri) => (
            <div key={ri} className="flex flex-col">
              <div className="flex flex-col gap-3">
                {round.matches.map((match, mi) => (
                  <PreviewMatchCard key={mi} seed1={match.seed1} seed2={match.seed2} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Round Robin Preview ---

function RoundRobinPreview({ structure, t }) {
  return (
    <div className="space-y-3">
      {structure.groups.map((group, gi) => (
        <div key={gi} className="rounded-lg border border-gray-300/50 dark:border-gray-600/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">{group.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {group.teamCount} {t("teams") || "teams"} · {group.totalMatches} {t("matchesLower") || "matches"}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {group.rounds.map((round, ri) => (
              <span
                key={ri}
                className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground"
              >
                {round.name} ({round.matchCount})
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Swiss Preview ---

function SwissPreview({ structure, t }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {structure.rounds.map((round, ri) => (
          <div
            key={ri}
            className="rounded-lg border border-gray-300/50 dark:border-gray-600/50 p-2 min-w-[100px] text-center"
          >
            <span className="text-[10px] font-medium text-muted-foreground block">
              {round.name}
            </span>
            <span className="text-xs text-foreground/70">
              {round.matchCount} {t("matchesLower") || "matches"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Renderer ---

function BracketPreviewRenderer({ bracketType, teamCount, config = {} }) {
  const t = useTranslations("TournamentDetails");

  const structure = useMemo(() => {
    if (!bracketType || teamCount < 2) return null;
    return generatePreviewStructure(bracketType, teamCount, config);
  }, [bracketType, teamCount, config]);

  if (!structure) {
    return (
      <div className="text-center py-4 text-xs text-muted-foreground">
        {t("noPreviewAvailable") || "No preview available for this configuration."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {t("bracketStructurePreview") || "Bracket Structure Preview"}
        </span>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {structure.totalMatches} {t("matchesLower") || "matches"}
        </span>
      </div>

      {/* Type-specific preview */}
      {structure.type === "single_elimination" && (
        <SingleElimPreview structure={structure} />
      )}
      {structure.type === "double_elimination" && (
        <DoubleElimPreview structure={structure} />
      )}
      {structure.type === "round_robin" && (
        <RoundRobinPreview structure={structure} t={t} />
      )}
      {structure.type === "swiss" && (
        <SwissPreview structure={structure} t={t} />
      )}
    </div>
  );
}

export default BracketPreviewRenderer;

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Swords, CheckCircle, Clock, Users, SkipForward, GitBranch } from "lucide-react";

function countBracketStats(bracket) {
  let totalMatches = 0;
  let completedMatches = 0;

  const countFromRounds = (rounds) => {
    if (!rounds) return;
    rounds.forEach((r) => {
      if (r.matches) {
        totalMatches += r.matches.length;
        completedMatches += r.matches.filter((m) => m.status === "completed" || m.result?.winner).length;
      }
    });
  };

  const countFromMatchArray = (matches) => {
    if (!matches) return;
    totalMatches += matches.length;
    completedMatches += matches.filter((m) => m.status === "completed" || m.result?.winner).length;
  };

  if (bracket.isMultiStage && bracket.stages) {
    bracket.stages.forEach((stage) => {
      if (!stage.isGenerated) return;
      if (stage.groups) stage.groups.forEach((g) => countFromRounds(g.rounds));
      if (stage.swissRounds) countFromRounds(stage.swissRounds);
      if (stage.rounds) {
        if (stage.rounds.winners) countFromRounds(stage.rounds.winners);
        if (stage.rounds.losers) countFromRounds(stage.rounds.losers);
        if (stage.rounds.grandFinals) countFromMatchArray(stage.rounds.grandFinals);
      }
    });
  } else if (bracket.bracketType === "custom") {
    countFromMatchArray(bracket.matches);
  } else {
    if (bracket.groups) bracket.groups.forEach((g) => countFromRounds(g.rounds));
    if (bracket.swissRounds) countFromRounds(bracket.swissRounds);
    if (bracket.battleRoyaleRounds) {
      bracket.battleRoyaleRounds.forEach((r) => {
        if (r.matches) {
          totalMatches += r.matches.length;
          completedMatches += r.matches.filter((m) => m.status === "completed" || m.result?.winner || m.participants?.some((p) => p.placement)).length;
        }
      });
    }
    if (bracket.rounds) {
      if (bracket.rounds.winners) countFromRounds(bracket.rounds.winners);
      if (bracket.rounds.losers) countFromRounds(bracket.rounds.losers);
      if (bracket.rounds.grandFinals) countFromMatchArray(bracket.rounds.grandFinals);
      if (Array.isArray(bracket.rounds)) countFromRounds(bracket.rounds);
    }
  }

  return { totalMatches, completedMatches };
}

function StatCard({ icon: Icon, value, label, color = "text-green-primary" }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/20 dark:bg-[#1a1d2e]/50 min-w-0">
      <Icon className={`size-4 flex-shrink-0 ${color}`} />
      <div className="min-w-0">
        <div className="text-sm font-bold text-foreground">{value}</div>
        <div className="text-[10px] text-muted-foreground truncate">{label}</div>
      </div>
    </div>
  );
}

const BRACKET_TYPE_LABELS = {
  single_elimination: "singleElimination",
  double_elimination: "doubleElimination",
  round_robin: "roundRobin",
  swiss: "swissSystem",
  battle_royale: "battleRoyaleBracket",
  multi_stage: "multiStage",
  custom: "customBracket",
};

function BracketQuickStats({ bracket }) {
  const t = useTranslations("TournamentDetails");

  const { totalMatches, completedMatches } = useMemo(() => countBracketStats(bracket), [bracket]);

  const remaining = totalMatches - completedMatches;
  const teamCount = bracket.seeds?.length || bracket.teamCount || 0;

  const typeKey = BRACKET_TYPE_LABELS[bracket.bracketType] || bracket.bracketType;
  const typeName = t(typeKey) || bracket.bracketType;

  // Current round info
  let currentRound = null;
  if (bracket.bracketType === "swiss" && bracket.currentSwissRound) {
    currentRound = `${bracket.currentSwissRound}/${bracket.swissConfig?.totalRounds || "?"}`;
  } else if (bracket.bracketType === "battle_royale" && bracket.currentBRRound) {
    currentRound = `${bracket.currentBRRound}/${bracket.battleRoyaleConfig?.totalRounds || "?"}`;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-5">
      <StatCard
        icon={Swords}
        value={totalMatches}
        label={t("totalMatches") || "Total Matches"}
        color="text-blue-500"
      />
      <StatCard
        icon={CheckCircle}
        value={completedMatches}
        label={t("completed") || "Completed"}
        color="text-green-500"
      />
      <StatCard
        icon={Clock}
        value={remaining}
        label={t("remaining") || "Remaining"}
        color="text-amber-500"
      />
      {teamCount > 0 && (
        <StatCard
          icon={Users}
          value={teamCount}
          label={t("teamsPlayers") || "Teams/Players"}
          color="text-purple-500"
        />
      )}
      {currentRound ? (
        <StatCard
          icon={SkipForward}
          value={currentRound}
          label={t("currentRound") || "Current Round"}
          color="text-green-primary"
        />
      ) : (
        <StatCard
          icon={GitBranch}
          value={typeName}
          label={t("bracketType") || "Type"}
          color="text-green-primary"
        />
      )}
    </div>
  );
}

export default BracketQuickStats;

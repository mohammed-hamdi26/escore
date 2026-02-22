"use client";

import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { getImgUrl } from "@/lib/utils";

const STATUS_COLORS = {
  scheduled: "border-gray-500/30 bg-gray-500/5",
  live: "border-green-500/30 bg-green-500/5 ring-1 ring-green-500/20",
  completed: "border-purple-500/30 bg-purple-500/5",
};

function MobileTeamRow({ team, score, isWinner, isBye, t }) {
  if (isBye) {
    return (
      <div className="flex items-center justify-between px-4 py-3 opacity-40">
        <span className="text-sm text-muted-foreground italic">{t("bye") || "BYE"}</span>
        <span className="text-sm text-muted-foreground">-</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-between px-4 py-3 opacity-50">
        <span className="text-sm text-muted-foreground italic">{t("tbd") || "TBD"}</span>
        <span className="text-sm text-muted-foreground">-</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 transition-colors ${
        isWinner ? "bg-green-500/10" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {team.logo?.light ? (
          <img
            src={getImgUrl(team.logo.light, "thumbnail")}
            alt={team.name}
            className="size-8 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="size-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Trophy className="size-4 text-muted-foreground" />
          </div>
        )}
        <span
          className={`text-sm truncate ${
            isWinner ? "font-bold text-green-500" : "text-foreground"
          }`}
        >
          {team.name}
        </span>
      </div>
      <span
        className={`text-base font-mono ml-3 ${
          isWinner ? "font-bold text-green-500" : "text-muted-foreground"
        }`}
      >
        {score ?? "-"}
      </span>
    </div>
  );
}

function BracketMatchCardMobile({ match }) {
  const t = useTranslations("TournamentDetails");
  const statusColor = STATUS_COLORS[match.status] || STATUS_COLORS.scheduled;

  const winnerId = match.result?.winner;
  const team1Score = match.result?.team1Score ?? null;
  const team2Score = match.result?.team2Score ?? null;

  const isTeam1Winner =
    winnerId && match.team1 && winnerId === (match.team1.id || match.team1._id);
  const isTeam2Winner =
    winnerId && match.team2 && winnerId === (match.team2.id || match.team2._id);

  return (
    <div className={`rounded-xl border overflow-hidden w-full ${statusColor}`}>
      {/* Match header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-white/5">
        <span className="text-xs text-muted-foreground font-medium">
          {match.isResetMatch
            ? (t("gfReset") || "GF Reset")
            : match.group
            ? `${match.group}`
            : match.round || match.roundName || `R${match.bracketRound}`}
        </span>
        {match.status === "live" && (
          <span className="text-xs text-green-500 font-bold uppercase animate-pulse">
            {t("live") || "LIVE"}
          </span>
        )}
        {match.status === "completed" && (
          <span className="text-xs text-purple-500 font-medium">
            {t("final") || "Final"}
          </span>
        )}
        {match.bestOf && match.bestOf > 1 && (
          <span className="text-xs text-muted-foreground">Bo{match.bestOf}</span>
        )}
      </div>

      {/* Teams */}
      <div className="divide-y divide-white/5">
        <MobileTeamRow
          team={match.team1}
          score={team1Score}
          isWinner={isTeam1Winner}
          isBye={false}
          t={t}
        />
        <MobileTeamRow
          team={match.team2}
          score={team2Score}
          isWinner={isTeam2Winner}
          isBye={match.isBye}
          t={t}
        />
      </div>
    </div>
  );
}

export default BracketMatchCardMobile;

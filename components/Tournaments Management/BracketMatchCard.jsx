"use client";

import { Trophy } from "lucide-react";

const STATUS_COLORS = {
  scheduled: "border-gray-500/30 bg-gray-500/5",
  live: "border-green-500/30 bg-green-500/5 ring-1 ring-green-500/20",
  completed: "border-purple-500/30 bg-purple-500/5",
};

function TeamRow({ team, score, isWinner, isBye }) {
  if (isBye) {
    return (
      <div className="flex items-center justify-between px-3 py-2 opacity-40">
        <span className="text-xs text-muted-foreground italic">BYE</span>
        <span className="text-xs text-muted-foreground">-</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-between px-3 py-2 opacity-50">
        <span className="text-xs text-muted-foreground italic">TBD</span>
        <span className="text-xs text-muted-foreground">-</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 transition-colors ${
        isWinner
          ? "bg-green-500/10"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {team.logo?.light ? (
          <img
            src={team.logo.light}
            alt={team.name}
            className="size-5 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="size-5 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Trophy className="size-3 text-muted-foreground" />
          </div>
        )}
        <span
          className={`text-xs truncate ${
            isWinner ? "font-bold text-green-500" : "text-foreground"
          }`}
        >
          {team.name}
        </span>
      </div>
      <span
        className={`text-xs font-mono ml-2 ${
          isWinner ? "font-bold text-green-500" : "text-muted-foreground"
        }`}
      >
        {score ?? "-"}
      </span>
    </div>
  );
}

function BracketMatchCard({ match }) {
  const statusColor = STATUS_COLORS[match.status] || STATUS_COLORS.scheduled;
  const winnerId = match.result?.winner;

  const team1Score = match.result?.team1Score ?? null;
  const team2Score = match.result?.team2Score ?? null;

  const isTeam1Winner =
    winnerId && match.team1 && winnerId === (match.team1.id || match.team1._id);
  const isTeam2Winner =
    winnerId && match.team2 && winnerId === (match.team2.id || match.team2._id);

  return (
    <div
      className={`rounded-lg border overflow-hidden min-w-[180px] max-w-[220px] ${statusColor}`}
    >
      {/* Match header */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/30 border-b border-white/5">
        <span className="text-[10px] text-muted-foreground font-medium">
          {match.roundName || `R${match.bracketRound}`}
        </span>
        {match.status === "live" && (
          <span className="text-[10px] text-green-500 font-bold uppercase animate-pulse">
            LIVE
          </span>
        )}
        {match.status === "completed" && (
          <span className="text-[10px] text-purple-500 font-medium">
            Final
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="divide-y divide-white/5">
        <TeamRow
          team={match.team1}
          score={team1Score}
          isWinner={isTeam1Winner}
          isBye={false}
        />
        <TeamRow
          team={match.team2}
          score={team2Score}
          isWinner={isTeam2Winner}
          isBye={match.isBye}
        />
      </div>

      {/* Best of indicator */}
      {match.bestOf && match.bestOf > 1 && (
        <div className="px-3 py-1 bg-muted/20 border-t border-white/5">
          <span className="text-[10px] text-muted-foreground">
            Bo{match.bestOf}
          </span>
        </div>
      )}
    </div>
  );
}

export default BracketMatchCard;

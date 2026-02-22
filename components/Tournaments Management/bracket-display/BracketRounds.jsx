"use client";

import { useMemo } from "react";
import { CheckCircle, Clock, Circle } from "lucide-react";
import BracketMatchCard from "../BracketMatchCard";

function RoundProgressBadge({ matches }) {
  const { completed, total } = useMemo(() => {
    const t = matches?.length || 0;
    const c = matches?.filter((m) => m.status === "completed" || m.result?.winner).length || 0;
    return { completed: c, total: t };
  }, [matches]);

  if (total === 0) return null;

  if (completed === total) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-medium">
        <CheckCircle className="size-3" />
        {completed}/{total}
      </span>
    );
  }

  if (completed > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-medium">
        <Clock className="size-3" />
        {completed}/{total}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 font-medium">
      <Circle className="size-3" />
      0/{total}
    </span>
  );
}

function BracketRounds({ rounds }) {
  return (
    <div className="pb-4">
      <div className="flex gap-8 min-w-fit">
        {rounds.map((round) => (
          <div key={`${round.name}-${round.round}`} className="flex flex-col">
            {/* Round Header */}
            <div className="text-center mb-3 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted/50">
                {round.name}
              </span>
              <RoundProgressBadge matches={round.matches} />
            </div>
            {/* Matches */}
            <div className="flex flex-col justify-around flex-1 gap-4">
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

export default BracketRounds;

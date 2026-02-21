"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import {
  Trophy,
  Loader2,
  AlertTriangle,
  Play,
  Crosshair,
  Target,
} from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import BracketMatchCard from "../BracketMatchCard";
import ConfirmationDialog from "../shared/ConfirmationDialog";

function BattleRoyaleDisplay({ bracket, onAdvanceRound, advancingRound }) {
  const t = useTranslations("TournamentDetails");
  const [showAdvanceConfirm, setShowAdvanceConfirm] = useState(false);

  if (!bracket.brRounds || bracket.brRounds.length === 0) {
    return null;
  }

  const nextRound = (bracket.currentBRRound || 1) + 1;
  const currentRoundData = bracket.brRounds[(bracket.currentBRRound || 1) - 1];
  const hasIncomplete = currentRoundData?.matches?.some((m) => m.status !== "completed");

  const handleAdvanceConfirmed = async () => {
    setShowAdvanceConfirm(false);
    await onAdvanceRound();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Crosshair className="size-4" />
          {t("brRounds") || "Battle Royale Rounds"}
        </h4>
        <div className="flex items-center gap-2">
          {/* Elimination rules badges */}
          {bracket.battleRoyaleConfig?.eliminationRules?.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {bracket.battleRoyaleConfig.eliminationRules.map((rule, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500"
                >
                  {(
                    t("afterRoundEliminate") ||
                    "After R{round}: eliminate bottom {count}"
                  )
                    .replace("{round}", rule.afterRound)
                    .replace("{count}", rule.eliminateBottom)}
                </span>
              ))}
            </div>
          )}

          {/* Advance BR Round button */}
          {bracket.bracketStatus !== "completed" && (
            <Button
              onClick={() => setShowAdvanceConfirm(true)}
              disabled={advancingRound || hasIncomplete}
              size="sm"
              className="gap-2 bg-orange-500 hover:bg-orange-500/90 text-white"
            >
              {advancingRound ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("advancing") || "Advancing..."}
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  {(
                    t("advanceBRRound") || "Advance to Round {next}"
                  ).replace("{next}", nextRound)}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={showAdvanceConfirm}
        onOpenChange={setShowAdvanceConfirm}
        title={(t("advanceToRound") || "Advance to Round {next}").replace("{next}", String(nextRound))}
        description={(t("advanceBRConfirm") || "Generate Round {next} lobbies with remaining teams. This will create new matches based on the current standings.").replace("{next}", String(nextRound))}
        confirmLabel={(t("generateRound") || "Generate Round {next}").replace("{next}", String(nextRound))}
        onConfirm={handleAdvanceConfirmed}
      />

      {/* Bracket Completed Banner */}
      {bracket.bracketStatus === "completed" && (
        <div className="mb-4 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center gap-3">
            <Trophy className="size-6 text-purple-500" />
            <div>
              <h5 className="text-sm font-semibold text-foreground">
                {t("bracketCompleted") || "Bracket Completed"}
              </h5>
              <p className="text-xs text-muted-foreground">
                {t("brAllRoundsCompleted") ||
                  "All Battle Royale rounds have been completed. Check standings for final results."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {bracket.brRounds.map((round, roundIndex) => {
          const isCurrent =
            roundIndex === (bracket.currentBRRound || 1) - 1;

          // Determine eliminated teams by comparing with next round
          const nextRound = bracket.brRounds[roundIndex + 1];
          let eliminatedTeams = [];
          if (
            nextRound &&
            round.matches?.length > 0 &&
            nextRound.matches?.length > 0
          ) {
            const currentParticipantIds = new Set();
            round.matches.forEach((m) =>
              (m.participants || []).forEach((p) => {
                const id = p.team?.id || p.player?.id;
                if (id) currentParticipantIds.add(id);
              })
            );
            const nextParticipantIds = new Set();
            nextRound.matches.forEach((m) =>
              (m.participants || []).forEach((p) => {
                const id = p.team?.id || p.player?.id;
                if (id) nextParticipantIds.add(id);
              })
            );
            round.matches.forEach((m) =>
              (m.participants || []).forEach((p) => {
                const id = p.team?.id || p.player?.id;
                const team = p.team || p.player;
                if (id && !nextParticipantIds.has(id)) {
                  eliminatedTeams.push(
                    team?.name || team?.nickname || "Unknown"
                  );
                }
              })
            );
          }

          return (
            <div key={roundIndex}>
              <div className="text-center mb-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    isCurrent
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <Crosshair className="size-3 inline mr-1" />
                  {round.name ||
                    `${t("brRound") || "BR Round"} ${roundIndex + 1}`}
                  {isCurrent && ` (${t("current") || "Current"})`}
                </span>
              </div>

              {/* Elimination info banner */}
              {eliminatedTeams.length > 0 && (
                <div className="mb-3 p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 text-xs text-red-500">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span className="font-medium">
                      {(
                        t("teamsEliminated") ||
                        "{count} teams eliminated after this round:"
                      ).replace("{count}", eliminatedTeams.length)}
                    </span>
                    <span className="text-red-400">
                      {eliminatedTeams.join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Lobby matches */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {round.matches.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    className={`rounded-xl border p-4 ${
                      isCurrent
                        ? "border-orange-500/30 bg-orange-500/5"
                        : "border-gray-200 dark:border-gray-700 bg-muted/20 dark:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Target className="size-4 text-orange-500" />
                        {match.matchLabel ||
                          `${t("lobby") || "Lobby"} ${String.fromCharCode(
                            65 + matchIndex
                          )}`}
                      </h5>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          match.status === "completed"
                            ? "bg-purple-500/10 text-purple-500"
                            : match.status === "in_progress"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {t(match.status) || match.status}
                      </span>
                    </div>

                    {/* Participant list */}
                    {match.participants && match.participants.length > 0 ? (
                      <div className="space-y-1.5">
                        {[...match.participants]
                          .sort(
                            (a, b) =>
                              (a.placement || 999) - (b.placement || 999)
                          )
                          .map((p, pIndex) => {
                            const team = p.team || p.player;
                            const logo = team?.logo || team?.photo;
                            return (
                              <div
                                key={
                                  p.team?.id || p.player?.id || pIndex
                                }
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                              >
                                <span
                                  className={`text-xs font-bold w-5 text-center ${
                                    p.placement === 1
                                      ? "text-yellow-500"
                                      : p.placement === 2
                                      ? "text-gray-400"
                                      : p.placement === 3
                                      ? "text-orange-600"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {p.placement ? `#${p.placement}` : "-"}
                                </span>
                                {logo?.light ? (
                                  <img
                                    src={getImgUrl(logo.light, "thumbnail")}
                                    alt={team?.name}
                                    className="size-5 rounded object-cover"
                                  />
                                ) : (
                                  <div className="size-5 rounded bg-muted flex items-center justify-center">
                                    <Trophy className="size-3 text-muted-foreground" />
                                  </div>
                                )}
                                <span className="text-sm text-foreground flex-1 truncate">
                                  {team?.name ||
                                    team?.nickname ||
                                    t("unknown") ||
                                    "Unknown"}
                                </span>
                                {p.kills !== undefined &&
                                  p.kills !== null && (
                                    <span className="text-xs text-muted-foreground">
                                      {p.kills} {t("killsShort") || "K"}
                                    </span>
                                  )}
                                {p.points !== undefined &&
                                  p.points !== null && (
                                    <span className="text-xs font-medium text-foreground">
                                      {p.points} {t("ptsShort") || "pts"}
                                    </span>
                                  )}
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <BracketMatchCard match={match} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BattleRoyaleDisplay;

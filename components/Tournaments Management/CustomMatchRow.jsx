"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Trophy,
  Trash2,
  ChevronUp,
  ChevronDown,
  UserPlus,
  Loader2,
} from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import {
  deleteCustomMatchAction,
  reorderCustomBracketAction,
} from "@/app/[locale]/_Lib/actions";
import TeamAssignmentDialog from "./TeamAssignmentDialog";
import MatchResultDialog from "./MatchResultDialog";
import ConfirmationDialog from "./shared/ConfirmationDialog";

export default function CustomMatchRow({
  match,
  tournament,
  onRefresh,
  roundMatches,
  participationType,
  isLocked,
}) {
  const t = useTranslations("TournamentDetails");
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignSlot, setAssignSlot] = useState(null); // "team1" | "team2" | null
  const [showResultDialog, setShowResultDialog] = useState(false);

  const tournamentId = tournament.id || tournament._id;
  const matchId = match.id || match._id;
  const isPlayer = participationType === "player";

  const entity1 = isPlayer ? match.player1 : match.team1;
  const entity2 = isPlayer ? match.player2 : match.team2;

  const winnerId = match.result?.winner;
  const team1Score = match.result?.team1Score ?? null;
  const team2Score = match.result?.team2Score ?? null;
  const hasResult = team1Score !== null && team2Score !== null;

  const isEntity1Winner =
    winnerId && entity1 && winnerId === (entity1.id || entity1._id);
  const isEntity2Winner =
    winnerId && entity2 && winnerId === (entity2.id || entity2._id);

  // Match position within the round
  const sortedMatches = [...roundMatches].sort(
    (a, b) => (a.matchNumber || 0) - (b.matchNumber || 0)
  );
  const matchIndex = sortedMatches.findIndex(
    (m) => (m.id || m._id) === matchId
  );
  const isFirst = matchIndex === 0;
  const isLast = matchIndex === sortedMatches.length - 1;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteCustomMatchAction(tournamentId, matchId);
      if (result.success) {
        await onRefresh();
      }
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReorder = async (direction) => {
    if (reordering) return;
    setReordering(true);
    try {
      const targetIndex = matchIndex + direction;
      if (targetIndex < 0 || targetIndex >= sortedMatches.length) return;

      // Build reorder payload: swap match positions within the round
      const reorderedMatches = sortedMatches.map((m, i) => ({
        matchId: m.id || m._id,
        newPosition: i + 1,
      }));

      // Swap
      const temp = reorderedMatches[matchIndex].newPosition;
      reorderedMatches[matchIndex].newPosition =
        reorderedMatches[targetIndex].newPosition;
      reorderedMatches[targetIndex].newPosition = temp;

      const result = await reorderCustomBracketAction(tournamentId, {
        rounds: [
          {
            round: match.bracketRound,
            newPosition: match.bracketRound,
            matches: reorderedMatches,
          },
        ],
      });
      if (result.success) {
        await onRefresh();
      }
    } finally {
      setReordering(false);
    }
  };

  const renderSlot = (entity, slot) => {
    if (!entity) {
      return (
        <button
          type="button"
          onClick={() => !isLocked && setAssignSlot(slot)}
          disabled={isLocked}
          className="flex items-center gap-2 px-3 py-2 min-h-[44px] sm:min-h-0 w-full text-left transition-colors hover:bg-muted/30 active:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`${t("clickToAssign") || "Assign"} ${slot === (isPlayer ? "player1" : "team1") ? "1" : "2"}`}
        >
          <UserPlus className="size-4 text-muted-foreground/50" />
          <span className="text-xs text-muted-foreground italic">
            {t("clickToAssign") || "Click to assign"}
          </span>
        </button>
      );
    }

    const name = entity.name || entity.nickname || "Unknown";
    const logo = isPlayer ? entity.photo : entity.logo;
    const isWinner =
      slot === (isPlayer ? "player1" : "team1")
        ? isEntity1Winner
        : isEntity2Winner;

    return (
      <button
        type="button"
        onClick={() => !isLocked && setAssignSlot(slot)}
        disabled={isLocked}
        aria-label={`${name}${isWinner ? ` (${t("winner") || "Winner"})` : ""}. ${t("clickToAssign") || "Click to reassign"}`}
        className={`flex items-center gap-2 px-3 py-2 min-h-[44px] sm:min-h-0 w-full text-left transition-colors hover:bg-muted/30 active:bg-muted/50 disabled:cursor-default ${
          isWinner ? "bg-green-500/10" : ""
        }`}
      >
        {logo?.light ? (
          <img
            src={getImgUrl(logo.light, "thumbnail")}
            alt={name}
            className="size-5 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="size-5 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Trophy className="size-3 text-muted-foreground" />
          </div>
        )}
        <span
          className={`text-xs truncate flex-1 ${
            isWinner ? "font-bold text-green-500" : "text-foreground"
          }`}
        >
          {name}
        </span>
      </button>
    );
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-background/50 group">
        {/* Match header */}
        <div className="flex items-center justify-between px-3 py-1 bg-muted/30 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            {/* Match number badge */}
            <span className="text-[10px] font-bold text-green-primary bg-green-primary/10 px-1.5 py-0.5 rounded">
              #{matchIndex + 1}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {match.matchLabel || `M${match.matchNumber || matchIndex + 1}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {match.bestOf > 1 && (
              <span className="text-[10px] text-muted-foreground">
                Bo{match.bestOf}
              </span>
            )}
            {/* Always visible controls */}
            {!isLocked && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleReorder(-1)}
                  disabled={isFirst || reordering}
                  className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-[24px] sm:min-h-[24px] rounded hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors flex items-center justify-center"
                  title={t("moveUp") || "Move up"}
                  aria-label={t("moveUp") || "Move match up"}
                >
                  <ChevronUp className="size-3 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(1)}
                  disabled={isLast || reordering}
                  className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-[24px] sm:min-h-[24px] rounded hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors flex items-center justify-center"
                  title={t("moveDown") || "Move down"}
                  aria-label={t("moveDown") || "Move match down"}
                >
                  <ChevronDown className="size-3 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-[24px] sm:min-h-[24px] rounded hover:bg-red-500/10 active:bg-red-500/20 transition-colors flex items-center justify-center"
                  title={t("deleteMatch") || "Delete match"}
                  aria-label={t("deleteMatch") || "Delete match"}
                >
                  <Trash2 className="size-3 text-red-500/70" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Team/Player slots */}
        <div className="divide-y divide-white/5">
          {renderSlot(entity1, isPlayer ? "player1" : "team1")}

          {/* Score area — clickable */}
          <button
            type="button"
            onClick={() => !isLocked && setShowResultDialog(true)}
            disabled={isLocked || (!entity1 && !entity2)}
            aria-label={hasResult ? `${t("editResult") || "Edit result"}: ${team1Score}-${team2Score}` : t("setResult") || "Set result"}
            className="w-full px-3 py-1.5 min-h-[36px] sm:min-h-0 sm:py-1 text-center bg-muted/10 hover:bg-muted/20 active:bg-muted/30 transition-colors disabled:cursor-default disabled:hover:bg-muted/10"
          >
            {hasResult ? (
              <span className="text-xs font-mono font-bold">
                <span className={isEntity1Winner ? "text-green-500" : "text-foreground"}>
                  {team1Score}
                </span>
                <span className="text-muted-foreground mx-1">-</span>
                <span className={isEntity2Winner ? "text-green-500" : "text-foreground"}>
                  {team2Score}
                </span>
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/50">
                {entity1 || entity2
                  ? t("setResult") || "Set Result"
                  : "-"}
              </span>
            )}
          </button>

          {renderSlot(entity2, isPlayer ? "player2" : "team2")}
        </div>
      </div>

      {/* Delete Confirmation — contextual */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t("deleteMatch") || "Delete Match"}
        description={
          hasResult
            ? (t("deleteMatchWithResult") || "Delete this match? The recorded result ({score1}-{score2}) will be lost.")
                .replace("{score1}", String(team1Score))
                .replace("{score2}", String(team2Score))
            : entity1 && entity2
            ? (t("deleteMatchBetween") || "Delete the match between {team1} and {team2}?")
                .replace("{team1}", entity1.name || entity1.nickname || "Unknown")
                .replace("{team2}", entity2.name || entity2.nickname || "Unknown")
            : t("deleteEmptyMatch") || "Delete this empty match?"
        }
        confirmLabel={t("delete") || "Delete"}
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleting}
      />

      {/* Team Assignment Dialog */}
      {assignSlot && (
        <TeamAssignmentDialog
          open={!!assignSlot}
          onOpenChange={(open) => !open && setAssignSlot(null)}
          tournament={tournament}
          match={match}
          slot={assignSlot}
          onAssign={() => {
            setAssignSlot(null);
            onRefresh();
          }}
          participationType={participationType}
        />
      )}

      {/* Match Result Dialog */}
      {showResultDialog && (
        <MatchResultDialog
          open={showResultDialog}
          onOpenChange={setShowResultDialog}
          tournament={tournament}
          match={match}
          onResultSet={() => {
            setShowResultDialog(false);
            onRefresh();
          }}
          participationType={participationType}
        />
      )}
    </>
  );
}

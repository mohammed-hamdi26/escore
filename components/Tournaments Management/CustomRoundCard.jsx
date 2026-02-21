"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import {
  updateCustomRoundAction,
  deleteCustomRoundAction,
  addCustomMatchAction,
  reorderCustomBracketAction,
} from "@/app/[locale]/_Lib/actions";
import { showSuccess } from "@/lib/bracket-toast";
import CustomMatchRow from "./CustomMatchRow";
import InlineError from "./shared/InlineError";
import ConfirmationDialog from "./shared/ConfirmationDialog";

export default function CustomRoundCard({
  round,
  matches,
  tournament,
  onRefresh,
  isFirst,
  isLast,
  participationType,
  totalRounds,
  isLocked,
}) {
  const t = useTranslations("TournamentDetails");
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(round.name);
  const [editBestOf, setEditBestOf] = useState(round.bestOf || 1);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addingMatch, setAddingMatch] = useState(false);
  const [reordering, setReordering] = useState(false);
  const editNameRef = useRef(null);

  const tournamentId = tournament.id || tournament._id;

  const editNameError = editing && editName.length > 100
    ? (t("roundNameTooLong") || "Round name must be under 100 characters")
    : null;

  // Auto-focus edit input
  useEffect(() => {
    if (editing && editNameRef.current) editNameRef.current.focus();
  }, [editing]);

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const data = {};
      if (editName !== round.name) data.name = editName;
      if (editBestOf !== round.bestOf) data.bestOf = editBestOf;

      if (Object.keys(data).length > 0) {
        const result = await updateCustomRoundAction(
          tournamentId,
          round.round,
          data
        );
        if (result.success) {
          showSuccess(t("roundUpdated") || "Round updated");
          await onRefresh();
        }
      }
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteCustomRoundAction(
        tournamentId,
        round.round
      );
      if (result.success) {
        await onRefresh();
      }
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddMatch = async () => {
    setAddingMatch(true);
    try {
      const result = await addCustomMatchAction(tournamentId, {
        round: round.round,
      });
      if (result.success) {
        await onRefresh();
      }
    } finally {
      setAddingMatch(false);
    }
  };

  const handleReorderRound = async (direction) => {
    if (reordering) return;
    setReordering(true);
    try {
      const newPosition = round.round + direction;
      if (newPosition < 1 || newPosition > totalRounds) return;

      const result = await reorderCustomBracketAction(tournamentId, {
        rounds: [
          { round: round.round, newPosition },
        ],
      });
      if (result.success) {
        await onRefresh();
      }
    } finally {
      setReordering(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full sm:min-w-[260px] sm:w-[280px]">
        {/* Round Header */}
        <div className="mb-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700">
          {editing ? (
            /* Inline Edit Form — visually distinct */
            <div
              className="space-y-2 p-2 -m-2 rounded-lg bg-muted/50 border border-dashed border-green-primary/40"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !saving && !editNameError) handleSaveEdit();
                if (e.key === "Escape") {
                  setEditing(false);
                  setEditName(round.name);
                  setEditBestOf(round.bestOf || 1);
                }
              }}
            >
              <div>
                <input
                  ref={editNameRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                  className={`w-full px-2 py-1 rounded-lg bg-background border text-foreground text-sm ${
                    editNameError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder={t("roundName") || "Round name"}
                />
                <InlineError error={editNameError} />
              </div>
              <div className="flex gap-1">
                {[1, 3, 5, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEditBestOf(n)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      editBestOf === n
                        ? "bg-green-primary/10 text-green-primary border border-green-primary"
                        : "bg-muted/30 text-muted-foreground border border-transparent hover:border-gray-400"
                    }`}
                  >
                    Bo{n}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving || !!editNameError}
                  className="px-3 py-1 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {saving && <Loader2 className="size-3 animate-spin" />}
                  {t("save") || "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditName(round.name);
                    setEditBestOf(round.bestOf || 1);
                  }}
                  className="px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-muted transition-colors"
                >
                  {t("cancel") || "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            /* Round Info Display */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {/* Reorder — always visible */}
                {!isLocked && (
                  <div className="flex items-center gap-0.5">
                    <GripVertical className="size-3.5 text-muted-foreground/50" />
                    <button
                      type="button"
                      onClick={() => handleReorderRound(-1)}
                      disabled={isFirst || reordering}
                      className="p-1.5 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors flex items-center justify-center"
                      title={t("moveLeft") || "Move left"}
                      aria-label={`${t("moveLeft") || "Move left"}: ${round.name}`}
                    >
                      <ChevronLeft className="size-3.5 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorderRound(1)}
                      disabled={isLast || reordering}
                      className="p-1.5 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors flex items-center justify-center"
                      title={t("moveRight") || "Move right"}
                      aria-label={`${t("moveRight") || "Move right"}: ${round.name}`}
                    >
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {round.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-primary/10 text-green-primary font-medium">
                      Bo{round.bestOf || 1}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {matches.length} {t("matches") || "matches"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions dropdown */}
              {!isLocked && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 sm:p-1 rounded hover:bg-muted active:bg-muted/80 transition-colors flex items-center justify-center"
                    aria-label={`${t("roundActions") || "Actions"}: ${round.name}`}
                    aria-expanded={showMenu}
                    aria-haspopup="true"
                  >
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </button>
                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 top-8 z-50 bg-background rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg py-1 min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => {
                            setShowMenu(false);
                            setEditing(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-2 text-xs text-foreground hover:bg-muted active:bg-muted/80 transition-colors"
                          aria-label={`${t("editRound") || "Edit"} ${round.name}`}
                        >
                          <Pencil className="size-3" />
                          {t("editRound") || "Edit Round"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMenu(false);
                            setShowDeleteConfirm(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-2 text-xs text-red-500 hover:bg-red-500/10 active:bg-red-500/20 transition-colors"
                          aria-label={`${t("deleteRound") || "Delete"} ${round.name}`}
                        >
                          <Trash2 className="size-3" />
                          {t("deleteRound") || "Delete Round"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Matches */}
        <div className="space-y-3 flex-1">
          {matches.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground/50">
              <p className="text-xs">
                {t("noMatches") || "No matches yet"}
              </p>
            </div>
          ) : (
            matches
              .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
              .map((match) => (
                <CustomMatchRow
                  key={match.id || match._id}
                  match={match}
                  tournament={tournament}
                  onRefresh={onRefresh}
                  roundMatches={matches}
                  participationType={participationType}
                  isLocked={isLocked}
                />
              ))
          )}
        </div>

        {/* Add Match Button */}
        {!isLocked && (
          <button
            type="button"
            onClick={handleAddMatch}
            disabled={addingMatch}
            className="mt-3 w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50 hover:text-green-primary transition-colors flex items-center justify-center gap-1 text-xs"
          >
            {addingMatch ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Plus className="size-3" />
            )}
            {t("addMatch") || "Add Match"}
          </button>
        )}
      </div>

      {/* Delete Round Confirmation */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={`${t("deleteRound") || "Delete Round"}: ${round.name}`}
        description={
          (t("deleteRoundDesc") || "This will permanently delete this round and its {count} matches. Teams assigned to these matches will be unassigned.")
            .replace("{count}", String(matches.length))
        }
        confirmLabel={t("deleteRound") || "Delete Round"}
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleting}
      />
    </>
  );
}

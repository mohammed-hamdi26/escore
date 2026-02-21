"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  updateCustomRoundAction,
  deleteCustomRoundAction,
  addCustomMatchAction,
  reorderCustomBracketAction,
} from "@/app/[locale]/_Lib/actions";
import CustomMatchRow from "./CustomMatchRow";

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

  const tournamentId = tournament.id || tournament._id;

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
      <div className="flex flex-col min-w-[260px] w-[280px]">
        {/* Round Header */}
        <div className="mb-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700">
          {editing ? (
            /* Inline Edit Form */
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-2 py-1 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                placeholder={t("roundName") || "Round name"}
                autoFocus
              />
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
                  disabled={saving}
                  className="px-3 py-1 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors flex items-center gap-1"
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
                {/* Reorder arrows */}
                {!isLocked && (
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleReorderRound(-1)}
                      disabled={isFirst || reordering}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="size-3 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorderRound(1)}
                      disabled={isLast || reordering}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="size-3 text-muted-foreground" />
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
                    className="p-1 rounded hover:bg-muted transition-colors"
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
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
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
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl p-6 max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              {t("deleteRound") || "Delete Round"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {(t("deleteRoundConfirm") || "Delete \"{name}\" and all its {count} matches?")
                .replace("{name}", round.name)
                .replace("{count}", matches.length)}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-muted transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
              >
                {deleting && <Loader2 className="size-3 animate-spin" />}
                {t("delete") || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

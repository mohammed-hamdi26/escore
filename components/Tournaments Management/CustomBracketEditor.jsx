"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import {
  addCustomRoundAction,
  completeCustomBracketAction,
} from "@/app/[locale]/_Lib/actions";
import { showSuccess } from "@/lib/bracket-toast";
import CustomRoundCard from "./CustomRoundCard";
import InlineError from "./shared/InlineError";
import ConfirmationDialog from "./shared/ConfirmationDialog";

export default function CustomBracketEditor({
  tournament,
  bracketData,
  onRefresh,
  participationType,
}) {
  const t = useTranslations("TournamentDetails");
  const [addingRound, setAddingRound] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoundName, setNewRoundName] = useState("");
  const [newRoundBestOf, setNewRoundBestOf] = useState(1);
  const [completing, setCompleting] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const roundNameRef = useRef(null);

  const tournamentId = tournament.id || tournament._id;
  const isLocked = bracketData?.bracketStatus === "completed";

  // Auto-focus round name input when form opens
  useEffect(() => {
    if (showAddForm && roundNameRef.current) {
      roundNameRef.current.focus();
    }
  }, [showAddForm]);

  const roundNameError = newRoundName.length > 100
    ? (t("roundNameTooLong") || "Round name must be under 100 characters")
    : null;

  // Parse and organize bracket data: group matches by bracketRound
  const roundsData = useMemo(() => {
    const customRounds = bracketData?.customRounds || [];
    const matches = bracketData?.matches || [];

    // Group matches by bracketRound
    const matchesByRound = {};
    matches.forEach((m) => {
      const r = m.bracketRound;
      if (!matchesByRound[r]) matchesByRound[r] = [];
      matchesByRound[r].push(m);
    });

    // Map customRounds with their matches
    return customRounds
      .sort((a, b) => a.round - b.round)
      .map((cr) => ({
        ...cr,
        matches: matchesByRound[cr.round] || [],
      }));
  }, [bracketData]);

  const handleAddRound = async () => {
    setAddingRound(true);
    try {
      const data = {
        bestOf: newRoundBestOf,
      };
      if (newRoundName.trim()) {
        data.name = newRoundName.trim();
      }

      const result = await addCustomRoundAction(tournamentId, data);
      if (result.success) {
        setNewRoundName("");
        setNewRoundBestOf(1);
        showSuccess(t("roundAdded") || "Round added");
        await onRefresh();
        // Keep form open for successive adds, re-focus
        if (roundNameRef.current) roundNameRef.current.focus();
      }
    } finally {
      setAddingRound(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const result = await completeCustomBracketAction(tournamentId);
      if (result.success) {
        setShowCompleteConfirm(false);
        await onRefresh();
      }
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div>
      {/* Action Bar */}
      {!isLocked && (
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors"
          >
            <Plus className="size-3" />
            {t("addRound") || "Add Round"}
          </button>

          {bracketData?.bracketStatus === "in_progress" && (
            <button
              type="button"
              onClick={() => setShowCompleteConfirm(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              <CheckCircle2 className="size-3" />
              {t("completeBracket") || "Complete Bracket"}
            </button>
          )}
        </div>
      )}

      {isLocked && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 text-xs">
          {t("bracketCompleted") || "This bracket is completed. Editing is disabled."}
        </div>
      )}

      {/* Add Round Form — Animated */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showAddForm ? "max-h-48 opacity-100 mb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700">
          <div
            className="flex flex-wrap items-end gap-3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !addingRound && !roundNameError) handleAddRound();
              if (e.key === "Escape") {
                setShowAddForm(false);
                setNewRoundName("");
                setNewRoundBestOf(1);
              }
            }}
          >
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t("roundName") || "Round Name"}
              </label>
              <input
                ref={roundNameRef}
                type="text"
                value={newRoundName}
                onChange={(e) => setNewRoundName(e.target.value)}
                maxLength={100}
                className={`px-3 py-1.5 rounded-lg bg-background border text-foreground text-sm w-48 ${
                  roundNameError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder={t("roundNamePlaceholder") || "e.g., Quarter Finals, Week 1"}
              />
              <div className="flex items-center justify-between mt-1">
                <InlineError error={roundNameError} />
                <span className="text-[10px] text-muted-foreground">
                  {newRoundName.length}/100
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t("bestOf") || "Best Of"}
              </label>
              <div className="flex gap-1">
                {[1, 3, 5, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNewRoundBestOf(n)}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                      newRoundBestOf === n
                        ? "bg-green-primary/10 text-green-primary border border-green-primary"
                        : "bg-muted/30 text-muted-foreground border border-transparent hover:border-gray-400"
                    }`}
                  >
                    Bo{n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddRound}
                disabled={addingRound || !!roundNameError}
                className="px-3 py-1.5 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {addingRound && <Loader2 className="size-3 animate-spin" />}
                {t("addRound") || "Add Round"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewRoundName("");
                  setNewRoundBestOf(1);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-muted transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rounds — Horizontal scroll */}
      {roundsData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            {t("noRoundsYet") || "No rounds yet. Click \"Add Round\" to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 sm:block">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:min-w-fit">
            {roundsData.map((rd, index) => (
              <CustomRoundCard
                key={rd.round}
                round={rd}
                matches={rd.matches}
                tournament={tournament}
                onRefresh={onRefresh}
                isFirst={index === 0}
                isLast={index === roundsData.length - 1}
                participationType={participationType}
                totalRounds={roundsData.length}
                isLocked={isLocked}
              />
            ))}
          </div>
        </div>
      )}

      {/* Complete Bracket Confirmation */}
      <ConfirmationDialog
        open={showCompleteConfirm}
        onOpenChange={setShowCompleteConfirm}
        title={t("completeBracket") || "Complete Bracket"}
        description={(() => {
          const allMatches = bracketData?.matches || [];
          const totalCount = allMatches.length;
          const completedCount = allMatches.filter((m) => m.status === "completed" || m.result?.winner).length;
          const incompleteCount = totalCount - completedCount;
          if (incompleteCount > 0) {
            return (t("completeBracketIncomplete") || "There are {incomplete} matches without results out of {total} total. Are you sure you want to mark the bracket as completed?")
              .replace("{incomplete}", String(incompleteCount))
              .replace("{total}", String(totalCount));
          }
          return (t("completeBracketAllDone") || "All {total} matches have results. Mark the bracket as completed? This cannot be undone.")
            .replace("{total}", String(totalCount));
        })()}
        confirmLabel={t("complete") || "Complete"}
        onConfirm={handleComplete}
        loading={completing}
      />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import {
  addCustomRoundAction,
  completeCustomBracketAction,
} from "@/app/[locale]/_Lib/actions";
import CustomRoundCard from "./CustomRoundCard";

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

  const tournamentId = tournament.id || tournament._id;
  const isLocked = bracketData?.bracketStatus === "completed";

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
        setShowAddForm(false);
        setNewRoundName("");
        setNewRoundBestOf(1);
        await onRefresh();
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

      {/* Add Round Form */}
      {showAddForm && (
        <div className="mb-4 p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t("roundName") || "Round Name"}
              </label>
              <input
                type="text"
                value={newRoundName}
                onChange={(e) => setNewRoundName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm w-48"
                placeholder={t("optional") || "Optional"}
              />
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
                disabled={addingRound}
                className="px-3 py-1.5 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors flex items-center gap-1"
              >
                {addingRound && <Loader2 className="size-3 animate-spin" />}
                {t("add") || "Add"}
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
      )}

      {/* Rounds — Horizontal scroll */}
      {roundsData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            {t("noRoundsYet") || "No rounds yet. Click \"Add Round\" to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-fit">
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
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl p-6 max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              {t("completeBracket") || "Complete Bracket"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {t("completeBracketConfirm") || "Mark this bracket as completed? This cannot be undone."}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCompleteConfirm(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-muted transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={completing}
                className="px-3 py-1.5 text-xs rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center gap-1"
              >
                {completing && <Loader2 className="size-3 animate-spin" />}
                {t("complete") || "Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

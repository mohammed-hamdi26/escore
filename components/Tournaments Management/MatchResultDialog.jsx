"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Trophy, X, Loader2, Minus, Plus, Info, AlertTriangle } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import { setCustomMatchResultAction } from "@/app/[locale]/_Lib/actions";
import { showSuccess } from "@/lib/bracket-toast";
import InlineError from "./shared/InlineError";
import ConfirmationDialog from "./shared/ConfirmationDialog";

export default function MatchResultDialog({
  open,
  onOpenChange,
  tournament,
  match,
  onResultSet,
  participationType,
}) {
  const t = useTranslations("TournamentDetails");
  const isPlayer = participationType === "player";
  const score1Ref = useRef(null);
  const score2Ref = useRef(null);

  const entity1 = isPlayer ? match.player1 : match.team1;
  const entity2 = isPlayer ? match.player2 : match.team2;
  const entity1Name = entity1?.name || entity1?.nickname || "TBD";
  const entity2Name = entity2?.name || entity2?.nickname || "TBD";
  const logo1 = isPlayer ? entity1?.photo : entity1?.logo;
  const logo2 = isPlayer ? entity2?.photo : entity2?.logo;

  const hasExistingResult =
    match.result?.team1Score !== undefined && match.result?.team1Score !== null;

  const [team1Score, setTeam1Score] = useState(
    hasExistingResult ? match.result.team1Score : 0
  );
  const [team2Score, setTeam2Score] = useState(
    hasExistingResult ? match.result.team2Score : 0
  );
  const [overrideWinner, setOverrideWinner] = useState(false);
  const [winnerId, setWinnerId] = useState("");
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState(null);

  const tournamentId = tournament.id || tournament._id;
  const matchId = match.id || match._id;
  const entity1Id = entity1?.id || entity1?._id;
  const entity2Id = entity2?.id || entity2?._id;
  const bestOf = match.bestOf || 1;
  const maxWins = Math.ceil(bestOf / 2);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setTeam1Score(hasExistingResult ? match.result.team1Score : 0);
      setTeam2Score(hasExistingResult ? match.result.team2Score : 0);
      setOverrideWinner(false);
      setWinnerId("");
      setError(null);
      setShowClearConfirm(false);
      // Auto-focus first score input
      setTimeout(() => score1Ref.current?.focus(), 100);
    }
  }, [open]);

  // --- Validation ---
  const validation = useMemo(() => {
    const s1 = parseInt(team1Score) || 0;
    const s2 = parseInt(team2Score) || 0;
    const errors = {};
    const warnings = [];

    if (s1 < 0) errors.team1Score = t("scoreNonNegative") || "Score cannot be negative";
    if (s2 < 0) errors.team2Score = t("scoreNonNegative") || "Score cannot be negative";

    // BestOf validation
    if (bestOf > 1) {
      if (s1 > maxWins) errors.team1Score = (t("scoreExceedsMax") || "Max score for Bo{bo} is {max}").replace("{bo}", bestOf).replace("{max}", maxWins);
      if (s2 > maxWins) errors.team2Score = (t("scoreExceedsMax") || "Max score for Bo{bo} is {max}").replace("{bo}", bestOf).replace("{max}", maxWins);
      if (s1 === maxWins && s2 === maxWins) {
        warnings.push(t("bothMaxScore") || "Both teams cannot reach the winning score in a best-of series");
      }
    }

    // Tie detection
    if (s1 === s2 && s1 > 0 && !overrideWinner) {
      warnings.push(t("tieWarning") || "Scores are tied. Use Override to select a winner.");
    }

    // Override validation
    if (overrideWinner && !winnerId) {
      errors.override = t("selectWinner") || "Select a winner when using override";
    }

    // Auto-determined winner
    let autoWinner = null;
    if (s1 > s2 && entity1Id) autoWinner = { id: entity1Id, name: entity1Name };
    else if (s2 > s1 && entity2Id) autoWinner = { id: entity2Id, name: entity2Name };

    const hasErrors = Object.keys(errors).length > 0;
    return { errors, warnings, autoWinner, hasErrors };
  }, [team1Score, team2Score, bestOf, maxWins, overrideWinner, winnerId, entity1Id, entity2Id, entity1Name, entity2Name, t]);

  // --- Quick Score Presets ---
  const quickScores = useMemo(() => {
    if (bestOf <= 1) return [{ s1: 1, s2: 0 }, { s1: 0, s2: 1 }];
    const presets = [];
    for (let w = maxWins; w >= 0; w--) {
      for (let l = 0; l <= maxWins; l++) {
        if (w === maxWins && l < maxWins) presets.push({ s1: w, s2: l });
        if (l === maxWins && w < maxWins) presets.push({ s1: w, s2: l });
      }
    }
    return presets;
  }, [bestOf, maxWins]);

  const handleSave = async () => {
    if (validation.hasErrors) return;
    setSaving(true);
    setError(null);
    try {
      const data = {
        team1Score: parseInt(team1Score) || 0,
        team2Score: parseInt(team2Score) || 0,
      };

      if (overrideWinner && winnerId) {
        data.winnerId = winnerId;
      } else if (data.team1Score > data.team2Score && entity1Id) {
        data.winnerId = entity1Id;
      } else if (data.team2Score > data.team1Score && entity2Id) {
        data.winnerId = entity2Id;
      }

      const result = await setCustomMatchResultAction(
        tournamentId,
        matchId,
        data
      );
      if (result.success) {
        showSuccess(t("resultSaved") || "Match result saved");
        onResultSet();
      } else {
        setError(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setError(null);
    try {
      const result = await setCustomMatchResultAction(
        tournamentId,
        matchId,
        { clear: true }
      );
      if (result.success) {
        showSuccess(t("resultCleared") || "Match result cleared");
        onResultSet();
      } else {
        setError(result.error);
      }
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  };

  const dialogRef = useRef(null);

  // Focus trap + keyboard handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !saving && !validation.hasErrors) handleSave();
    if (e.key === "Escape") onOpenChange(false);

    // Focus trap
    if (e.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  };

  if (!open) return null;

  const renderEntityHeader = (entity, logo, name) => (
    <div className="flex flex-col items-center gap-1">
      {logo?.light ? (
        <img
          src={getImgUrl(logo.light, "thumbnail")}
          alt={name}
          className="size-10 rounded object-cover"
        />
      ) : (
        <div className="size-10 rounded bg-muted flex items-center justify-center">
          <Trophy className="size-5 text-muted-foreground" />
        </div>
      )}
      <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
        {name}
      </span>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onKeyDown={handleKeyDown}
        onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
        role="dialog"
        aria-modal="true"
        aria-label={hasExistingResult ? t("editResult") || "Edit Result" : t("setResult") || "Set Result"}
      >
        <div ref={dialogRef} className="bg-background rounded-xl max-w-lg w-full mx-4 border border-gray-200 dark:border-gray-700 shadow-xl max-h-[calc(100vh-2rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-foreground">
              {hasExistingResult
                ? t("editResult") || "Edit Result"
                : t("setResult") || "Set Result"}
            </h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-2 sm:p-1 rounded hover:bg-muted active:bg-muted/80 transition-colors"
              aria-label={t("close") || "Close"}
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Score Entry */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-center gap-6">
              {/* Team 1 */}
              <div className="flex flex-col items-center gap-3">
                {renderEntityHeader(entity1, logo1, entity1Name)}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
                    disabled={team1Score <= 0}
                    className="size-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors disabled:opacity-30"
                    aria-label={`Decrease ${entity1Name} score`}
                  >
                    <Minus className="size-4 text-foreground" />
                  </button>
                  <input
                    ref={score1Ref}
                    type="number"
                    min="0"
                    max="99"
                    aria-label={`${entity1Name} score`}
                    value={team1Score}
                    onChange={(e) =>
                      setTeam1Score(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") { e.preventDefault(); setTeam1Score(Math.min(99, team1Score + 1)); }
                      if (e.key === "ArrowDown") { e.preventDefault(); setTeam1Score(Math.max(0, team1Score - 1)); }
                    }}
                    className={`w-16 h-14 text-center text-2xl font-bold rounded-lg bg-muted/30 border text-foreground ${
                      validation.errors.team1Score ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setTeam1Score(Math.min(99, team1Score + 1))}
                    className="size-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label={`Increase ${entity1Name} score`}
                  >
                    <Plus className="size-4 text-foreground" />
                  </button>
                </div>
                <InlineError error={validation.errors.team1Score} />
              </div>

              {/* VS */}
              <span className="text-lg font-bold text-muted-foreground mt-6">
                vs
              </span>

              {/* Team 2 */}
              <div className="flex flex-col items-center gap-3">
                {renderEntityHeader(entity2, logo2, entity2Name)}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
                    disabled={team2Score <= 0}
                    className="size-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors disabled:opacity-30"
                    aria-label={`Decrease ${entity2Name} score`}
                  >
                    <Minus className="size-4 text-foreground" />
                  </button>
                  <input
                    ref={score2Ref}
                    type="number"
                    min="0"
                    max="99"
                    aria-label={`${entity2Name} score`}
                    value={team2Score}
                    onChange={(e) =>
                      setTeam2Score(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") { e.preventDefault(); setTeam2Score(Math.min(99, team2Score + 1)); }
                      if (e.key === "ArrowDown") { e.preventDefault(); setTeam2Score(Math.max(0, team2Score - 1)); }
                    }}
                    className={`w-16 h-14 text-center text-2xl font-bold rounded-lg bg-muted/30 border text-foreground ${
                      validation.errors.team2Score ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setTeam2Score(Math.min(99, team2Score + 1))}
                    className="size-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label={`Increase ${entity2Name} score`}
                  >
                    <Plus className="size-4 text-foreground" />
                  </button>
                </div>
                <InlineError error={validation.errors.team2Score} />
              </div>
            </div>

            {/* Quick Score Presets */}
            {bestOf >= 1 && (
              <div className="mt-4">
                <p className="text-[10px] text-muted-foreground mb-1.5 text-center">
                  {t("quickScores") || "Quick scores"}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {quickScores.map(({ s1, s2 }, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setTeam1Score(s1); setTeam2Score(s2); }}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                        team1Score === s1 && team2Score === s2
                          ? "bg-green-primary/10 text-green-primary border border-green-primary"
                          : "bg-muted/30 text-muted-foreground border border-transparent hover:border-gray-400"
                      }`}
                    >
                      {s1}-{s2}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div className="mt-3 space-y-1">
                {validation.warnings.map((w, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-amber-500">
                    <AlertTriangle className="size-3 flex-shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Winner Section */}
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-foreground mb-2">
                {t("winner") || "Winner"}
              </p>

              {/* Auto-detected winner */}
              {!overrideWinner && validation.autoWinner && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-green-primary/5 border border-green-primary/20">
                  <Info className="size-3.5 text-green-primary flex-shrink-0" />
                  <span className="text-xs text-green-primary font-medium">
                    {validation.autoWinner.name}
                  </span>
                  <span className="text-[10px] text-green-primary/70 ml-auto">
                    {t("autoDetected") || "Auto-detected from score"}
                  </span>
                </div>
              )}

              {!overrideWinner && !validation.autoWinner && (
                <p className="text-xs text-muted-foreground mb-2">
                  {t("winnerAutoDesc") || "Winner is automatically determined by the higher score"}
                </p>
              )}

              {/* Override toggle */}
              <button
                type="button"
                onClick={() => {
                  setOverrideWinner(!overrideWinner);
                  if (overrideWinner) setWinnerId("");
                }}
                className={`text-xs transition-colors ${
                  overrideWinner
                    ? "text-amber-500 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {overrideWinner
                  ? t("cancelOverride") || "Cancel override"
                  : t("overrideWinner") || "Override winner"}
              </button>

              {overrideWinner && (
                <div className="mt-2 space-y-1.5">
                  <p className="text-[10px] text-muted-foreground">
                    {t("overrideDesc") || "Use override to manually set the winner (e.g., for walkovers or admin decisions)"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {entity1Id && (
                      <button
                        type="button"
                        onClick={() => setWinnerId(entity1Id)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-lg transition-all ${
                          winnerId === entity1Id
                            ? "bg-green-primary/10 border-2 border-green-primary"
                            : "bg-muted/30 border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50"
                        }`}
                      >
                        {logo1?.light ? (
                          <img src={getImgUrl(logo1.light, "thumbnail")} alt={entity1Name} className="size-6 rounded" />
                        ) : (
                          <div className="size-6 rounded bg-muted flex items-center justify-center">
                            <Trophy className="size-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className={`text-xs font-medium truncate ${winnerId === entity1Id ? "text-green-primary" : "text-foreground"}`}>
                          {entity1Name}
                        </span>
                      </button>
                    )}
                    {entity2Id && (
                      <button
                        type="button"
                        onClick={() => setWinnerId(entity2Id)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-lg transition-all ${
                          winnerId === entity2Id
                            ? "bg-green-primary/10 border-2 border-green-primary"
                            : "bg-muted/30 border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50"
                        }`}
                      >
                        {logo2?.light ? (
                          <img src={getImgUrl(logo2.light, "thumbnail")} alt={entity2Name} className="size-6 rounded" />
                        ) : (
                          <div className="size-6 rounded bg-muted flex items-center justify-center">
                            <Trophy className="size-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className={`text-xs font-medium truncate ${winnerId === entity2Id ? "text-green-primary" : "text-foreground"}`}>
                          {entity2Name}
                        </span>
                      </button>
                    )}
                  </div>
                  <InlineError error={validation.errors.override} />
                  {winnerId && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-500">
                      <AlertTriangle className="size-3" />
                      {t("manualOverride") || "Manual override active"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {hasExistingResult && (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  {t("clearResult") || "Clear Result"}
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-muted transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || validation.hasErrors}
                className="px-4 py-2 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {saving && <Loader2 className="size-3 animate-spin" />}
                {t("saveResult") || "Save Result"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Result Confirmation */}
      <ConfirmationDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title={t("clearResult") || "Clear Match Result"}
        description={
          (t("clearResultDesc") || "Remove the recorded result ({score1}-{score2}) for this match? The winner will be unset.")
            .replace("{score1}", String(hasExistingResult ? match.result.team1Score : 0))
            .replace("{score2}", String(hasExistingResult ? match.result.team2Score : 0))
        }
        confirmLabel={t("clearResult") || "Clear"}
        onConfirm={handleClear}
        variant="destructive"
        loading={clearing}
      />
    </>
  );
}

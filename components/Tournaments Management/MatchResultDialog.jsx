"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Trophy, X, Loader2, Minus, Plus } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import { setCustomMatchResultAction } from "@/app/[locale]/_Lib/actions";

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

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setTeam1Score(hasExistingResult ? match.result.team1Score : 0);
      setTeam2Score(hasExistingResult ? match.result.team2Score : 0);
      setOverrideWinner(false);
      setWinnerId("");
      setError(null);
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = {
        team1Score: parseInt(team1Score) || 0,
        team2Score: parseInt(team2Score) || 0,
      };

      // Add winnerId if override is set or if scores determine a winner
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
        onResultSet();
      } else {
        setError(result.error);
      }
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  };

  if (!open) return null;

  const renderEntityHeader = (entity, logo, name) => (
    <div className="flex flex-col items-center gap-1">
      {logo?.light ? (
        <img
          src={getImgUrl(logo.light, "thumbnail")}
          alt={name}
          className="size-8 rounded object-cover"
        />
      ) : (
        <div className="size-8 rounded bg-muted flex items-center justify-center">
          <Trophy className="size-4 text-muted-foreground" />
        </div>
      )}
      <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
        {name}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl max-w-lg w-full mx-4 border border-gray-200 dark:border-gray-700 shadow-xl">
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
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Score Entry */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-6">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-3">
              {renderEntityHeader(entity1, logo1, entity1Name)}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
                  className="size-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <Minus className="size-3 text-foreground" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) =>
                    setTeam1Score(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-14 h-12 text-center text-2xl font-bold rounded-lg bg-muted/30 border border-gray-300 dark:border-gray-600 text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setTeam1Score(team1Score + 1)}
                  className="size-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <Plus className="size-3 text-foreground" />
                </button>
              </div>
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
                  className="size-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <Minus className="size-3 text-foreground" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) =>
                    setTeam2Score(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-14 h-12 text-center text-2xl font-bold rounded-lg bg-muted/30 border border-gray-300 dark:border-gray-600 text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setTeam2Score(team2Score + 1)}
                  className="size-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <Plus className="size-3 text-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Override Winner */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOverrideWinner(!overrideWinner)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  overrideWinner ? "bg-green-primary" : "bg-gray-400"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    overrideWinner ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs text-muted-foreground">
                {t("overrideWinner") || "Override Winner"}
              </span>
            </div>

            {overrideWinner && (
              <div className="mt-2 flex gap-2">
                {entity1Id && (
                  <button
                    type="button"
                    onClick={() => setWinnerId(entity1Id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      winnerId === entity1Id
                        ? "bg-green-primary/10 border border-green-primary text-green-primary"
                        : "bg-muted/30 border border-gray-300 dark:border-gray-600 text-foreground hover:border-green-primary/50"
                    }`}
                  >
                    {entity1Name}
                  </button>
                )}
                {entity2Id && (
                  <button
                    type="button"
                    onClick={() => setWinnerId(entity2Id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      winnerId === entity2Id
                        ? "bg-green-primary/10 border border-green-primary text-green-primary"
                        : "bg-muted/30 border border-gray-300 dark:border-gray-600 text-foreground hover:border-green-primary/50"
                    }`}
                  >
                    {entity2Name}
                  </button>
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
            {hasExistingResult && !showClearConfirm && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                {t("clearResult") || "Clear Result"}
              </button>
            )}
            {showClearConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t("clearResultConfirm") || "Clear result?"}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={clearing}
                  className="text-xs text-red-500 font-medium flex items-center gap-1"
                >
                  {clearing && <Loader2 className="size-3 animate-spin" />}
                  {t("yes") || "Yes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs text-muted-foreground"
                >
                  {t("no") || "No"}
                </button>
              </div>
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
              disabled={saving}
              className="px-4 py-2 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors flex items-center gap-1"
            >
              {saving && <Loader2 className="size-3 animate-spin" />}
              {t("saveResult") || "Save Result"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Check, X } from "lucide-react";
import { setCustomMatchResultAction } from "@/app/[locale]/_Lib/actions";
import { showSuccess } from "@/lib/bracket-toast";

export default function InlineScoreEditor({
  tournament,
  match,
  onResultSet,
  onCancel,
  participationType,
}) {
  const t = useTranslations("TournamentDetails");
  const isPlayer = participationType === "player";

  const entity1 = isPlayer ? match.player1 : match.team1;
  const entity2 = isPlayer ? match.player2 : match.team2;
  const entity1Id = entity1?.id || entity1?._id;
  const entity2Id = entity2?.id || entity2?._id;

  const hasExistingResult =
    match.result?.team1Score !== undefined && match.result?.team1Score !== null;

  const [score1, setScore1] = useState(hasExistingResult ? match.result.team1Score : 0);
  const [score2, setScore2] = useState(hasExistingResult ? match.result.team2Score : 0);
  const [saving, setSaving] = useState(false);
  const score1Ref = useRef(null);

  const tournamentId = tournament.id || tournament._id;
  const matchId = match.id || match._id;

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => score1Ref.current?.select(), 50);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { team1Score: score1, team2Score: score2 };
      if (score1 > score2 && entity1Id) payload.winner = entity1Id;
      else if (score2 > score1 && entity2Id) payload.winner = entity2Id;

      const result = await setCustomMatchResultAction(tournamentId, matchId, payload);
      if (result.success) {
        showSuccess(t("resultSaved") || "Result saved");
        onResultSet?.();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-1 px-2 py-1"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={score1Ref}
        type="number"
        min="0"
        max="99"
        value={score1}
        onChange={(e) => setScore1(Math.max(0, parseInt(e.target.value) || 0))}
        onKeyDown={handleKeyDown}
        className="w-8 h-6 text-center text-xs font-mono font-bold rounded border border-green-primary/50 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-green-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        disabled={saving}
      />
      <span className="text-muted-foreground text-xs">-</span>
      <input
        type="number"
        min="0"
        max="99"
        value={score2}
        onChange={(e) => setScore2(Math.max(0, parseInt(e.target.value) || 0))}
        onKeyDown={handleKeyDown}
        className="w-8 h-6 text-center text-xs font-mono font-bold rounded border border-green-primary/50 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-green-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        disabled={saving}
      />
      {saving ? (
        <Loader2 className="size-3 animate-spin text-green-primary" />
      ) : (
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={handleSave}
            className="p-0.5 rounded hover:bg-green-primary/10 text-green-primary"
            title={`${t("save") || "Save"} (Enter)`}
          >
            <Check className="size-3" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-0.5 rounded hover:bg-red-500/10 text-red-500"
            title={`${t("cancel") || "Cancel"} (Esc)`}
          >
            <X className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}

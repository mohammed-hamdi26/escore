"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import {
  Trophy,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  Check,
  Play,
  Eye,
  EyeOff,
} from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import ConfirmationDialog from "../shared/ConfirmationDialog";

function BracketHeader({
  bracket,
  error,
  onRefresh,
  onDelete,
  deleting,
  onCalculateAdvancement,
  onConfirmAdvancement,
  confirmingAdvancement,
  advancementProposal,
  advancementSeeds,
  onAdvancementSeedsChange,
  showAdvancementModal,
  onShowAdvancementModalChange,
  onToggleStageVisibility,
  activeStageTab,
  onActiveStageTabChange,
}) {
  const t = useTranslations("TournamentDetails");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const bracketTypeLabel = {
    single_elimination: t("singleElimination") || "Single Elimination",
    double_elimination: t("doubleElimination") || "Double Elimination",
    round_robin: t("roundRobin") || "Round Robin",
    swiss: t("swissSystem") || "Swiss System",
    battle_royale: t("battleRoyaleBracket") || "Battle Royale",
    multi_stage: t("multiStage") || "Multi-Stage",
    custom: t("customBracket") || "Custom",
  };

  // Calculate match stats for delete confirmation
  const matchStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    const countRounds = (rounds) => {
      if (!rounds) return;
      rounds.forEach((r) => {
        if (r.matches) {
          total += r.matches.length;
          completed += r.matches.filter((m) => m.status === "completed" || m.result?.winner).length;
        }
      });
    };
    if (bracket.isMultiStage && bracket.stages) {
      bracket.stages.forEach((s) => {
        if (!s.isGenerated) return;
        if (s.groups) s.groups.forEach((g) => countRounds(g.rounds));
        if (s.swissRounds) countRounds(s.swissRounds);
        if (s.rounds?.winners) countRounds(s.rounds.winners);
        if (s.rounds?.losers) countRounds(s.rounds.losers);
        if (s.rounds?.grandFinals) { total += s.rounds.grandFinals.length; completed += s.rounds.grandFinals.filter((m) => m.status === "completed" || m.result?.winner).length; }
      });
    } else if (bracket.bracketType === "custom") {
      if (bracket.matches) { total = bracket.matches.length; completed = bracket.matches.filter((m) => m.status === "completed" || m.result?.winner).length; }
    } else {
      if (bracket.groups) bracket.groups.forEach((g) => countRounds(g.rounds));
      if (bracket.swissRounds) countRounds(bracket.swissRounds);
      if (bracket.rounds?.winners) countRounds(bracket.rounds.winners);
      if (bracket.rounds?.losers) countRounds(bracket.rounds.losers);
      if (bracket.rounds?.grandFinals) { total += bracket.rounds.grandFinals.length; completed += bracket.rounds.grandFinals.filter((m) => m.status === "completed" || m.result?.winner).length; }
      if (Array.isArray(bracket.rounds)) countRounds(bracket.rounds);
    }
    return { total, completed };
  }, [bracket]);

  const deleteDescription = useMemo(() => {
    const { total, completed } = matchStats;
    if (bracket.bracketStatus === "in_progress" && completed > 0) {
      return (t("deleteBracketInProgress") || "This bracket is in progress. Deleting will permanently remove all {total} matches, including {completed} with recorded results.")
        .replace("{total}", String(total))
        .replace("{completed}", String(completed));
    }
    if (bracket.bracketStatus === "completed") {
      return (t("deleteBracketCompleted") || "This bracket is completed. Deleting will permanently remove all {total} matches and their results.")
        .replace("{total}", String(total));
    }
    return (t("deleteBracketGenerated") || "Delete this bracket and all {total} generated matches? This cannot be undone.")
      .replace("{total}", String(total));
  }, [bracket, matchStats, t]);

  const canAdvanceStage =
    bracket.isMultiStage &&
    bracket.stages &&
    bracket.currentStage !== undefined &&
    bracket.stages.find((s) => s.stageOrder === bracket.currentStage)
      ?.isCompleted &&
    bracket.stages.some(
      (s) => s.stageOrder === bracket.currentStage + 1 && !s.isGenerated
    );

  const moveAdvancementSeed = (index, direction) => {
    const newSeeds = [...advancementSeeds];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSeeds.length) return;
    [newSeeds[index], newSeeds[targetIndex]] = [
      newSeeds[targetIndex],
      newSeeds[index],
    ];
    onAdvancementSeedsChange(newSeeds);
  };

  const handleDelete = async () => {
    await onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="size-5 text-green-primary" />
          {t("bracket") || "Bracket"}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {bracketTypeLabel[bracket.bracketType] || bracket.bracketType}
          </span>
          {bracket.bracketType === "swiss" && bracket.currentSwissRound && (
            <span className="text-xs font-normal text-muted-foreground">
              ({t("round") || "Round"} {bracket.currentSwissRound}/
              {bracket.swissConfig?.totalRounds || "?"})
            </span>
          )}
          {bracket.bracketType === "battle_royale" && bracket.currentBRRound && (
            <span className="text-xs font-normal text-muted-foreground">
              ({t("round") || "Round"} {bracket.currentBRRound}/
              {bracket.battleRoyaleConfig?.totalRounds || "?"})
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              bracket.bracketStatus === "completed"
                ? "bg-purple-500/10 text-purple-500"
                : bracket.bracketStatus === "in_progress"
                ? "bg-green-500/10 text-green-500"
                : "bg-blue-500/10 text-blue-500"
            }`}
          >
            {t(bracket.bracketStatus) || bracket.bracketStatus}
          </span>

          {/* Advance Stage button */}
          {canAdvanceStage && (
            <Button
              onClick={onCalculateAdvancement}
              size="sm"
              className="gap-1 bg-green-primary hover:bg-green-primary/90 text-white"
            >
              <ArrowRight className="size-3.5" />
              {t("advanceToNextStage") || "Advance to Next Stage"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="gap-1 border-gray-300 dark:border-gray-600"
          >
            <RefreshCw className="size-3.5" />
            {t("refresh") || "Refresh"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="size-3.5" />
            {t("deleteBracket") || "Delete"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
          <AlertTriangle className="size-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t("deleteBracket") || "Delete Bracket"}
        description={deleteDescription}
        confirmLabel={t("deleteBracket") || "Delete Bracket"}
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleting}
      />

      {/* Advancement Modal */}
      {showAdvancementModal && advancementProposal && (
        <div className="mb-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <ArrowRight className="size-4 text-green-primary" />
            {t("advancementProposal") || "Advance to"}{" "}
            {advancementProposal.nextStageName}
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            {t("qualifyingTeams") || "Qualifying teams"} (
            {advancementSeeds.length})
            {" — "}
            {t("reorderSeeds") || "reorder seeds below, then confirm"}
          </p>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {advancementSeeds.map((team, index) => (
              <div
                key={team.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-transparent hover:border-green-primary/20 transition-colors"
              >
                <span className="text-xs font-bold text-green-primary w-6 text-center">
                  #{index + 1}
                </span>
                {team.logo?.light ? (
                  <img
                    src={getImgUrl(team.logo.light, "thumbnail")}
                    alt={team.name}
                    className="size-6 rounded object-cover"
                  />
                ) : (
                  <div className="size-6 rounded bg-muted flex items-center justify-center">
                    <Trophy className="size-3 text-muted-foreground" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground flex-1">
                  {team.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {team.reason}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveAdvancementSeed(index, -1)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="size-4 text-muted-foreground rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAdvancementSeed(index, 1)}
                    disabled={index === advancementSeeds.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onConfirmAdvancement}
              disabled={confirmingAdvancement}
              className="gap-1 bg-green-primary hover:bg-green-primary/90 text-white"
            >
              {confirmingAdvancement ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
              {confirmingAdvancement
                ? t("generating") || "Generating..."
                : t("confirmAndGenerate") || "Confirm & Generate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowAdvancementModalChange(false)}
              className="border-gray-300 dark:border-gray-600"
            >
              {t("cancel") || "Cancel"}
            </Button>
          </div>
        </div>
      )}

      {/* Multi-stage: Stage Tabs */}
      {bracket.isMultiStage && bracket.stages && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {bracket.stages.map((stage) => (
            <button
              key={stage.stageOrder}
              onClick={() => onActiveStageTabChange(stage.stageOrder)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeStageTab === stage.stageOrder
                  ? "bg-green-primary text-white"
                  : stage.isGenerated
                  ? "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  : "bg-muted/10 text-muted-foreground/50 cursor-default"
              }`}
            >
              {stage.isCompleted ? (
                <Check className="size-3.5 text-green-300" />
              ) : stage.isGenerated ? (
                <Play className="size-3.5" />
              ) : null}
              {stage.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStageVisibility(
                    stage.stageOrder,
                    stage.isVisibleInApp
                  );
                }}
                className={`ml-1 p-1 rounded transition-colors ${
                  stage.isVisibleInApp
                    ? "text-green-300 hover:text-green-200"
                    : "text-red-400 hover:text-red-300"
                }`}
                title={
                  stage.isVisibleInApp
                    ? t("visibleInApp") || "Visible in app"
                    : t("hiddenFromApp") || "Hidden from app"
                }
              >
                {stage.isVisibleInApp ? (
                  <Eye className="size-3.5" />
                ) : (
                  <EyeOff className="size-3.5" />
                )}
              </button>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default BracketHeader;

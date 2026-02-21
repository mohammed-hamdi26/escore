"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Eye, EyeOff, Trophy, AlertCircle } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import InlineError from "../shared/InlineError";

function MultiStageConfig({ config, onConfigChange, seeds }) {
  const t = useTranslations("TournamentDetails");

  const { stages = [] } = config;

  // --- Validation ---
  const stageErrors = useMemo(() => {
    return stages.map((stage, index) => {
      const errors = [];
      if (!stage.name?.trim()) errors.push(t("stageNameRequired") || "Stage name is required");
      if (stage.name?.length > 100) errors.push(t("stageNameTooLong") || "Stage name must be under 100 characters");
      if (!stage.bracketType) errors.push(t("bracketTypeRequired") || "Bracket type is required");
      // Advancement rule validation (not last stage)
      if (index < stages.length - 1) {
        if (!stage.advancementRule?.type) errors.push(t("advancementRuleRequired") || "Advancement rule is required");
        if ((stage.advancementRule?.count || 0) < 1) errors.push(t("advancementCountMin") || "Teams to advance must be at least 1");
        if (stage.advancementRule?.type === "top_n_per_group" && stage.bracketType !== "round_robin") {
          errors.push(t("topPerGroupOnlyRR") || "Top N per group is only valid for round robin stages");
        }
      }
      // RR group validation for first stage
      if (stage.bracketType === "round_robin" && index === 0) {
        const groups = stage.config?.groups || [];
        if (groups.length === 0) errors.push(t("needAtLeast1Group") || "At least 1 group required");
        for (const g of groups) {
          if (!g.name?.trim()) errors.push(t("groupNameRequired") || "Group name is required");
          if (g.teamIds.length < 2) errors.push(t("groupNeedTeams") || "Each group needs at least 2 teams");
        }
      }
      // Swiss validation
      if (stage.bracketType === "swiss") {
        const sc = stage.config?.swissConfig || {};
        if (sc.totalRounds && sc.winsToQualify && sc.winsToQualify > sc.totalRounds) {
          errors.push(t("winsExceedRounds") || "Wins to qualify exceeds total rounds");
        }
      }
      return errors;
    });
  }, [stages, t]);

  const updateStage = (index, updates) => {
    onConfigChange({
      stages: stages.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    });
  };

  const updateStageConfig = (index, configUpdates) => {
    onConfigChange({
      stages: stages.map((s, i) =>
        i === index
          ? { ...s, config: { ...s.config, ...configUpdates } }
          : s
      ),
    });
  };

  const addStage = () => {
    const newOrder = stages.length;
    onConfigChange({
      stages: [
        ...stages,
        {
          stageOrder: newOrder,
          name: `Stage ${newOrder + 1}`,
          bracketType: "single_elimination",
          isVisibleInApp: true,
          config: { defaultBestOf: 3 },
        },
      ],
    });
  };

  const removeStage = (index) => {
    if (stages.length <= 2) return;
    const newStages = stages
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, stageOrder: i }));
    onConfigChange({ stages: newStages });
  };

  const addStageGroup = (stageIndex) => {
    const stage = stages[stageIndex];
    const currentGroups = stage.config?.groups || [];
    const letter = String.fromCharCode(65 + currentGroups.length);
    updateStageConfig(stageIndex, {
      groups: [...currentGroups, { name: `Group ${letter}`, teamIds: [] }],
    });
  };

  const removeStageGroup = (stageIndex, groupIndex) => {
    const stage = stages[stageIndex];
    const currentGroups = stage.config?.groups || [];
    if (currentGroups.length <= 1) return;
    updateStageConfig(stageIndex, {
      groups: currentGroups.filter((_, i) => i !== groupIndex),
    });
  };

  const toggleTeamInStageGroup = (stageIndex, groupIndex, teamId) => {
    const stage = stages[stageIndex];
    const currentGroups = (stage.config?.groups || []).map((g) => ({
      ...g,
      teamIds: g.teamIds.filter((id) => id !== teamId),
    }));
    const isInGroup = (stage.config?.groups || [])[groupIndex]?.teamIds.includes(teamId);
    if (!isInGroup) {
      currentGroups[groupIndex].teamIds.push(teamId);
    }
    updateStageConfig(stageIndex, { groups: currentGroups });
  };

  const getTeamStageGroup = (stageIndex, teamId) => {
    const stage = stages[stageIndex];
    return (stage.config?.groups || []).findIndex((g) =>
      g.teamIds.includes(teamId)
    );
  };

  const STAGE_BRACKET_TYPES = [
    { value: "round_robin", label: t("roundRobin") || "Round Robin" },
    { value: "single_elimination", label: t("singleElimination") || "Single Elimination" },
    { value: "double_elimination", label: t("doubleElimination") || "Double Elimination" },
    { value: "swiss", label: t("swissSystem") || "Swiss" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {t("stageConfiguration") || "Stage Configuration"}
        </label>
        <button
          type="button"
          onClick={addStage}
          className="flex items-center gap-1 text-xs text-green-primary hover:text-green-primary/80 font-medium"
        >
          <Plus className="size-3" />
          {t("addStage") || "Add Stage"}
        </button>
      </div>

      {stages.length < 2 && (
        <InlineError error={t("needAtLeast2Stages") || "At least 2 stages are required"} />
      )}

      {stages.map((stage, stageIndex) => {
        const hasErrors = stageErrors[stageIndex]?.length > 0;
        return (
        <div
          key={stageIndex}
          className={`p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border transition-colors ${
            hasErrors ? "border-red-500/50" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          {/* Stage Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`relative text-xs font-bold px-2 py-1 rounded ${
              hasErrors
                ? "text-red-500 bg-red-500/10"
                : "text-green-primary bg-green-primary/10"
            }`}>
              {stageIndex + 1}
              {hasErrors && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
              )}
            </span>
            <input
              type="text"
              value={stage.name}
              onChange={(e) =>
                updateStage(stageIndex, { name: e.target.value })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
              placeholder={t("stageName") || "Stage name"}
            />
            <button
              type="button"
              onClick={() =>
                updateStage(stageIndex, {
                  isVisibleInApp: !stage.isVisibleInApp,
                })
              }
              className={`p-2 rounded transition-colors ${
                stage.isVisibleInApp
                  ? "text-green-primary hover:bg-green-primary/10"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
              title={
                stage.isVisibleInApp
                  ? t("visibleInApp") || "Visible in app"
                  : t("hiddenFromApp") || "Hidden from app"
              }
            >
              {stage.isVisibleInApp ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>
            {stages.length > 2 && (
              <button
                type="button"
                onClick={() => removeStage(stageIndex)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

          {/* Stage Bracket Type */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {STAGE_BRACKET_TYPES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  updateStage(stageIndex, { bracketType: opt.value })
                }
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  stage.bracketType === opt.value
                    ? "border-green-primary bg-green-primary/10 text-green-primary"
                    : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Stage Best-of */}
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">
              {t("defaultBestOf") || "Best Of"}
            </label>
            <div className="flex gap-2">
              {[1, 3, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    updateStageConfig(stageIndex, { defaultBestOf: n })
                  }
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    (stage.config?.defaultBestOf || 1) === n
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                  }`}
                >
                  Bo{n}
                </button>
              ))}
            </div>
          </div>

          {/* Advancement Rule (non-last stages) */}
          {stageIndex < stages.length - 1 && (
            <div className="p-3 rounded-lg bg-background border border-gray-200 dark:border-gray-700">
              <label className="block text-xs font-medium text-foreground mb-2">
                {t("advancementRules") || "Advancement Rules"}
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    updateStage(stageIndex, {
                      advancementRule: {
                        ...stage.advancementRule,
                        type: "top_n_per_group",
                      },
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    stage.advancementRule?.type === "top_n_per_group"
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground"
                  }`}
                >
                  {t("topPerGroup") || "Top N per Group"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateStage(stageIndex, {
                      advancementRule: {
                        ...stage.advancementRule,
                        type: "top_n_overall",
                      },
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    stage.advancementRule?.type === "top_n_overall"
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground"
                  }`}
                >
                  {t("topOverall") || "Top N Overall"}
                </button>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("teamsToAdvance") || "Teams to advance"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stage.advancementRule?.count || 2}
                  onChange={(e) =>
                    updateStage(stageIndex, {
                      advancementRule: {
                        ...stage.advancementRule,
                        count: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-20 px-3 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                />
              </div>
            </div>
          )}

          {/* Round Robin Group Config (first stage only if RR) */}
          {stage.bracketType === "round_robin" && stageIndex === 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-foreground">
                  {t("groupConfiguration") || "Groups"}
                </label>
                <button
                  type="button"
                  onClick={() => addStageGroup(stageIndex)}
                  className="flex items-center gap-1 text-xs text-green-primary hover:text-green-primary/80 font-medium"
                >
                  <Plus className="size-3" />
                  {t("addGroup") || "Add Group"}
                </button>
              </div>
              {(stage.config?.groups || []).map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="mb-2 p-3 rounded-lg bg-muted/20 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => {
                        const newGroups = [...(stage.config?.groups || [])];
                        newGroups[groupIndex] = {
                          ...newGroups[groupIndex],
                          name: e.target.value,
                        };
                        updateStageConfig(stageIndex, { groups: newGroups });
                      }}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-xs"
                    />
                    {(stage.config?.groups || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeStageGroup(stageIndex, groupIndex)
                        }
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {seeds.map((team) => {
                      const currentGroup = getTeamStageGroup(
                        stageIndex,
                        team.id
                      );
                      const isInThisGroup = currentGroup === groupIndex;
                      const isInOtherGroup =
                        currentGroup !== -1 && currentGroup !== groupIndex;

                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() =>
                            toggleTeamInStageGroup(
                              stageIndex,
                              groupIndex,
                              team.id
                            )
                          }
                          disabled={isInOtherGroup}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${
                            isInThisGroup
                              ? "bg-green-primary/10 border border-green-primary text-green-primary"
                              : isInOtherGroup
                              ? "bg-muted/20 border border-transparent text-muted-foreground opacity-50 cursor-not-allowed"
                              : "bg-background border border-gray-300 dark:border-gray-600 hover:border-green-primary/50 text-foreground"
                          }`}
                        >
                          {team.logo?.light ? (
                            <img
                              src={getImgUrl(team.logo.light, "thumbnail")}
                              alt={team.name}
                              className="size-4 rounded"
                            />
                          ) : (
                            <div className="size-4 rounded bg-muted" />
                          )}
                          <span className="truncate">{team.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Swiss config for stage */}
          {stage.bracketType === "swiss" && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("totalRounds") || "Rounds"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stage.config?.swissConfig?.totalRounds || 5}
                  onChange={(e) =>
                    updateStageConfig(stageIndex, {
                      swissConfig: {
                        ...(stage.config?.swissConfig || {}),
                        totalRounds: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("winsToQualify") || "Wins"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stage.config?.swissConfig?.winsToQualify || 3}
                  onChange={(e) =>
                    updateStageConfig(stageIndex, {
                      swissConfig: {
                        ...(stage.config?.swissConfig || {}),
                        winsToQualify: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("lossesToEliminate") || "Losses"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stage.config?.swissConfig?.lossesToEliminate || 3}
                  onChange={(e) =>
                    updateStageConfig(stageIndex, {
                      swissConfig: {
                        ...(stage.config?.swissConfig || {}),
                        lossesToEliminate: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-xs"
                />
              </div>
            </div>
          )}

          {/* Per-stage errors */}
          {stageErrors[stageIndex]?.length > 0 && (
            <div className="mt-3 space-y-1">
              {stageErrors[stageIndex].map((err, i) => (
                <InlineError key={i} error={err} />
              ))}
            </div>
          )}
        </div>
      );
      })}
    </div>
  );
}

export default MultiStageConfig;

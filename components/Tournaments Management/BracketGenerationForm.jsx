"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Trophy,
  Loader2,
  AlertTriangle,
  Layers,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import BracketTypeSelector from "./BracketTypeSelector";
import SeedOrderManager from "./SeedOrderManager";
import SingleElimConfig from "./bracket-config/SingleElimConfig";
import DoubleElimConfig from "./bracket-config/DoubleElimConfig";
import RoundRobinConfig from "./bracket-config/RoundRobinConfig";
import SwissConfig from "./bracket-config/SwissConfig";
import BattleRoyaleConfig from "./bracket-config/BattleRoyaleConfig";
import CustomBracketConfig from "./bracket-config/CustomBracketConfig";
import MultiStageConfig from "./bracket-config/MultiStageConfig";

function BracketGenerationForm({
  tournament,
  onGenerate,
  generating,
  error,
}) {
  const t = useTranslations("TournamentDetails");

  const isPlayerBased = tournament.participationType === "player";
  const participants = isPlayerBased ? tournament.players : tournament.teams;

  // --- Form State ---
  const [bracketType, setBracketType] = useState("single_elimination");
  const [seeds, setSeeds] = useState([]);
  const [isMultiStage, setIsMultiStage] = useState(false);

  // Single bracket config
  const [bestOf, setBestOf] = useState(3);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [grandFinalsReset, setGrandFinalsReset] = useState(true);
  const [showAdvancedBestOf, setShowAdvancedBestOf] = useState(false);
  const [bestOfPerRound, setBestOfPerRound] = useState([]);
  const [groups, setGroups] = useState([{ name: "Group A", teamIds: [] }]);
  const [swissConfig, setSwissConfig] = useState({
    totalRounds: 5,
    winsToQualify: 3,
    lossesToEliminate: 3,
  });
  const [brConfig, setBrConfig] = useState({
    totalRounds: 3,
    teamsPerLobby: 10,
    totalLobbies: 0,
    eliminationRules: [],
  });

  // Custom bracket config
  const [customRounds, setCustomRounds] = useState(1);
  const [customBestOf, setCustomBestOf] = useState(1);

  // Multi-stage config
  const [stages, setStages] = useState([
    {
      stageOrder: 0,
      name: t("groupStage") || "Group Stage",
      bracketType: "round_robin",
      isVisibleInApp: true,
      advancementRule: { type: "top_n_per_group", count: 2 },
      config: { defaultBestOf: 1, groups: [{ name: "Group A", teamIds: [] }] },
    },
    {
      stageOrder: 1,
      name: t("knockout") || "Knockout",
      bracketType: "single_elimination",
      isVisibleInApp: true,
      config: { defaultBestOf: 3 },
    },
  ]);

  // Initialize seeds from participants
  useEffect(() => {
    if (participants && participants.length > 0) {
      setSeeds(
        participants.map((p) => ({
          id: p.id || p._id || p,
          name: isPlayerBased
            ? p.nickname || p.name || "Unknown"
            : p.name || "Unknown",
          logo: isPlayerBased ? p.photo : p.logo,
        }))
      );
    }
  }, [participants, isPlayerBased]);

  // --- Helpers ---

  const getAvailableRounds = () => {
    if (!bracketType || seeds.length < 2) return [];
    const teamCount = seeds.length;
    const rounds = [];

    if (bracketType === "single_elimination") {
      const numRounds = Math.ceil(Math.log2(teamCount));
      for (let i = 1; i <= numRounds; i++) {
        rounds.push({ stage: "winners", round: i, label: `Winners R${i}` });
      }
    } else if (bracketType === "double_elimination") {
      const numWinnersRounds = Math.ceil(Math.log2(teamCount));
      const numLosersRounds = Math.max(1, (numWinnersRounds - 1) * 2);
      for (let i = 1; i <= numWinnersRounds; i++) {
        rounds.push({ stage: "winners", round: i, label: `Winners R${i}` });
      }
      for (let i = 1; i <= numLosersRounds; i++) {
        rounds.push({ stage: "losers", round: i, label: `Losers R${i}` });
      }
      rounds.push({ stage: "grand_finals", round: 1, label: "Grand Finals" });
    } else if (bracketType === "round_robin") {
      const maxGroupSize = Math.max(...groups.map((g) => g.teamIds.length), 2);
      const numRounds = maxGroupSize - 1;
      for (let i = 1; i <= numRounds; i++) {
        rounds.push({ stage: "group_stage", round: i, label: `Group R${i}` });
      }
    } else if (bracketType === "swiss") {
      for (let i = 1; i <= swissConfig.totalRounds; i++) {
        rounds.push({ stage: "swiss", round: i, label: `Swiss R${i}` });
      }
    }
    return rounds;
  };

  // --- Build Payload ---

  const buildPayload = () => {
    if (isMultiStage) {
      const firstStage = stages[0];
      let firstStageSeeds;
      if (firstStage.bracketType === "round_robin") {
        firstStageSeeds = (firstStage.config?.groups || []).flatMap(
          (g) => g.teamIds
        );
      } else {
        firstStageSeeds = seeds.map((s) => s.id);
      }

      return {
        bracketType: "multi_stage",
        seeds: firstStageSeeds,
        stages: stages.map((s) => ({
          stageOrder: s.stageOrder,
          name: s.name,
          bracketType: s.bracketType,
          isVisibleInApp: s.isVisibleInApp,
          advancementRule: s.advancementRule,
          config: s.config,
        })),
      };
    }

    if (bracketType === "custom") {
      const roundsArray = Array.from({ length: customRounds }, (_, i) => ({
        name: `Round ${i + 1}`,
        bestOf: customBestOf,
        matches: [{}],
      }));
      return {
        bracketType: "custom",
        customConfig: { rounds: roundsArray },
      };
    }

    // Standard bracket payload
    const payload = {
      bracketType,
      defaultBestOf: bestOf,
      autoAdvance,
    };

    if (bracketType === "round_robin") {
      const allTeamIds = groups.flatMap((g) => g.teamIds);
      payload.seeds = allTeamIds;
      payload.groups = groups.map((g) => ({
        name: g.name,
        teamIds: g.teamIds,
      }));
    } else {
      payload.seeds = seeds.map((s) => s.id);
    }

    if (bracketType === "double_elimination") {
      payload.grandFinalsReset = grandFinalsReset;
    }

    if (bestOfPerRound.length > 0) {
      payload.bestOfPerRound = bestOfPerRound;
    }

    if (bracketType === "swiss") {
      payload.swissConfig = swissConfig;
    }

    if (bracketType === "battle_royale") {
      payload.battleRoyaleConfig = {
        totalRounds: brConfig.totalRounds,
        teamsPerLobby: brConfig.teamsPerLobby,
        ...(brConfig.totalLobbies > 0 && {
          totalLobbies: brConfig.totalLobbies,
        }),
        ...(brConfig.eliminationRules.length > 0 && {
          eliminationRules: brConfig.eliminationRules,
        }),
      };
    }

    return payload;
  };

  const handleGenerate = () => {
    const payload = buildPayload();
    onGenerate(payload);
  };

  // --- Config Change Handlers ---

  const handleSingleElimChange = (updates) => {
    if ("bestOf" in updates) setBestOf(updates.bestOf);
    if ("autoAdvance" in updates) setAutoAdvance(updates.autoAdvance);
    if ("bestOfPerRound" in updates) setBestOfPerRound(updates.bestOfPerRound);
  };

  const handleDoubleElimChange = (updates) => {
    if ("bestOf" in updates) setBestOf(updates.bestOf);
    if ("autoAdvance" in updates) setAutoAdvance(updates.autoAdvance);
    if ("grandFinalsReset" in updates)
      setGrandFinalsReset(updates.grandFinalsReset);
    if ("bestOfPerRound" in updates) setBestOfPerRound(updates.bestOfPerRound);
  };

  const handleRoundRobinChange = (updates) => {
    if ("bestOf" in updates) setBestOf(updates.bestOf);
    if ("groups" in updates) setGroups(updates.groups);
  };

  const handleSwissChange = (updates) => {
    if ("bestOf" in updates) setBestOf(updates.bestOf);
    if ("swissConfig" in updates) setSwissConfig(updates.swissConfig);
  };

  const handleBRChange = (updates) => {
    if ("battleRoyaleConfig" in updates)
      setBrConfig(updates.battleRoyaleConfig);
  };

  const handleCustomChange = (updates) => {
    if ("customRounds" in updates) setCustomRounds(updates.customRounds);
    if ("customBestOf" in updates) setCustomBestOf(updates.customBestOf);
  };

  const handleMultiStageChange = (updates) => {
    if ("stages" in updates) setStages(updates.stages);
  };

  // --- Render ---

  if (!participants || participants.length < 2) {
    return (
      <div className="text-center py-8">
        <Trophy className="size-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">
          {isPlayerBased
            ? t("needPlayers") ||
              "At least 2 players are required to generate a bracket."
            : t("needTeams") ||
              "At least 2 teams are required to generate a bracket."}
        </p>
      </div>
    );
  }

  // --- Validation ---

  const getMinSeeds = () => {
    if (bracketType === "battle_royale") return 3;
    return 2;
  };

  const getValidationErrors = () => {
    const errors = [];

    if (isMultiStage) {
      // Multi-stage validation delegated to MultiStageConfig
      if (stages.length < 2) errors.push(t("needAtLeast2Stages") || "At least 2 stages required");
      return errors;
    }

    if (bracketType === "custom") return errors; // Custom doesn't need seed validation

    const minSeeds = getMinSeeds();
    if (bracketType === "round_robin") {
      const allTeamIds = groups.flatMap((g) => g.teamIds);
      if (allTeamIds.length < minSeeds) {
        errors.push(t("seedCountError") || `At least ${minSeeds} teams required`);
      }
      // Group-level validation
      for (const group of groups) {
        if (!group.name.trim()) errors.push(t("groupNameRequired") || "Group name is required");
        if (group.teamIds.length < 2) errors.push(t("groupNeedTeams") || `Each group needs at least 2 teams`);
      }
    } else {
      if (seeds.length < minSeeds) {
        errors.push(t("seedCountError") || `At least ${minSeeds} participants required`);
      }
    }

    if (bracketType === "swiss") {
      const { totalRounds, winsToQualify, lossesToEliminate } = swissConfig;
      if (totalRounds < 1 || totalRounds > 20) errors.push(t("totalRoundsRange") || "Total rounds must be 1-20");
      if (winsToQualify > totalRounds) errors.push(t("winsExceedRounds") || "Wins to qualify exceeds total rounds");
      if (lossesToEliminate > totalRounds) errors.push(t("lossesExceedRounds") || "Losses to eliminate exceeds total rounds");
    }

    if (bracketType === "battle_royale") {
      const { totalRounds, eliminationRules } = brConfig;
      const afterRounds = eliminationRules.map((r) => r.afterRound);
      const hasDuplicateRounds = new Set(afterRounds).size !== afterRounds.length;
      if (hasDuplicateRounds) errors.push(t("duplicateAfterRound") || "Duplicate 'after round' values in elimination rules");
      const totalEliminated = eliminationRules.reduce((sum, r) => sum + r.eliminateBottom, 0);
      if (totalEliminated >= seeds.length - 1) errors.push(t("tooManyEliminated") || "Elimination rules would remove too many teams");
    }

    return errors;
  };

  const validationErrors = getValidationErrors();
  const isFormValid = validationErrors.length === 0;

  // Determine which type-specific config to show
  const showSeedOrder =
    !isMultiStage &&
    bracketType !== "round_robin" &&
    bracketType !== "custom";

  const renderTypeConfig = () => {
    if (isMultiStage) {
      return (
        <MultiStageConfig
          config={{ stages }}
          onConfigChange={handleMultiStageChange}
          seeds={seeds}
        />
      );
    }

    switch (bracketType) {
      case "single_elimination":
        return (
          <SingleElimConfig
            config={{ bestOf, autoAdvance, bestOfPerRound }}
            onConfigChange={handleSingleElimChange}
            availableRounds={getAvailableRounds()}
          />
        );
      case "double_elimination":
        return (
          <DoubleElimConfig
            config={{ bestOf, autoAdvance, grandFinalsReset, bestOfPerRound }}
            onConfigChange={handleDoubleElimChange}
            availableRounds={getAvailableRounds()}
          />
        );
      case "round_robin":
        return (
          <RoundRobinConfig
            config={{ bestOf, groups }}
            onConfigChange={handleRoundRobinChange}
            seeds={seeds}
          />
        );
      case "swiss":
        return (
          <SwissConfig
            config={{ bestOf, swissConfig }}
            onConfigChange={handleSwissChange}
          />
        );
      case "battle_royale":
        return (
          <BattleRoyaleConfig
            config={{ battleRoyaleConfig: brConfig }}
            onConfigChange={handleBRChange}
            totalTeams={seeds.length}
          />
        );
      case "custom":
        return (
          <CustomBracketConfig
            config={{ customRounds, customBestOf }}
            onConfigChange={handleCustomChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
          <AlertTriangle className="size-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Multi-Stage Toggle */}
      <BracketTypeSelector
        selectedType={bracketType}
        onTypeChange={setBracketType}
        isMultiStage={isMultiStage}
        onMultiStageChange={setIsMultiStage}
      />

      {/* Type-Specific Configuration */}
      {renderTypeConfig()}

      {/* Multi-stage seed order (non-RR first stage) */}
      {isMultiStage && stages[0]?.bracketType !== "round_robin" && (
        <SeedOrderManager
          seeds={seeds}
          onSeedsChange={setSeeds}
          participationType={tournament.participationType}
          minSeeds={2}
        />
      )}

      {/* Single bracket seed order */}
      {showSeedOrder && (
        <SeedOrderManager
          seeds={seeds}
          onSeedsChange={setSeeds}
          participationType={tournament.participationType}
          minSeeds={getMinSeeds()}
        />
      )}

      {/* Validation Summary */}
      {validationErrors.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs space-y-1">
          <p className="font-medium">
            {t("fixBeforeGenerating") || `Fix ${validationErrors.length} issue(s) before generating:`}
          </p>
          <ul className="space-y-0.5 list-disc list-inside">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generating || !isFormValid}
        className="w-full gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
        title={!isFormValid ? (t("fixBeforeGenerating") || "Fix issues before generating") : undefined}
      >
        {generating ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("generating") || "Generating..."}
          </>
        ) : (
          <>
            <Trophy className="size-4" />
            {t("generateBracketBtn") || "Generate Bracket"}
          </>
        )}
      </Button>
    </div>
  );
}

export default BracketGenerationForm;

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import InlineError from "../shared/InlineError";

function BattleRoyaleConfig({ config, onConfigChange, totalTeams = 0 }) {
  const t = useTranslations("TournamentDetails");

  const {
    battleRoyaleConfig = {
      totalRounds: 3,
      teamsPerLobby: 10,
      totalLobbies: 0,
      eliminationRules: [],
    },
  } = config;

  const brConfig = battleRoyaleConfig;

  const updateBR = (updates) => {
    onConfigChange({ battleRoyaleConfig: { ...brConfig, ...updates } });
  };

  // --- Validation ---
  const fieldErrors = useMemo(() => {
    const errors = {};
    if (brConfig.totalRounds < 1 || brConfig.totalRounds > 30) errors.totalRounds = t("fieldRange1to30") || "Must be 1-30";
    if (brConfig.teamsPerLobby < 2 || brConfig.teamsPerLobby > 100) errors.teamsPerLobby = t("fieldRange2to100") || "Must be 2-100";
    if (totalTeams > 0 && brConfig.teamsPerLobby > totalTeams) errors.teamsPerLobby = t("teamsPerLobbyExceedsTotal") || `Cannot exceed total teams (${totalTeams})`;
    if (brConfig.totalLobbies < 0 || brConfig.totalLobbies > 20) errors.totalLobbies = t("fieldRange0to20") || "Must be 0-20";
    return errors;
  }, [brConfig.totalRounds, brConfig.teamsPerLobby, brConfig.totalLobbies, totalTeams, t]);

  const ruleErrors = useMemo(() => {
    const afterRoundsSeen = new Set();
    return brConfig.eliminationRules.map((rule) => {
      const errors = [];
      if (rule.afterRound < 1 || rule.afterRound > brConfig.totalRounds) {
        errors.push(t("afterRoundRange") || `After round must be 1-${brConfig.totalRounds}`);
      }
      if (afterRoundsSeen.has(rule.afterRound)) {
        errors.push(t("duplicateAfterRound") || "Duplicate round number");
      }
      afterRoundsSeen.add(rule.afterRound);
      if (rule.eliminateBottom < 1) errors.push(t("eliminateMin1") || "Must eliminate at least 1");
      return errors;
    });
  }, [brConfig.eliminationRules, brConfig.totalRounds, t]);

  const totalEliminated = brConfig.eliminationRules.reduce((sum, r) => sum + r.eliminateBottom, 0);
  const lobbyCount = brConfig.totalLobbies > 0
    ? brConfig.totalLobbies
    : totalTeams > 0 && brConfig.teamsPerLobby > 0
    ? Math.ceil(totalTeams / brConfig.teamsPerLobby)
    : "?";

  const addRule = () => {
    updateBR({
      eliminationRules: [
        ...brConfig.eliminationRules,
        {
          afterRound: brConfig.eliminationRules.length + 1,
          eliminateBottom: 2,
        },
      ],
    });
  };

  const updateRule = (ruleIndex, field, value) => {
    const updated = [...brConfig.eliminationRules];
    updated[ruleIndex] = {
      ...updated[ruleIndex],
      [field]: parseInt(value) || 1,
    };
    updateBR({ eliminationRules: updated });
  };

  const removeRule = (ruleIndex) => {
    updateBR({
      eliminationRules: brConfig.eliminationRules.filter(
        (_, i) => i !== ruleIndex
      ),
    });
  };

  return (
    <div className="space-y-4">
      {/* Battle Royale Configuration */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          {t("brConfiguration") || "Battle Royale Configuration"}
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              {t("totalRounds") || "Total Rounds"}
            </label>
            <input
              type="number"
              min="1"
              max="30"
              step="1"
              value={brConfig.totalRounds}
              onChange={(e) =>
                updateBR({ totalRounds: parseInt(e.target.value) || 1 })
              }
              className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground text-sm ${
                fieldErrors.totalRounds ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            <InlineError error={fieldErrors.totalRounds} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              {t("teamsPerLobby") || "Teams per Lobby"}
            </label>
            <input
              type="number"
              min="2"
              max="100"
              step="1"
              value={brConfig.teamsPerLobby}
              onChange={(e) =>
                updateBR({ teamsPerLobby: parseInt(e.target.value) || 2 })
              }
              className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground text-sm ${
                fieldErrors.teamsPerLobby ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            <InlineError error={fieldErrors.teamsPerLobby} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              {t("totalLobbies") || "Total Lobbies"}
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="1"
              value={brConfig.totalLobbies}
              onChange={(e) =>
                updateBR({ totalLobbies: parseInt(e.target.value) || 0 })
              }
              className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground text-sm ${
                fieldErrors.totalLobbies ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder={t("autoCalculated") || "Auto"}
            />
            <InlineError error={fieldErrors.totalLobbies} />
          </div>
        </div>

        {/* Distribution preview */}
        {totalTeams > 0 && brConfig.teamsPerLobby > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {totalTeams} {t("teamsCount") || "teams"} / {brConfig.teamsPerLobby} {t("perLobby") || "per lobby"} = {lobbyCount} {t("lobbies") || "lobbies"}
          </p>
        )}
      </div>

      {/* Elimination Rules */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-muted-foreground">
            {t("eliminationRules") || "Elimination Rules"}
          </label>
          <button
            type="button"
            onClick={addRule}
            className="flex items-center gap-1 text-xs text-green-primary hover:text-green-primary/80 font-medium"
          >
            <Plus className="size-3" />
            {t("addRule") || "Add Rule"}
          </button>
        </div>
        {brConfig.eliminationRules.length === 0 && (
          <p className="text-xs text-muted-foreground/70 italic">
            {t("noEliminationRules") ||
              "No elimination rules. All teams play every round."}
          </p>
        )}
        <div className="space-y-2">
          {brConfig.eliminationRules.map((rule, ruleIndex) => (
            <div
              key={ruleIndex}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("afterRound") || "After Round"}
                </label>
                <input
                  type="number"
                  min="1"
                  max={brConfig.totalRounds}
                  value={rule.afterRound}
                  onChange={(e) =>
                    updateRule(ruleIndex, "afterRound", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("eliminateBottom") || "Eliminate Bottom"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={rule.eliminateBottom}
                  onChange={(e) =>
                    updateRule(ruleIndex, "eliminateBottom", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRule(ruleIndex)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors mt-4"
              >
                <Trash2 className="size-4" />
              </button>
              {/* Per-rule errors */}
              {ruleErrors[ruleIndex]?.length > 0 && (
                <div className="col-span-full">
                  {ruleErrors[ruleIndex].map((err, i) => (
                    <InlineError key={i} error={err} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Elimination impact */}
        {brConfig.eliminationRules.length > 0 && totalTeams > 0 && (
          <p className={`text-xs mt-2 ${
            totalEliminated >= totalTeams - 1 ? "text-red-500" : "text-muted-foreground"
          }`}>
            {t("eliminationImpact") || "After all rules"}: {Math.max(0, totalTeams - totalEliminated)} {t("teamsRemain") || "teams remain"}
          </p>
        )}
        <InlineError
          error={
            totalTeams > 0 && totalEliminated >= totalTeams - 1
              ? (t("tooManyEliminated") || "Elimination rules would remove too many teams (must keep at least 2)")
              : null
          }
        />
        <p className="text-xs text-muted-foreground mt-2">
          {t("brConfigDesc") ||
            "Multi-participant lobbies each round. Configure elimination rules to narrow the field."}
        </p>
      </div>
    </div>
  );
}

export default BattleRoyaleConfig;

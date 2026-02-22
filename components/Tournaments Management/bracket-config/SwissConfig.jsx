"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import InlineError from "../shared/InlineError";
import HelpTooltip from "../shared/HelpTooltip";
import SwissWizard from "./SwissWizard";

const SWISS_PRESETS = [
  { labelKey: "presetCS2Major", fallback: "CS2 Major", totalRounds: 5, winsToQualify: 3, lossesToEliminate: 3 },
  { labelKey: "presetValorant", fallback: "Valorant", totalRounds: 4, winsToQualify: 3, lossesToEliminate: 2 },
  { labelKey: "presetSmall", fallback: "Small", totalRounds: 3, winsToQualify: 2, lossesToEliminate: 2 },
];

function SwissConfig({ config, onConfigChange, teamCount = 0 }) {
  const t = useTranslations("TournamentDetails");
  const [mode, setMode] = useState("guided"); // "guided" | "manual"

  const {
    bestOf = 3,
    swissConfig = { totalRounds: 5, winsToQualify: 3, lossesToEliminate: 3 },
  } = config;

  const updateSwiss = (field, value) => {
    const parsed = parseInt(value);
    if (isNaN(parsed) || parsed < 1) return;
    onConfigChange({
      swissConfig: { ...swissConfig, [field]: Math.min(parsed, 20) },
    });
  };

  const applyPreset = (preset) => {
    onConfigChange({
      swissConfig: {
        totalRounds: preset.totalRounds,
        winsToQualify: preset.winsToQualify,
        lossesToEliminate: preset.lossesToEliminate,
      },
    });
  };

  const isPresetActive = (preset) =>
    swissConfig.totalRounds === preset.totalRounds &&
    swissConfig.winsToQualify === preset.winsToQualify &&
    swissConfig.lossesToEliminate === preset.lossesToEliminate;

  // --- Validation ---
  const fieldErrors = useMemo(() => {
    const errors = {};
    const { totalRounds, winsToQualify, lossesToEliminate } = swissConfig;
    if (totalRounds < 1 || totalRounds > 20) errors.totalRounds = t("totalRoundsRange") || "Must be 1-20";
    if (winsToQualify < 1 || winsToQualify > 20) errors.winsToQualify = t("fieldRange") || "Must be 1-20";
    if (lossesToEliminate < 1 || lossesToEliminate > 20) errors.lossesToEliminate = t("fieldRange") || "Must be 1-20";
    if (winsToQualify > totalRounds) errors.winsToQualify = t("winsExceedRounds") || "Cannot exceed total rounds";
    if (lossesToEliminate > totalRounds) errors.lossesToEliminate = t("lossesExceedRounds") || "Cannot exceed total rounds";
    if (winsToQualify + lossesToEliminate > totalRounds + 1) {
      errors.cross = t("swissCrossValidation") || `With ${totalRounds} rounds, wins (${winsToQualify}) + losses (${lossesToEliminate}) may be unreachable`;
    }
    return errors;
  }, [swissConfig, t]);

  return (
    <div className="space-y-4">
      {/* Best Of */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("defaultBestOf") || "Default Best Of"}
        </label>
        <div className="flex gap-2">
          {[1, 3, 5, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onConfigChange({ bestOf: n })}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                bestOf === n
                  ? "border-green-primary bg-green-primary/10 text-green-primary"
                  : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
              }`}
            >
              Bo{n}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle: Guided / Manual */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 w-fit">
        <button
          type="button"
          onClick={() => setMode("guided")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "guided"
              ? "bg-green-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("guidedSetup") || "Guided"}
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "manual"
              ? "bg-green-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("manualSetup") || "Manual"}
        </button>
      </div>

      {mode === "guided" ? (
        <SwissWizard
          swissConfig={swissConfig}
          teamCount={teamCount}
          onConfigChange={onConfigChange}
        />
      ) : (
        <>
          {/* Swiss Presets */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("swissPresets") || "Quick Presets"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {SWISS_PRESETS.map((preset) => (
                <button
                  key={preset.labelKey}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isPresetActive(preset)
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                  }`}
                >
                  {t(preset.labelKey) || preset.fallback} ({preset.totalRounds}-{preset.winsToQualify}-{preset.lossesToEliminate})
                </button>
              ))}
            </div>
          </div>

          {/* Swiss Configuration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              {t("swissConfiguration") || "Swiss Configuration"}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  {t("totalRounds") || "Total Rounds"}
                  <HelpTooltip text={t("totalRoundsHelp") || "Number of Swiss rounds. Each round pairs teams with similar win/loss records against each other."} />
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={swissConfig.totalRounds}
                  onChange={(e) => updateSwiss("totalRounds", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground text-sm ${
                    fieldErrors.totalRounds ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <InlineError error={fieldErrors.totalRounds} />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  {t("winsToQualify") || "Wins to Qualify"}
                  <HelpTooltip text={t("winsToQualifyHelp") || "A team that reaches this many wins advances to the next stage, regardless of remaining rounds."} />
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={swissConfig.winsToQualify}
                  onChange={(e) => updateSwiss("winsToQualify", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground text-sm ${
                    fieldErrors.winsToQualify ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <InlineError error={fieldErrors.winsToQualify} />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  {t("lossesToEliminate") || "Losses to Eliminate"}
                  <HelpTooltip text={t("lossesToEliminateHelp") || "A team that reaches this many losses is eliminated from the tournament."} />
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={swissConfig.lossesToEliminate}
                  onChange={(e) => updateSwiss("lossesToEliminate", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground text-sm ${
                    fieldErrors.lossesToEliminate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <InlineError error={fieldErrors.lossesToEliminate} />
              </div>
            </div>
            <InlineError error={fieldErrors.cross} />
            <p className="text-xs text-muted-foreground mt-2">
              {t("swissConfigDesc") ||
                "Teams paired by record each round. Configure thresholds for qualification and elimination."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SwissConfig;

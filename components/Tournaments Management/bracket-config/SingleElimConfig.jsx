"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import HelpTooltip from "../shared/HelpTooltip";

function SingleElimConfig({ config, onConfigChange, availableRounds }) {
  const t = useTranslations("TournamentDetails");
  const [showAdvancedBestOf, setShowAdvancedBestOf] = useState(false);

  const { bestOf = 3, autoAdvance = true, bestOfPerRound = [] } = config;

  const handleBestOfChange = (stage, round, value) => {
    const exists = bestOfPerRound.find(
      (b) => b.stage === stage && b.round === round
    );
    let updated;
    if (exists) {
      updated = bestOfPerRound.map((b) =>
        b.stage === stage && b.round === round ? { ...b, bestOf: value } : b
      );
    } else {
      updated = [...bestOfPerRound, { stage, round, bestOf: value }];
    }
    onConfigChange({ bestOfPerRound: updated });
  };

  const removeBestOfOverride = (stage, round) => {
    onConfigChange({
      bestOfPerRound: bestOfPerRound.filter(
        (b) => !(b.stage === stage && b.round === round)
      ),
    });
  };

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

      {/* Advanced Best-of Per Round */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvancedBestOf(!showAdvancedBestOf)}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-green-primary transition-colors"
        >
          <ChevronDown
            className={`size-4 transition-transform ${
              showAdvancedBestOf ? "rotate-180" : ""
            }`}
          />
          {t("advancedBestOf") || "Advanced Best-of Settings"}
        </button>

        {showAdvancedBestOf && (
          <div className="mt-4 p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-xs text-muted-foreground mb-3">
              {t("advancedBestOfDesc") ||
                "Override best-of for specific rounds. Unset rounds use the default."}
            </p>
            {(availableRounds || []).map(({ stage, round, label }) => {
              const override = bestOfPerRound.find(
                (b) => b.stage === stage && b.round === round
              );
              return (
                <div
                  key={`${stage}-${round}`}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-foreground w-32 flex-shrink-0">
                    {label}
                  </span>
                  <div className="flex gap-2 flex-1">
                    {[1, 3, 5, 7].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleBestOfChange(stage, round, n)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          override?.bestOf === n
                            ? "border-green-primary bg-green-primary/10 text-green-primary"
                            : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                        }`}
                      >
                        Bo{n}
                      </button>
                    ))}
                  </div>
                  {override && (
                    <button
                      type="button"
                      onClick={() => removeBestOfOverride(stage, round)}
                      className="px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto Advance */}
      <div className="flex items-center justify-between">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-foreground">
            {t("autoAdvance") || "Auto-Advance Winners"}
            <HelpTooltip text={t("autoAdvanceHelp") || "When enabled, match winners are automatically placed into the next round. When disabled, you must manually advance teams after each match."} />
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("autoAdvanceDesc") ||
              "Automatically move winners to the next round"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onConfigChange({ autoAdvance: !autoAdvance })}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            autoAdvance ? "bg-green-primary" : "bg-gray-400"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              autoAdvance ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default SingleElimConfig;

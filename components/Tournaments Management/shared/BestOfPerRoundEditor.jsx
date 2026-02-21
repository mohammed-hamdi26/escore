"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import BestOfSelector from "./BestOfSelector";

function BestOfPerRoundEditor({
  bestOfPerRound = [],
  onChange,
  availableRounds = [],
}) {
  const t = useTranslations("TournamentDetails");
  const [expanded, setExpanded] = useState(false);

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
    onChange(updated);
  };

  const removeOverride = (stage, round) => {
    onChange(
      bestOfPerRound.filter((b) => !(b.stage === stage && b.round === round))
    );
  };

  if (availableRounds.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-green-primary transition-colors"
      >
        <ChevronDown
          className={`size-4 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
        {t("advancedBestOf") || "Advanced Best-of Settings"}
      </button>

      {expanded && (
        <div className="mt-4 p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700 space-y-3">
          <p className="text-xs text-muted-foreground mb-3">
            {t("advancedBestOfDesc") ||
              "Override best-of for specific rounds. Unset rounds use the default."}
          </p>
          {availableRounds.map(({ stage, round, label }) => {
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
                <div className="flex-1">
                  <BestOfSelector
                    value={override?.bestOf}
                    onChange={(val) => handleBestOfChange(stage, round, val)}
                    size="sm"
                  />
                </div>
                {override && (
                  <button
                    type="button"
                    onClick={() => removeOverride(stage, round)}
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
  );
}

export default BestOfPerRoundEditor;

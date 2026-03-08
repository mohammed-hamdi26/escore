"use client";

import { useTranslations } from "next-intl";
import HelpTooltip from "../shared/HelpTooltip";

function CustomBracketConfig({ config, onConfigChange }) {
  const t = useTranslations("TournamentDetails");

  const { customRounds = 1, customBestOf = 1 } = config;

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
          {t("numberOfRounds") || "Number of Rounds"}
          <HelpTooltip text={t("customRoundsHint") || "How many rounds to create. Each round starts with one empty match. You can add more matches to each round after generating."} />
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={customRounds}
          onChange={(e) =>
            onConfigChange({
              customRounds: Math.max(
                1,
                Math.min(20, parseInt(e.target.value) || 1)
              ),
            })
          }
          className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
        />
      </div>
      <div>
        <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
          {t("defaultBestOf") || "Default Best Of"}
          <HelpTooltip text={t("bestOfHint") || "The number of games in a match series. Bo1 = single game, Bo3 = best of 3 (first to 2 wins), Bo5 = best of 5 (first to 3 wins)."} />
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 5, 7, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onConfigChange({ customBestOf: n })}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                customBestOf === n
                  ? "border-green-primary bg-green-primary/10 text-green-primary"
                  : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
              }`}
            >
              Bo{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomBracketConfig;

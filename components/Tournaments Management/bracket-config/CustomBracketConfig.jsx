"use client";

import { useTranslations } from "next-intl";

function CustomBracketConfig({ config, onConfigChange }) {
  const t = useTranslations("TournamentDetails");

  const { customRounds = 1, customBestOf = 1 } = config;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("numberOfRounds") || "Number of Rounds"}
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
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("defaultBestOf") || "Default Best Of"}
        </label>
        <div className="flex gap-2">
          {[1, 3, 5, 7].map((n) => (
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

"use client";

import { useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Layers } from "lucide-react";

const BRACKET_TYPES = [
  {
    value: "single_elimination",
    labelKey: "singleElimination",
    descKey: "singleEliminationDesc",
    fallbackLabel: "Single Elimination",
    fallbackDesc: "Lose once and you're out",
  },
  {
    value: "double_elimination",
    labelKey: "doubleElimination",
    descKey: "doubleEliminationDesc",
    fallbackLabel: "Double Elimination",
    fallbackDesc: "Lose twice to be eliminated",
  },
  {
    value: "round_robin",
    labelKey: "roundRobin",
    descKey: "roundRobinDesc",
    fallbackLabel: "Round Robin",
    fallbackDesc: "Everyone plays everyone",
  },
  {
    value: "swiss",
    labelKey: "swissSystem",
    descKey: "swissSystemDesc",
    fallbackLabel: "Swiss System",
    fallbackDesc: "Pairing based on performance",
  },
  {
    value: "battle_royale",
    labelKey: "battleRoyaleBracket",
    descKey: "battleRoyaleDesc",
    fallbackLabel: "Battle Royale",
    fallbackDesc: "Multi-participant lobbies with elimination rounds",
  },
  {
    value: "custom",
    labelKey: "customBracket",
    descKey: "customBracketDesc",
    fallbackLabel: "Custom",
    fallbackDesc: "Fully manual bracket with free structure",
  },
];

function BracketTypeSelector({
  selectedType,
  onTypeChange,
  isMultiStage,
  onMultiStageChange,
}) {
  const t = useTranslations("TournamentDetails");
  const gridRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    const currentIndex = BRACKET_TYPES.findIndex((bt) => bt.value === selectedType);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % BRACKET_TYPES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + BRACKET_TYPES.length) % BRACKET_TYPES.length;
    } else {
      return;
    }

    onTypeChange(BRACKET_TYPES[nextIndex].value);
    // Focus the newly selected button
    const buttons = gridRef.current?.querySelectorAll('[role="radio"]');
    if (buttons?.[nextIndex]) buttons[nextIndex].focus();
  }, [selectedType, onTypeChange]);

  return (
    <div className="space-y-4">
      {/* Multi-Stage Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Layers className="size-5 text-green-primary" />
          <div>
            <label className="block text-sm font-medium text-foreground">
              {t("multiStage") || "Multi-Stage Tournament"}
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("multiStageDesc") ||
                "Group Stage → Knockout (like FIFA World Cup)"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onMultiStageChange(!isMultiStage)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isMultiStage ? "bg-green-primary" : "bg-gray-400"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              isMultiStage ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Bracket Type Grid — only show when NOT multi-stage */}
      {!isMultiStage && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("bracketType") || "Bracket Type"}
          </label>
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            role="radiogroup"
            aria-label={t("bracketType") || "Bracket type selection"}
            onKeyDown={handleKeyDown}
          >
            {BRACKET_TYPES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selectedType === opt.value}
                aria-label={t(opt.labelKey) || opt.fallbackLabel}
                tabIndex={selectedType === opt.value ? 0 : -1}
                onClick={() => onTypeChange(opt.value)}
                className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 outline-none ${
                  selectedType === opt.value
                    ? "border-green-primary bg-green-primary/10 text-green-primary"
                    : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50 active:bg-muted"
                }`}
              >
                <div className="font-medium text-sm">
                  {t(opt.labelKey) || opt.fallbackLabel}
                </div>
                <div className="text-xs mt-1 opacity-70 line-clamp-2 sm:line-clamp-none">
                  {t(opt.descKey) || opt.fallbackDesc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BracketTypeSelector;

"use client";

import { useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Layers } from "lucide-react";

// Mini SVG bracket diagrams for visual hint
const BracketIcon = ({ type, isActive }) => {
  const color = isActive ? "currentColor" : "currentColor";
  const common = { width: 32, height: 24, viewBox: "0 0 32 24", fill: "none", className: "opacity-60" };

  switch (type) {
    case "single_elimination":
      return (
        <svg {...common}>
          <line x1="2" y1="4" x2="10" y2="4" stroke={color} strokeWidth="1.5" />
          <line x1="2" y1="12" x2="10" y2="12" stroke={color} strokeWidth="1.5" />
          <line x1="10" y1="4" x2="10" y2="12" stroke={color} strokeWidth="1.5" />
          <line x1="10" y1="8" x2="20" y2="8" stroke={color} strokeWidth="1.5" />
          <line x1="2" y1="16" x2="10" y2="16" stroke={color} strokeWidth="1.5" />
          <line x1="2" y1="20" x2="10" y2="20" stroke={color} strokeWidth="1.5" />
          <line x1="10" y1="16" x2="10" y2="20" stroke={color} strokeWidth="1.5" />
          <line x1="10" y1="18" x2="20" y2="18" stroke={color} strokeWidth="1.5" />
          <line x1="20" y1="8" x2="20" y2="18" stroke={color} strokeWidth="1.5" />
          <line x1="20" y1="13" x2="30" y2="13" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "double_elimination":
      return (
        <svg {...common}>
          <line x1="2" y1="3" x2="8" y2="3" stroke={color} strokeWidth="1.5" />
          <line x1="2" y1="7" x2="8" y2="7" stroke={color} strokeWidth="1.5" />
          <line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth="1.5" />
          <line x1="8" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1.5" />
          <line x1="16" y1="5" x2="16" y2="9" stroke={color} strokeWidth="1.5" />
          <line x1="16" y1="9" x2="30" y2="9" stroke={color} strokeWidth="1.5" />
          <line x1="2" y1="15" x2="8" y2="15" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <line x1="2" y1="19" x2="8" y2="19" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <line x1="8" y1="15" x2="8" y2="19" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <line x1="8" y1="17" x2="16" y2="17" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <text x="1" y="23" fontSize="5" fill={color} opacity="0.4">L</text>
        </svg>
      );
    case "round_robin":
      return (
        <svg {...common}>
          <circle cx="16" cy="12" r="8" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="16" cy="4" r="1.5" fill={color} />
          <circle cx="23" cy="9" r="1.5" fill={color} />
          <circle cx="21" cy="18" r="1.5" fill={color} />
          <circle cx="11" cy="18" r="1.5" fill={color} />
          <circle cx="9" cy="9" r="1.5" fill={color} />
        </svg>
      );
    case "swiss":
      return (
        <svg {...common}>
          {[4, 10, 16].map((y, i) => (
            <g key={i}>
              <rect x="2" y={y} width="12" height="3" rx="1" stroke={color} strokeWidth="1" fill="none" />
              <rect x="18" y={y} width="12" height="3" rx="1" stroke={color} strokeWidth="1" fill="none" />
              <line x1="14" y1={y + 1.5} x2="18" y2={y + 1.5} stroke={color} strokeWidth="1" strokeDasharray="1 1" />
            </g>
          ))}
        </svg>
      );
    case "battle_royale":
      return (
        <svg {...common}>
          {[3, 8, 13, 18].map((y, i) => (
            <rect key={i} x={4 + i * 2} y={y} width={24 - i * 4} height="2.5" rx="1" stroke={color} strokeWidth="1" fill="none" opacity={1 - i * 0.15} />
          ))}
        </svg>
      );
    case "custom":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="26" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
          <line x1="9" y1="8" x2="23" y2="8" stroke={color} strokeWidth="1" />
          <line x1="9" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1" />
          <line x1="9" y1="16" x2="18" y2="16" stroke={color} strokeWidth="1" />
        </svg>
      );
    default:
      return null;
  }
};

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
                "Group Stage \u2192 Knockout (like FIFA World Cup)"}
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

      {/* Bracket Type Grid */}
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
            {BRACKET_TYPES.map((opt) => {
              const isActive = selectedType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={t(opt.labelKey) || opt.fallbackLabel}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onTypeChange(opt.value)}
                  className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 outline-none ${
                    isActive
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50 active:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-sm">
                      {t(opt.labelKey) || opt.fallbackLabel}
                    </div>
                    <BracketIcon type={opt.value} isActive={isActive} />
                  </div>
                  <div className="text-xs opacity-70 line-clamp-2 sm:line-clamp-none">
                    {t(opt.descKey) || opt.fallbackDesc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default BracketTypeSelector;

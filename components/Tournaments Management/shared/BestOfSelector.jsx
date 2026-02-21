"use client";

import { useTranslations } from "next-intl";

const BEST_OF_OPTIONS = [1, 3, 5, 7];

function BestOfSelector({
  value,
  onChange,
  options = BEST_OF_OPTIONS,
  label,
  size = "default",
  disabled = false,
}) {
  const t = useTranslations("TournamentDetails");

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs"
      : "px-4 py-2 text-sm";

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            disabled={disabled}
            className={`${sizeClasses} rounded-lg border font-medium transition-all ${
              value === n
                ? "border-green-primary bg-green-primary/10 text-green-primary"
                : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Bo{n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BestOfSelector;

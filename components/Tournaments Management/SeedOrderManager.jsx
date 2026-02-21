"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, GripVertical, Trophy } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import InlineError from "./shared/InlineError";

function SeedOrderManager({ seeds, onSeedsChange, participationType, minSeeds = 2 }) {
  const t = useTranslations("TournamentDetails");
  const isPlayerBased = participationType === "player";
  const seedCount = seeds.length;
  const isValid = seedCount >= minSeeds;
  const label = isPlayerBased ? (t("playersCount") || "Players") : (t("teamsCount") || "Teams");

  const moveSeed = (index, direction) => {
    const newSeeds = [...seeds];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSeeds.length) return;
    [newSeeds[index], newSeeds[targetIndex]] = [
      newSeeds[targetIndex],
      newSeeds[index],
    ];
    onSeedsChange(newSeeds);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {t("seedOrder") || "Seed Order"}
      </label>
      <p className="text-xs text-muted-foreground mb-3">
        {t("seedOrderDesc") || "Drag to reorder. Seed #1 is the top seed."}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            isValid
              ? "bg-green-primary/10 text-green-primary"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {seedCount} {label}
        </span>
        {!isValid && (
          <span className="text-xs text-muted-foreground">
            ({t("minimumRequired") || "minimum"}: {minSeeds})
          </span>
        )}
      </div>
      <InlineError
        error={
          !isValid
            ? (t("seedCountError") || `At least ${minSeeds} ${label.toLowerCase()} required. Currently: ${seedCount}`)
            : null
        }
      />
      <div className="space-y-2 max-h-[400px] overflow-y-auto" role="list" aria-label={t("seedOrder") || "Seed order"}>
        {seeds.map((team, index) => (
          <div
            key={team.id}
            role="listitem"
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-transparent hover:border-green-primary/20 active:bg-muted/50 transition-colors"
          >
            <span className="text-xs font-bold text-green-primary w-6 text-center">
              #{index + 1}
            </span>
            <GripVertical className="size-4 text-muted-foreground" />
            {team.logo?.light ? (
              <img
                src={getImgUrl(team.logo.light, "thumbnail")}
                alt={team.name}
                className="size-6 rounded object-cover"
              />
            ) : (
              <div className="size-6 rounded bg-muted flex items-center justify-center">
                <Trophy className="size-3 text-muted-foreground" />
              </div>
            )}
            <span className="text-sm font-medium text-foreground flex-1 truncate">
              {team.name}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveSeed(index, -1)}
                disabled={index === 0}
                className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 rounded hover:bg-muted disabled:opacity-30 transition-colors flex items-center justify-center"
                aria-label={`Move ${team.name} up to seed ${index}`}
              >
                <ChevronDown className="size-4 text-muted-foreground rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => moveSeed(index, 1)}
                disabled={index === seeds.length - 1}
                className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 rounded hover:bg-muted disabled:opacity-30 transition-colors flex items-center justify-center"
                aria-label={`Move ${team.name} down to seed ${index + 2}`}
              >
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeedOrderManager;

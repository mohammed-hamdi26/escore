"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// Preset scoring tables
const PRESETS = {
  algs: {
    label: "ALGS (Apex)",
    killPoints: 1,
    placementPoints: [
      { place: 1, points: 12 },
      { place: 2, points: 9 },
      { place: 3, points: 7 },
      { place: 4, points: 5 },
      { place: 5, points: 4 },
      { place: 6, points: 3 },
      { place: 7, points: 3 },
      { place: 8, points: 3 },
      { place: 9, points: 3 },
      { place: 10, points: 3 },
      { place: 11, points: 1 },
      { place: 12, points: 1 },
      { place: 13, points: 1 },
      { place: 14, points: 1 },
      { place: 15, points: 1 },
      { place: 16, points: 0 },
      { place: 17, points: 0 },
      { place: 18, points: 0 },
      { place: 19, points: 0 },
      { place: 20, points: 0 },
    ],
  },
  pubg: {
    label: "PUBG",
    killPoints: 1,
    placementPoints: [
      { place: 1, points: 10 },
      { place: 2, points: 6 },
      { place: 3, points: 5 },
      { place: 4, points: 4 },
      { place: 5, points: 3 },
      { place: 6, points: 2 },
      { place: 7, points: 1 },
      { place: 8, points: 1 },
      { place: 9, points: 0 },
      { place: 10, points: 0 },
      { place: 11, points: 0 },
      { place: 12, points: 0 },
      { place: 13, points: 0 },
      { place: 14, points: 0 },
      { place: 15, points: 0 },
      { place: 16, points: 0 },
    ],
  },
  f1: {
    label: "F1 Racing",
    killPoints: 0,
    placementPoints: [
      { place: 1, points: 25 },
      { place: 2, points: 18 },
      { place: 3, points: 15 },
      { place: 4, points: 12 },
      { place: 5, points: 10 },
      { place: 6, points: 8 },
      { place: 7, points: 6 },
      { place: 8, points: 4 },
      { place: 9, points: 2 },
      { place: 10, points: 1 },
    ],
  },
};

export default function PlacementConfigEditor({ formik }) {
  const t = useTranslations("TournamentForm");
  const [presetOpen, setPresetOpen] = useState(false);

  const placementPoints = formik.values.placementConfig?.placementPoints || [];
  const killPoints = formik.values.placementConfig?.killPoints ?? 0;

  const updatePlacementPoints = (newPoints) => {
    formik.setFieldValue("placementConfig.placementPoints", newPoints);
  };

  const updateKillPoints = (value) => {
    formik.setFieldValue("placementConfig.killPoints", value);
  };

  const addRow = () => {
    const nextPlace = placementPoints.length + 1;
    updatePlacementPoints([...placementPoints, { place: nextPlace, points: 0 }]);
  };

  const removeRow = (index) => {
    const updated = placementPoints
      .filter((_, i) => i !== index)
      .map((entry, i) => ({ ...entry, place: i + 1 }));
    updatePlacementPoints(updated);
  };

  const updatePoints = (index, value) => {
    const updated = [...placementPoints];
    updated[index] = { ...updated[index], points: parseFloat(value) || 0 };
    updatePlacementPoints(updated);
  };

  const loadPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    formik.setFieldValue("placementConfig", {
      placementPoints: [...preset.placementPoints],
      killPoints: preset.killPoints,
    });
    setPresetOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Preset Loader */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {t("Placement Points Table")}
        </label>
        <Popover open={presetOpen} onOpenChange={setPresetOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600 text-muted-foreground hover:text-foreground hover:border-green-primary/50 transition-colors"
            >
              {t("Load Preset")}
              <ChevronDown className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1.5 bg-background dark:bg-[#12141c] border-border" align="end">
            <div className="space-y-0.5">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => loadPreset(key)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Placement Points Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[60px_1fr_40px] gap-2 px-4 py-2.5 bg-muted/50 dark:bg-[#1a1d2e] border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-muted-foreground">{t("Place")}</span>
          <span className="text-xs font-medium text-muted-foreground">{t("Points")}</span>
          <span />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {placementPoints.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-[60px_1fr_40px] gap-2 px-4 py-2 items-center"
            >
              <span className="text-sm font-medium text-foreground">
                #{entry.place}
              </span>
              <input
                type="number"
                min="0"
                value={entry.points}
                onChange={(e) => updatePoints(index, e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm focus:outline-none focus:border-green-primary"
              />
              {placementPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Row */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 text-xs font-medium text-green-primary hover:text-green-primary/80 transition-colors"
          >
            <Plus className="size-3.5" />
            {t("Add Place")}
          </button>
        </div>
      </div>

      {/* Kill Points */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {t("Points per Kill")}
        </label>
        <input
          type="number"
          min="0"
          value={killPoints}
          onChange={(e) => updateKillPoints(parseFloat(e.target.value) || 0)}
          className="w-full max-w-[200px] px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm focus:outline-none focus:border-green-primary"
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t("Points awarded for each kill/elimination")}
        </p>
      </div>
    </div>
  );
}

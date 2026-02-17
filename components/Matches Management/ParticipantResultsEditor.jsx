"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Save,
  Loader2,
  ArrowUpDown,
  Calculator,
  Skull,
} from "lucide-react";
import { updateParticipantResults } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function ParticipantResultsEditor({ match, tournament, onSaved }) {
  const t = useTranslations("MatchDetails");

  const initialRows = useMemo(() => {
    return (match.participants || []).map((p, i) => {
      const entity = p.team || p.player;
      return {
        teamId: p.team?.id || p.team?._id || null,
        playerId: p.player?.id || p.player?._id || null,
        name: entity?.name || entity?.nickname || "Unknown",
        logo: entity?.logo || entity?.photo,
        placement: p.placement || i + 1,
        kills: p.kills ?? 0,
        deaths: p.deaths ?? 0,
        assists: p.assists ?? 0,
        points: p.points ?? 0,
        isEliminated: p.isEliminated || false,
      };
    });
  }, [match.participants]);

  const [rows, setRows] = useState(initialRows);
  const [saving, setSaving] = useState(false);

  const placementConfig = tournament?.standingConfig?.placementConfig;

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    );
  };

  // Task 3.4.2 — Sort by placement
  const handleSortByPlacement = () => {
    setRows((prev) =>
      [...prev].sort((a, b) => (a.placement || 999) - (b.placement || 999))
    );
  };

  // Task 3.4.2 — Auto-assign placements based on current row order
  const handleAutoAssignPlacements = () => {
    setRows((prev) =>
      prev.map((r, i) => ({ ...r, placement: i + 1 }))
    );
  };

  // Task 3.4.3 — Auto-calculate points from placementConfig
  const handleAutoCalculatePoints = () => {
    if (!placementConfig) return;

    const placementPoints = placementConfig.placementPoints || [];
    const killPoints = placementConfig.killPoints || 0;

    setRows((prev) =>
      prev.map((r) => {
        const ppEntry = placementPoints.find(
          (pp) => pp.place === r.placement
        );
        const pp = ppEntry?.points || 0;
        const kp = (r.kills || 0) * killPoints;
        return { ...r, points: pp + kp };
      })
    );
    toast.success(t("pointsCalculated") || "Points calculated from config");
  };

  // Check for duplicate placements
  const duplicatePlacements = useMemo(() => {
    const counts = {};
    rows.forEach((r) => {
      counts[r.placement] = (counts[r.placement] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([, c]) => c > 1)
      .map(([p]) => parseInt(p));
  }, [rows]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = rows.map((r) => ({
        ...(r.teamId ? { team: r.teamId } : {}),
        ...(r.playerId ? { player: r.playerId } : {}),
        placement: r.placement,
        kills: r.kills,
        deaths: r.deaths,
        assists: r.assists,
        points: r.points,
        isEliminated: r.isEliminated,
      }));

      const result = await updateParticipantResults(
        match.id || match._id,
        payload
      );

      if (result.success) {
        toast.success(t("resultsSaved") || "Results saved successfully");
        onSaved?.();
      } else {
        toast.error(result.error || t("errorSavingResults") || "Error saving results");
      }
    } catch (e) {
      toast.error(e.message || t("errorSavingResults") || "Error saving results");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortByPlacement}
          className="gap-1 text-xs"
        >
          <ArrowUpDown className="size-3.5" />
          {t("sortByPlacement") || "Sort by Placement"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoAssignPlacements}
          className="gap-1 text-xs"
        >
          <Trophy className="size-3.5" />
          {t("autoAssignPlacements") || "Auto-assign Placements"}
        </Button>
        {placementConfig && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoCalculatePoints}
            className="gap-1 text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
          >
            <Calculator className="size-3.5" />
            {t("autoCalculatePoints") || "Auto-calculate Points"}
          </Button>
        )}
      </div>

      {/* Duplicate warning */}
      {duplicatePlacements.length > 0 && (
        <div className="text-xs text-amber-600 bg-amber-500/10 px-3 py-2 rounded-lg">
          {t("duplicatePlacementWarning") || "Warning: Duplicate placements"}: {duplicatePlacements.join(", ")}
        </div>
      )}

      {/* Editable table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">
                {t("teamPlayer") || "Team / Player"}
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-2 w-20">
                {t("placementInput") || "Place"}
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-2 w-16">
                {t("killsCol") || "Kills"}
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-2 w-16">
                {t("deathsCol") || "Deaths"}
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-2 w-16">
                {t("assistsCol") || "Assists"}
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-2 w-20">
                {t("pointsCol") || "Points"}
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground px-2 py-2 w-20">
                <Skull className="size-3.5 mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.teamId || row.playerId || index}
                className={`border-b border-gray-100 dark:border-gray-800 ${
                  row.isEliminated ? "opacity-50" : ""
                }`}
              >
                {/* Team/Player (read-only) */}
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    {row.logo?.light ? (
                      <img
                        src={row.logo.light}
                        alt={row.name}
                        className="size-6 rounded object-cover"
                      />
                    ) : (
                      <div className="size-6 rounded bg-muted flex items-center justify-center">
                        <Trophy className="size-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                      {row.name}
                    </span>
                  </div>
                </td>

                {/* Placement */}
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="1"
                    value={row.placement}
                    onChange={(e) =>
                      updateRow(index, "placement", parseInt(e.target.value) || 1)
                    }
                    className={`w-full px-2 py-1 rounded text-center text-sm border bg-background text-foreground ${
                      duplicatePlacements.includes(row.placement)
                        ? "border-amber-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </td>

                {/* Kills */}
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    value={row.kills}
                    onChange={(e) =>
                      updateRow(index, "kills", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 rounded text-center text-sm border border-gray-300 dark:border-gray-600 bg-background text-foreground"
                  />
                </td>

                {/* Deaths */}
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    value={row.deaths}
                    onChange={(e) =>
                      updateRow(index, "deaths", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 rounded text-center text-sm border border-gray-300 dark:border-gray-600 bg-background text-foreground"
                  />
                </td>

                {/* Assists */}
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    value={row.assists}
                    onChange={(e) =>
                      updateRow(index, "assists", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 rounded text-center text-sm border border-gray-300 dark:border-gray-600 bg-background text-foreground"
                  />
                </td>

                {/* Points */}
                <td className="px-2 py-2">
                  <input
                    type="number"
                    value={row.points}
                    onChange={(e) =>
                      updateRow(index, "points", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 rounded text-center text-sm border border-gray-300 dark:border-gray-600 bg-background text-foreground font-semibold"
                  />
                </td>

                {/* Eliminated */}
                <td className="px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.isEliminated}
                    onChange={(e) =>
                      updateRow(index, "isEliminated", e.target.checked)
                    }
                    className="size-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("saving") || "Saving..."}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {t("saveResults") || "Save Results"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ParticipantResultsEditor;

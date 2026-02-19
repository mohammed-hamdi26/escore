"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  Trophy,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Pencil,
  Save,
  X,
  Plus,
  Users,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  User,
  Target,
  ChevronDown,
  ChevronUp,
  Timer,
  ArrowUpDown,
} from "lucide-react";
import {
  initializeStandings,
  updateStanding,
  recalculateStandings,
  recalculateStandingsFromMatches,
  recalculatePlacementStandings,
  deleteStanding,
  deleteAllStandings,
} from "@/app/[locale]/_Lib/actions";
import { TimeCell } from "@/components/ui/TimeInput";
import { formatTimeMs, formatPenalty } from "@/lib/timeUtils";
import { getImgUrl } from "@/lib/utils";

// Position styling
const getPositionStyle = (position, isQualified, isEliminated) => {
  if (position === 1)
    return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30";
  if (position === 2)
    return "bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500/30";
  if (position === 3)
    return "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-500/30";
  if (isQualified)
    return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30";
  if (isEliminated)
    return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30";
  return "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10";
};

// Last result badge
const getResultBadge = (result) => {
  switch (result) {
    case "W":
      return "bg-green-500 text-white";
    case "L":
      return "bg-red-500 text-white";
    case "D":
      return "bg-gray-400 text-white";
    default:
      return "bg-gray-300 text-gray-600";
  }
};

export default function StandingsManagement({ tournament, initialStandings }) {
  const t = useTranslations("StandingsManagement");
  const router = useRouter();
  const [standings, setStandings] = useState(initialStandings || []);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(null); // tracks which action is loading
  const [expandedId, setExpandedId] = useState(null); // for round history expansion

  const tournamentId = tournament?.id || tournament?._id;

  // Check if standings are "default" (virtual, not in DB)
  const isDefault =
    standings.length > 0 &&
    standings.every((s) => String(s.id).startsWith("default-"));

  const hasStandings = standings.length > 0 && !isDefault;

  // Standing config display
  const config = tournament?.standingConfig || {
    pointsPerWin: 3,
    pointsPerDraw: 1,
    pointsPerLoss: 0,
  };
  const isPlacement = config.scoringType === "placement";
  const isPlayerBased = tournament?.participationType === "player";
  const isRacing = tournament?.competitionType === "racing";

  // Racing sort state: { key, direction }
  const [racingSort, setRacingSort] = useState({ key: "position", direction: "asc" });

  const handleRacingSortToggle = (key) => {
    setRacingSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "points" ? "desc" : "asc" }
    );
  };

  // Sort standings for display
  const sortedStandings = React.useMemo(() => {
    if (!isRacing || racingSort.key === "position") return standings;

    return [...standings].sort((a, b) => {
      const dir = racingSort.direction === "asc" ? 1 : -1;
      const aVal = a[racingSort.key];
      const bVal = b[racingSort.key];

      // Nulls always go last
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      return (aVal - bVal) * dir;
    });
  }, [standings, racingSort, isRacing]);

  // === Actions ===

  const handleInitialize = async () => {
    setLoading("initialize");
    try {
      const result = await initializeStandings(tournamentId);
      if (result.success) {
        toast.success(t("initializeSuccess") || "Standings initialized");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to initialize standings");
      }
    } catch {
      toast.error("Failed to initialize standings");
    } finally {
      setLoading(null);
    }
  };

  const handleRecalculate = async () => {
    setLoading("recalculate");
    try {
      const result = await recalculateStandings(tournamentId);
      if (result.success) {
        toast.success(
          t("recalculateSuccess") || "Positions recalculated"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to recalculate");
      }
    } catch {
      toast.error("Failed to recalculate");
    } finally {
      setLoading(null);
    }
  };

  const handleRecalculateFromMatches = async () => {
    setLoading("recalculateMatches");
    try {
      const result = await recalculateStandingsFromMatches(tournamentId);
      if (result.success) {
        toast.success(
          t("recalculateFromMatchesSuccess") ||
            "Standings recalculated from matches"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to recalculate from matches");
      }
    } catch {
      toast.error("Failed to recalculate from matches");
    } finally {
      setLoading(null);
    }
  };

  const handleRecalculatePlacement = async () => {
    setLoading("recalculatePlacement");
    try {
      const result = await recalculatePlacementStandings(tournamentId);
      if (result.success) {
        toast.success(
          t("recalculatePlacementSuccess") ||
            "Placement standings recalculated"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to recalculate placement standings");
      }
    } catch {
      toast.error("Failed to recalculate placement standings");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        t("confirmDeleteAll") ||
          "Are you sure you want to delete all standings for this tournament?"
      )
    )
      return;

    setLoading("deleteAll");
    try {
      const result = await deleteAllStandings(tournamentId);
      if (result.success) {
        toast.success(t("deleteAllSuccess") || "All standings deleted");
        setStandings([]);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete standings");
      }
    } catch {
      toast.error("Failed to delete standings");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteSingle = async (standingId) => {
    if (
      !confirm(
        t("confirmDelete") || "Are you sure you want to delete this standing?"
      )
    )
      return;

    setLoading(standingId);
    try {
      const result = await deleteStanding(standingId);
      if (result.success) {
        setStandings((prev) => prev.filter((s) => s.id !== standingId));
        toast.success(t("deleteSuccess") || "Standing deleted");
      } else {
        toast.error(result.error || "Failed to delete standing");
      }
    } catch {
      toast.error("Failed to delete standing");
    } finally {
      setLoading(null);
    }
  };

  const handleEditStart = (standing) => {
    setEditingId(standing.id);
    setEditValues({
      position: standing.position || 1,
      matchesPlayed: standing.matchesPlayed || 0,
      wins: standing.wins || 0,
      draws: standing.draws || 0,
      losses: standing.losses || 0,
      points: standing.points || 0,
      pointsFor: standing.pointsFor || 0,
      pointsAgainst: standing.pointsAgainst || 0,
      isQualified: standing.isQualified || false,
      isEliminated: standing.isEliminated || false,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleEditSave = async () => {
    setLoading("save");
    try {
      const result = await updateStanding(editingId, editValues);
      if (result.success) {
        setStandings((prev) =>
          prev.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  ...editValues,
                  pointsDiff:
                    (editValues.pointsFor || 0) -
                    (editValues.pointsAgainst || 0),
                }
              : s
          )
        );
        setEditingId(null);
        setEditValues({});
        toast.success(t("updateSuccess") || "Standing updated");
      } else {
        toast.error(result.error || "Failed to update standing");
      }
    } catch {
      toast.error("Failed to update standing");
    } finally {
      setLoading(null);
    }
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/tournaments-management/view/${tournamentId}`}
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("title") || "Manage Standings"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tournament?.name}
            </p>
          </div>
        </div>

        {/* Standing Config Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-border">
          <Trophy className="size-4 text-green-primary" />
          {isRacing ? (
            <>
              <Timer className="size-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">
                {t("racingScoring") || "Racing / Time-Based"}
              </span>
            </>
          ) : isPlacement ? (
            <>
              <span className="text-sm font-medium text-amber-500">
                {t("placementScoring") || "Placement Scoring"}
              </span>
              {config.placementConfig?.killPoints > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{config.placementConfig.killPoints} {t("perKill") || "per kill"}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                {t("pointsSystem") || "Points"}:
              </span>
              <span className="text-sm font-medium text-green-500">
                W={config.pointsPerWin}
              </span>
              <span className="text-sm font-medium text-gray-500">
                D={config.pointsPerDraw}
              </span>
              <span className="text-sm font-medium text-red-500">
                L={config.pointsPerLoss}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {(!hasStandings || isDefault) && (
          <Button
            onClick={handleInitialize}
            disabled={loading === "initialize"}
            className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
          >
            {loading === "initialize" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {t("initialize") || "Initialize Standings"}
          </Button>
        )}

        {hasStandings && (
          <>
            <Button
              onClick={handleRecalculate}
              disabled={loading === "recalculate"}
              variant="outline"
              className="gap-2"
            >
              {loading === "recalculate" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              {t("recalculate") || "Recalculate Positions"}
            </Button>

            <Button
              onClick={handleRecalculateFromMatches}
              disabled={loading === "recalculateMatches"}
              variant="outline"
              className="gap-2"
            >
              {loading === "recalculateMatches" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trophy className="size-4" />
              )}
              {t("recalculateFromMatches") || "Recalculate from Matches"}
            </Button>

            {isPlacement && (
              <Button
                onClick={handleRecalculatePlacement}
                disabled={loading === "recalculatePlacement"}
                variant="outline"
                className="gap-2 border-amber-300 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                {loading === "recalculatePlacement" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Target className="size-4" />
                )}
                {t("recalculatePlacement") || "Recalculate Placement"}
              </Button>
            )}

            <Button
              onClick={handleDeleteAll}
              disabled={loading === "deleteAll"}
              variant="outline"
              className="gap-2 border-red-300 dark:border-red-500/30 text-red-500 hover:bg-red-500/10"
            >
              {loading === "deleteAll" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {t("deleteAll") || "Delete All"}
            </Button>
          </>
        )}
      </div>

      {/* Standings Table */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
        {/* Table Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <Trophy className="size-5 text-green-primary" />
            {t("standings") || "Standings"}
            <span className="text-sm font-normal text-muted-foreground">
              ({standings.length} {t("teams") || "teams"})
            </span>
          </h3>
        </div>

        {standings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="size-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">
              {t("noStandings") || "No standings yet"}
            </p>
            <p className="text-sm mt-1">
              {t("initializeDescription") ||
                "Initialize standings to create entries for all tournament teams"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/5">
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    {isPlayerBased ? (t("player") || "Player") : (t("team") || "Team")}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    {t("played") || "P"}
                  </th>
                  {isRacing ? (
                    <>
                      <RacingSortHeader sortKey="points" label={t("points") || "PTS"} currentSort={racingSort} onToggle={handleRacingSortToggle} />
                      <RacingSortHeader sortKey="bestFinishTimeMs" label={t("bestTime") || "Best Time"} title={t("bestFinishTime") || "Best Finish Time"} currentSort={racingSort} onToggle={handleRacingSortToggle} />
                      <RacingSortHeader sortKey="bestLapMs" label={t("bestLap") || "Best Lap"} title={t("bestLapTime") || "Best Lap Time"} currentSort={racingSort} onToggle={handleRacingSortToggle} />
                      <th className="px-4 py-3 text-center font-semibold hidden md:table-cell" title={t("totalPenalties") || "Total Penalties"}>
                        {t("penalties") || "Pen."}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold hidden md:table-cell" title={t("totalLapsCompleted") || "Total Laps"}>
                        {t("laps") || "Laps"}
                      </th>
                      <RacingSortHeader sortKey="dnfCount" label="DNF" title={t("didNotFinish") || "Did Not Finish"} currentSort={racingSort} onToggle={handleRacingSortToggle} />
                      <RacingSortHeader sortKey="dsqCount" label="DSQ" title={t("disqualified") || "Disqualified"} currentSort={racingSort} onToggle={handleRacingSortToggle} />
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("status") || "Status"}
                      </th>
                    </>
                  ) : isPlacement ? (
                    <>
                      <th className="px-4 py-3 text-center font-semibold" title={t("totalPoints") || "Total Points"}>
                        {t("points") || "PTS"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold" title={t("placementPoints") || "Placement Points"}>
                        PP
                      </th>
                      <th className="px-4 py-3 text-center font-semibold" title={t("killPoints") || "Kill Points"}>
                        KP
                      </th>
                      <th className="px-4 py-3 text-center font-semibold" title={t("totalKills") || "Total Kills"}>
                        {t("kills") || "Kills"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold hidden md:table-cell" title={t("averagePlacement") || "Average Placement"}>
                        {t("avgPlace") || "Avg"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold hidden md:table-cell" title={t("bestPlacement") || "Best Placement"}>
                        {t("best") || "Best"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("status") || "Status"}
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("wins") || "W"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("draws") || "D"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("losses") || "L"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("pf") || "PF"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("pa") || "PA"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("diff") || "+/-"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("points") || "PTS"}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        {t("form") || "Form"}
                      </th>
                    </>
                  )}
                  <th className="px-4 py-3 text-center font-semibold">
                    {t("actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {sortedStandings.map((standing) => {
                  const isEditing = editingId === standing.id;
                  const teamLogo = isPlayerBased
                    ? (getImgUrl(standing.player?.photo?.light, "thumbnail") || getImgUrl(standing.player?.photo?.dark, "thumbnail"))
                    : (getImgUrl(standing.team?.logo?.light, "thumbnail") || getImgUrl(standing.team?.logo?.dark, "thumbnail"));
                  const entityName = isPlayerBased
                    ? (standing.player?.nickname || standing.player?.name)
                    : standing.team?.name;
                  const positionStyle = getPositionStyle(
                    standing.position,
                    standing.isQualified,
                    standing.isEliminated
                  );
                  const isDefaultRow = String(standing.id).startsWith(
                    "default-"
                  );
                  const hasRoundHistory = (isPlacement || isRacing) && standing.roundHistory?.length > 0;
                  const isExpanded = expandedId === standing.id;
                  const bestRoundPoints = hasRoundHistory
                    ? Math.max(...standing.roundHistory.map((r) => r.totalRoundPoints || 0))
                    : 0;

                  return (
                    <React.Fragment key={standing.id}>
                    <tr
                      className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                        standing.isEliminated ? "opacity-60" : ""
                      } ${isEditing ? "bg-green-50/50 dark:bg-green-500/5" : ""} ${hasRoundHistory ? "cursor-pointer" : ""}`}
                      onClick={hasRoundHistory && !isEditing ? () => setExpandedId(isExpanded ? null : standing.id) : undefined}
                    >
                      {/* Position */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.position}
                            onChange={(e) =>
                              handleEditChange(
                                "position",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-14 h-8 text-center rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm focus:ring-2 focus:ring-green-primary/50"
                            min={1}
                          />
                        ) : (
                          <div className="flex items-center gap-1">
                            {hasRoundHistory && (
                              <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            )}
                            <span
                              className={`inline-flex items-center justify-center size-7 rounded-lg text-sm font-bold border ${positionStyle}`}
                            >
                              {standing.position}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Team / Player */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 ${isPlayerBased ? "rounded-full" : "rounded-lg"} bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0`}>
                            {teamLogo ? (
                              <img
                                src={teamLogo}
                                alt={entityName}
                                className="size-full object-cover"
                              />
                            ) : isPlayerBased ? (
                              <User className="size-4 text-gray-400 dark:text-gray-500" />
                            ) : (
                              <Users className="size-4 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {entityName || "-"}
                            </p>
                          </div>
                          {!isPlacement && !isRacing && standing.isQualified && (
                            <TrendingUp className="size-4 text-green-500 flex-shrink-0" />
                          )}
                          {!isPlacement && !isRacing && standing.isEliminated && (
                            <TrendingDown className="size-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </td>

                      {/* Stats columns */}
                      {/* Played (common) */}
                      {isEditing ? (
                        <EditCell
                          value={editValues.matchesPlayed}
                          onChange={(v) =>
                            handleEditChange("matchesPlayed", v)
                          }
                        />
                      ) : (
                        <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                          {standing.matchesPlayed || 0}
                        </td>
                      )}

                      {isRacing ? (
                        /* Racing columns */
                        <>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-bold text-sm">
                              {standing.points || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <TimeCell value={standing.bestFinishTimeMs} dnf={false} dsq={false} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <TimeCell value={standing.bestLapMs} />
                          </td>
                          <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400 hidden md:table-cell">
                            {standing.totalPenaltyMs ? (
                              <span className="text-sm font-mono">{formatPenalty(standing.totalPenaltyMs)}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 hidden md:table-cell">
                            {standing.totalLapsCompleted ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-medium ${(standing.dnfCount || 0) > 0 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                              {standing.dnfCount || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-medium ${(standing.dsqCount || 0) > 0 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                              {standing.dsqCount || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {standing.isEliminated ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                <TrendingDown className="size-3" />
                                {t("eliminated") || "Out"}
                              </span>
                            ) : standing.isQualified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                <TrendingUp className="size-3" />
                                {t("qualified") || "Qual"}
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">-</span>
                            )}
                          </td>
                        </>
                      ) : isPlacement ? (
                        /* Placement columns */
                        isEditing ? (
                          <>
                            <EditCell
                              value={editValues.points}
                              onChange={(v) => handleEditChange("points", v)}
                            />
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                              {standing.totalPlacementPoints || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                              {standing.totalKillPoints || 0}
                            </td>
                            <EditCell
                              value={editValues.totalKills ?? standing.totalKills ?? 0}
                              onChange={(v) => handleEditChange("totalKills", v)}
                            />
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground hidden md:table-cell">
                              {standing.averagePlacement ? standing.averagePlacement.toFixed(1) : "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground hidden md:table-cell">
                              {standing.bestPlacement || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {standing.isEliminated ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                  <TrendingDown className="size-3" />
                                  {t("eliminated") || "Out"}
                                </span>
                              ) : standing.isQualified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                  <TrendingUp className="size-3" />
                                  {t("qualified") || "Qual"}
                                </span>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-bold text-sm">
                                {standing.points || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400 font-medium">
                              {standing.totalPlacementPoints || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">
                              {standing.totalKillPoints || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                              {standing.totalKills || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 hidden md:table-cell">
                              {standing.averagePlacement ? standing.averagePlacement.toFixed(1) : "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 hidden md:table-cell">
                              {standing.bestPlacement || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {standing.isEliminated ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                  <TrendingDown className="size-3" />
                                  {t("eliminated") || "Out"}
                                </span>
                              ) : standing.isQualified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                  <TrendingUp className="size-3" />
                                  {t("qualified") || "Qual"}
                                </span>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </td>
                          </>
                        )
                      ) : (
                        /* Win/Loss columns */
                        isEditing ? (
                          <>
                            <EditCell
                              value={editValues.wins}
                              onChange={(v) => handleEditChange("wins", v)}
                            />
                            <EditCell
                              value={editValues.draws}
                              onChange={(v) => handleEditChange("draws", v)}
                            />
                            <EditCell
                              value={editValues.losses}
                              onChange={(v) => handleEditChange("losses", v)}
                            />
                            <EditCell
                              value={editValues.pointsFor}
                              onChange={(v) => handleEditChange("pointsFor", v)}
                            />
                            <EditCell
                              value={editValues.pointsAgainst}
                              onChange={(v) =>
                                handleEditChange("pointsAgainst", v)
                              }
                            />
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                              {(editValues.pointsFor || 0) -
                                (editValues.pointsAgainst || 0)}
                            </td>
                            <EditCell
                              value={editValues.points}
                              onChange={(v) => handleEditChange("points", v)}
                            />
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-medium">
                              {standing.wins || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                              {standing.draws || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">
                              {standing.losses || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                              {standing.pointsFor || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                              {standing.pointsAgainst || 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`font-medium ${
                                  standing.pointsDiff > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : standing.pointsDiff < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {standing.pointsDiff > 0 ? "+" : ""}
                                {standing.pointsDiff || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-bold text-sm">
                                {standing.points || 0}
                              </span>
                            </td>
                          </>
                        )
                      )}

                      {/* Form / Last Results - only for win/loss */}
                      {!isPlacement && !isRacing && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {standing.lastResults &&
                            standing.lastResults.length > 0 ? (
                              standing.lastResults.slice(-5).map((result, idx) => (
                                <span
                                  key={idx}
                                  className={`size-5 rounded text-xs font-bold flex items-center justify-center ${getResultBadge(result)}`}
                                >
                                  {result}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">
                                -
                              </span>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleEditSave}
                                disabled={loading === "save"}
                                className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10"
                              >
                                {loading === "save" ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Save className="size-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleEditCancel}
                                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-500/10"
                              >
                                <X className="size-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              {!isDefaultRow && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditStart(standing)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleDeleteSingle(standing.id)
                                    }
                                    disabled={loading === standing.id}
                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                  >
                                    {loading === standing.id ? (
                                      <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="size-4" />
                                    )}
                                  </Button>
                                </>
                              )}
                              {isDefaultRow && (
                                <span className="text-xs text-muted-foreground italic">
                                  {t("defaultLabel") || "Default"}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Round History Expansion Row — Racing */}
                    {isRacing && isExpanded && (
                      <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                        <td colSpan={100} className="px-4 py-0">
                          <div className="py-3 ps-10">
                            {hasRoundHistory ? (
                              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                                      <th className="px-3 py-2 text-left font-medium">{t("round") || "Round"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("placementCol") || "Place"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("finishTime") || "Finish"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("bestLap") || "Best Lap"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("laps") || "Laps"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("penalties") || "Pen."}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("points") || "PTS"}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {standing.roundHistory.map((rh, idx) => (
                                      <tr
                                        key={idx}
                                        className={rh.dnf || rh.dsq ? "opacity-60" : ""}
                                      >
                                        <td className="px-3 py-1.5 text-left">
                                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                                            R{rh.round}
                                          </span>
                                        </td>
                                        <td className="px-3 py-1.5 text-center font-medium text-foreground">
                                          {rh.placement ? `#${rh.placement}` : "-"}
                                        </td>
                                        <td className="px-3 py-1.5 text-center">
                                          <TimeCell value={rh.finishTimeMs} dnf={rh.dnf} dsq={rh.dsq} />
                                        </td>
                                        <td className="px-3 py-1.5 text-center">
                                          <TimeCell value={rh.bestLapMs} />
                                        </td>
                                        <td className="px-3 py-1.5 text-center text-gray-700 dark:text-gray-300">
                                          {rh.totalLaps ?? "-"}
                                        </td>
                                        <td className="px-3 py-1.5 text-center text-amber-600 dark:text-amber-400">
                                          {rh.penaltyMs ? (
                                            <span className="font-mono">{formatPenalty(rh.penaltyMs)}</span>
                                          ) : "—"}
                                        </td>
                                        <td className="px-3 py-1.5 text-center font-bold text-foreground">
                                          {rh.totalRoundPoints ?? 0}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground py-2">
                                {t("noRoundsPlayed") || "No rounds played yet"}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Round History Expansion Row — Placement */}
                    {isPlacement && isExpanded && (
                      <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                        <td colSpan={100} className="px-4 py-0">
                          <div className="py-3 ps-10">
                            {hasRoundHistory ? (
                              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                                      <th className="px-3 py-2 text-left font-medium">{t("round") || "Round"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("placementCol") || "Place"}</th>
                                      <th className="px-3 py-2 text-center font-medium">PP</th>
                                      <th className="px-3 py-2 text-center font-medium">KP</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("bonus") || "Bonus"}</th>
                                      <th className="px-3 py-2 text-center font-medium">{t("total") || "Total"}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {standing.roundHistory.map((rh, idx) => {
                                      const isBestRound = (rh.totalRoundPoints || 0) === bestRoundPoints && bestRoundPoints > 0;
                                      return (
                                        <tr
                                          key={idx}
                                          className={isBestRound ? "bg-green-50/50 dark:bg-green-500/5" : ""}
                                        >
                                          <td className="px-3 py-1.5 text-left">
                                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                                              R{rh.round}
                                            </span>
                                          </td>
                                          <td className="px-3 py-1.5 text-center font-medium text-foreground">
                                            {rh.placement ? `#${rh.placement}` : "-"}
                                          </td>
                                          <td className="px-3 py-1.5 text-center text-amber-600 dark:text-amber-400">
                                            {rh.placementPoints ?? 0}
                                          </td>
                                          <td className="px-3 py-1.5 text-center text-red-600 dark:text-red-400">
                                            {rh.killPoints ?? 0}
                                          </td>
                                          <td className="px-3 py-1.5 text-center text-purple-600 dark:text-purple-400">
                                            {rh.bonusPoints ?? 0}
                                          </td>
                                          <td className="px-3 py-1.5 text-center font-bold text-foreground">
                                            {rh.totalRoundPoints ?? 0}
                                            {isBestRound && <span className="ms-1 text-green-500">★</span>}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground py-2">
                                {t("noRoundsPlayed") || "No rounds played yet"}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        {standings.length > 0 && (
          <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <span className="size-3 rounded bg-yellow-500"></span>
                <span>1st</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="size-3 rounded bg-gray-400"></span>
                <span>2nd</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="size-3 rounded bg-orange-500"></span>
                <span>3rd</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="size-3 text-green-500" />
                <span>{t("qualified") || "Qualified"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="size-3 text-red-500" />
                <span>{t("eliminated") || "Eliminated"}</span>
              </div>
              {isDefault && (
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3 text-yellow-500" />
                  <span>
                    {t("defaultNote") ||
                      "Default standings - click Initialize to save to database"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sortable column header for racing standings
function RacingSortHeader({ sortKey, label, title, currentSort, onToggle }) {
  const isActive = currentSort.key === sortKey;
  return (
    <th
      className="px-4 py-3 text-center font-semibold cursor-pointer select-none hover:text-foreground transition-colors"
      title={title}
      onClick={() => onToggle(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          currentSort.direction === "asc" ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )
        ) : (
          <ArrowUpDown className="size-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

// Editable number cell
function EditCell({ value, onChange }) {
  return (
    <td className="px-4 py-3 text-center">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-14 h-8 text-center rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm focus:ring-2 focus:ring-green-primary/50"
        min={0}
      />
    </td>
  );
}

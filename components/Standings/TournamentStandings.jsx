"use client";

import { useTranslations } from "next-intl";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  User,
  Medal,
  Target,
  Zap,
  Timer,
} from "lucide-react";
import { TimeCell } from "@/components/ui/TimeInput";
import { formatTimeMs, formatPenalty } from "@/lib/timeUtils";
import { getImgUrl } from "@/lib/utils";

// Streak badge styling
const getStreakBadge = (streak) => {
  if (!streak) return null;

  const isWinning = streak.startsWith("W") || streak.includes("W");
  const isLosing = streak.startsWith("L") || streak.includes("L");

  if (isWinning) {
    return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400";
  } else if (isLosing) {
    return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400";
  }
  return "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400";
};

// Last results badge
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

// Position styling based on qualification
const getPositionStyle = (position, isQualified, isEliminated) => {
  if (position === 1) {
    return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30";
  }
  if (position === 2) {
    return "bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500/30";
  }
  if (position === 3) {
    return "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-500/30";
  }
  if (isQualified) {
    return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30";
  }
  if (isEliminated) {
    return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30";
  }
  return "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10";
};

function TournamentStandings({ standings = [], grouped = {}, title, compact = false, competitionType, participationType }) {
  const isRacing = competitionType === "racing";
  const isPlayerBased = participationType === "player";
  const t = useTranslations("Standings");

  // Ensure standings is an array
  const standingsArray = Array.isArray(standings) ? standings : [];

  // Ensure grouped values are arrays
  const safeGrouped = {};
  if (grouped && typeof grouped === 'object') {
    Object.entries(grouped).forEach(([key, value]) => {
      safeGrouped[key] = Array.isArray(value) ? value : [];
    });
  }

  // Check if we have grouped standings
  const hasGroups = Object.keys(safeGrouped).length > 0;
  const dataToRender = hasGroups ? safeGrouped : { "": standingsArray };

  // If no standings data
  if (standingsArray.length === 0 && !hasGroups) {
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Trophy className="size-5 text-green-primary" />
          {title || t("standings") || "Standings"}
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Trophy className="size-12 mx-auto mb-3 opacity-30" />
          <p>{t("noStandings") || "No standings available yet"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <Trophy className="size-5 text-green-primary" />
          {title || t("standings") || "Standings"}
        </h3>
      </div>

      {/* Standings Content */}
      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {Object.entries(dataToRender).map(([groupName, groupStandings]) => (
          <div key={groupName || "default"}>
            {/* Group Header */}
            {groupName && (
              <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-white/5">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Medal className="size-4 text-green-primary" />
                  {groupName}
                </h4>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/5">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      {isPlayerBased ? (t("player") || "Player") : (t("team") || "Team")}
                    </th>
                    {isRacing ? (
                      <>
                        <th className="px-4 py-3 text-center font-semibold">{t("played") || "P"}</th>
                        <th className="px-4 py-3 text-center font-semibold">{t("points") || "PTS"}</th>
                        {!compact && (
                          <>
                            <th className="px-4 py-3 text-center font-semibold">{t("bestTime") || "Best Time"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{t("bestLap") || "Best Lap"}</th>
                            <th className="px-4 py-3 text-center font-semibold">DNF</th>
                            <th className="px-4 py-3 text-center font-semibold">DSQ</th>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {!compact && (
                          <>
                            <th className="px-4 py-3 text-center font-semibold">{t("played") || "P"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{t("wins") || "W"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{t("draws") || "D"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{t("losses") || "L"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{t("diff") || "+/-"}</th>
                          </>
                        )}
                        <th className="px-4 py-3 text-center font-semibold">{t("points") || "PTS"}</th>
                        {!compact && (
                          <th className="px-4 py-3 text-center font-semibold">{t("form") || "Form"}</th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {(groupStandings || []).map((standing) => {
                    const entityLogo = isPlayerBased
                      ? (getImgUrl(standing.player?.photo?.light, "thumbnail") || getImgUrl(standing.player?.photo?.dark, "thumbnail"))
                      : (getImgUrl(standing.team?.logo?.light, "thumbnail") || getImgUrl(standing.team?.logo?.dark, "thumbnail"));
                    const entityName = isPlayerBased
                      ? (standing.player?.nickname || standing.player?.name)
                      : standing.team?.name;
                    const positionStyle = getPositionStyle(standing.position, standing.isQualified, standing.isEliminated);

                    return (
                      <tr
                        key={standing.id || standing._id}
                        className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                          standing.isEliminated ? "opacity-60" : ""
                        }`}
                      >
                        {/* Position */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center size-7 rounded-lg text-sm font-bold border ${positionStyle}`}>
                            {standing.position}
                          </span>
                        </td>

                        {/* Team / Player */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 ${isPlayerBased ? "rounded-full" : "rounded-lg"} bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0`}>
                              {entityLogo ? (
                                <img
                                  src={entityLogo}
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
                              {!isPlayerBased && standing.team?.shortName && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {standing.team?.shortName}
                                </p>
                              )}
                            </div>
                            {/* Status indicators */}
                            {!isRacing && (
                              <div className="flex gap-1">
                                {standing.isQualified && (
                                  <span title={t("qualified") || "Qualified"}>
                                    <TrendingUp className="size-4 text-green-500" />
                                  </span>
                                )}
                                {standing.isEliminated && (
                                  <span title={t("eliminated") || "Eliminated"}>
                                    <TrendingDown className="size-4 text-red-500" />
                                  </span>
                                )}
                              </div>
                            )}
                            {/* DNF/DSQ badges for racing */}
                            {isRacing && ((standing.dnfCount || 0) > 0 || (standing.dsqCount || 0) > 0) && (
                              <div className="flex gap-1">
                                {(standing.dnfCount || 0) > 0 && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500">
                                    {standing.dnfCount} DNF
                                  </span>
                                )}
                                {(standing.dsqCount || 0) > 0 && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 line-through">
                                    {standing.dsqCount} DSQ
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {isRacing ? (
                          <>
                            {/* Matches Played */}
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                              {standing.matchesPlayed || 0}
                            </td>

                            {/* Points */}
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-bold text-sm">
                                {standing.points || 0}
                              </span>
                            </td>

                            {!compact && (
                              <>
                                {/* Best Time */}
                                <td className="px-4 py-3 text-center">
                                  <TimeCell value={standing.bestFinishTimeMs} />
                                </td>

                                {/* Best Lap */}
                                <td className="px-4 py-3 text-center">
                                  <TimeCell value={standing.bestLapMs} />
                                </td>

                                {/* DNF */}
                                <td className="px-4 py-3 text-center">
                                  <span className={`text-sm font-medium ${(standing.dnfCount || 0) > 0 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                                    {standing.dnfCount || 0}
                                  </span>
                                </td>

                                {/* DSQ */}
                                <td className="px-4 py-3 text-center">
                                  <span className={`text-sm font-medium ${(standing.dsqCount || 0) > 0 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                                    {standing.dsqCount || 0}
                                  </span>
                                </td>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {!compact && (
                              <>
                                {/* Matches Played */}
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                                  {standing.matchesPlayed || 0}
                                </td>

                                {/* Wins */}
                                <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-medium">
                                  {standing.wins || 0}
                                </td>

                                {/* Draws */}
                                <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {standing.draws || 0}
                                </td>

                                {/* Losses */}
                                <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">
                                  {standing.losses || 0}
                                </td>

                                {/* Point Difference */}
                                <td className="px-4 py-3 text-center">
                                  <span className={`font-medium ${
                                    standing.pointsDiff > 0
                                      ? "text-green-600 dark:text-green-400"
                                      : standing.pointsDiff < 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-500 dark:text-gray-400"
                                  }`}>
                                    {standing.pointsDiff > 0 ? "+" : ""}{standing.pointsDiff || 0}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* Points */}
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-bold text-sm">
                                {standing.points || 0}
                              </span>
                            </td>

                            {!compact && (
                              /* Form / Last Results */
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  {standing.lastResults && standing.lastResults.length > 0 ? (
                                    standing.lastResults.slice(-5).map((result, idx) => (
                                      <span
                                        key={idx}
                                        className={`size-5 rounded text-xs font-bold flex items-center justify-center ${getResultBadge(result)}`}
                                      >
                                        {result}
                                      </span>
                                    ))
                                  ) : standing.streak ? (
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStreakBadge(standing.streak)}`}>
                                      {standing.streak}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                  )}
                                </div>
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      {!compact && (
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
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentStandings;

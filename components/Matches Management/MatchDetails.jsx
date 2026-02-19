"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Edit,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Tv,
  Trophy,
  Gamepad2,
  Users,
  Video,
  ExternalLink,
  Flag,
  PauseCircle,
  Ban,
  RotateCcw,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import { startMatch, updateMatchStatus, updateMatchResult } from "@/app/[locale]/_Lib/actions";
import MultiParticipantMatchView from "./MultiParticipantMatchView";
import toast from "react-hot-toast";
import { getImgUrl } from "@/lib/utils";

const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-500/30",
    icon: Clock,
  },
  live: {
    label: "LIVE",
    className: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30 animate-pulse",
    icon: Play,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30",
    icon: CheckCircle,
  },
  postponed: {
    label: "Postponed",
    className: "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500/30",
    icon: XCircle,
  },
};

function MatchDetails({ match }) {
  const t = useTranslations("MatchDetails");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  if (!match) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        {t("matchNotFound")}
      </div>
    );
  }

  if (match.isMultiParticipant) {
    return <MultiParticipantMatchView match={match} tournament={match.tournament} />;
  }

  const statusConfig = STATUS_CONFIG[match.status] || STATUS_CONFIG.scheduled;
  const StatusIcon = statusConfig.icon;

  const team1Logo = getImgUrl(match.team1?.logo?.light) || getImgUrl(match.team1?.logo?.dark);
  const team2Logo = getImgUrl(match.team2?.logo?.light) || getImgUrl(match.team2?.logo?.dark);
  const gameLogo = getImgUrl(match.game?.logo?.light) || getImgUrl(match.game?.logo?.dark);
  const tournamentLogo = getImgUrl(match.tournament?.logo?.light) || getImgUrl(match.tournament?.logo?.dark);

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "EEEE, MMMM dd, yyyy");
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return format(new Date(date), "HH:mm");
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  };

  const handleStartMatch = async () => {
    setIsLoading(true);
    setLoadingAction("start");
    try {
      await startMatch(match.id || match._id);
      toast.success(t("matchStarted") || "Match started");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("errorStartingMatch") || "Error starting match");
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    setLoadingAction(newStatus);
    try {
      await updateMatchStatus(match.id || match._id, newStatus);
      toast.success(t("statusUpdated") || "Status updated");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("errorUpdatingStatus") || "Error updating status");
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleScoreUpdate = async (team, increment) => {
    const currentTeam1Score = match.result?.team1Score || 0;
    const currentTeam2Score = match.result?.team2Score || 0;

    let newTeam1Score = currentTeam1Score;
    let newTeam2Score = currentTeam2Score;

    if (team === 1) {
      newTeam1Score = Math.max(0, currentTeam1Score + increment);
    } else {
      newTeam2Score = Math.max(0, currentTeam2Score + increment);
    }

    setIsLoading(true);
    setLoadingAction(`score-${team}-${increment > 0 ? 'inc' : 'dec'}`);
    try {
      await updateMatchResult(match.id || match._id, {
        team1Score: newTeam1Score,
        team2Score: newTeam2Score,
        winner: newTeam1Score > newTeam2Score
          ? (match.team1?.id || match.team1?._id)
          : newTeam1Score < newTeam2Score
            ? (match.team2?.id || match.team2?._id)
            : undefined,
      });
      toast.success(t("scoreUpdated") || "Score updated");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("errorUpdatingScore") || "Error updating score");
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  // Render quick action buttons based on status
  const renderQuickActionButtons = () => {
    const buttons = [];

    if (match.status === "scheduled") {
      buttons.push(
        <Button
          key="start"
          onClick={handleStartMatch}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-500/90 gap-2"
        >
          {loadingAction === "start" ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
          {t("startMatch") || "Start Match"}
        </Button>
      );
    }

    if (match.status === "live") {
      buttons.push(
        <Button
          key="complete"
          onClick={() => handleStatusChange("completed")}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-500/90 gap-2"
        >
          {loadingAction === "completed" ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
          {t("endMatch") || "End Match"}
        </Button>
      );
    }

    if (match.status !== "postponed" && match.status !== "cancelled" && match.status !== "completed") {
      buttons.push(
        <Button
          key="postpone"
          onClick={() => handleStatusChange("postponed")}
          disabled={isLoading}
          variant="outline"
          className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 gap-2"
        >
          {loadingAction === "postponed" ? <Loader2 className="size-4 animate-spin" /> : <PauseCircle className="size-4" />}
          {t("postpone") || "Postpone"}
        </Button>
      );
      buttons.push(
        <Button
          key="cancel"
          onClick={() => handleStatusChange("cancelled")}
          disabled={isLoading}
          variant="outline"
          className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 gap-2"
        >
          {loadingAction === "cancelled" ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
          {t("cancelMatch") || "Cancel"}
        </Button>
      );
    }

    if (match.status === "postponed" || match.status === "cancelled") {
      buttons.push(
        <Button
          key="reschedule"
          onClick={() => handleStatusChange("scheduled")}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-500/90 gap-2"
        >
          {loadingAction === "scheduled" ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
          {t("reschedule") || "Reschedule"}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Quick Status Actions */}
        {renderQuickActionButtons()}

        {/* Edit Button */}
        <Link href={`/dashboard/matches-management/edit/${match.id || match._id}`}>
          <Button className="bg-green-primary hover:bg-green-primary/90 gap-2">
            <Edit className="size-4" />
            {t("edit")}
          </Button>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Header Card */}
          <div className="bg-white dark:bg-[#0f1118] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
            {/* Game & Tournament Banner */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1a1d2e] dark:to-[#12141c] border-b border-gray-200 dark:border-white/5">
              <div className="flex flex-wrap items-center gap-4">
                {/* Game */}
                <div className="flex items-center gap-2">
                  {gameLogo ? (
                    <img src={gameLogo} alt={match.game?.name} className="size-8 rounded" />
                  ) : (
                    <Gamepad2 className="size-8 text-gray-400 dark:text-gray-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{match.game?.name}</span>
                </div>

                {/* Tournament */}
                {match.tournament && (
                  <>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    <div className="flex items-center gap-2">
                      {tournamentLogo ? (
                        <img src={tournamentLogo} alt={match.tournament?.name} className="size-6 rounded" />
                      ) : (
                        <Trophy className="size-5 text-gray-400 dark:text-gray-500" />
                      )}
                      <span className="text-gray-600 dark:text-gray-400">{match.tournament?.name}</span>
                    </div>
                  </>
                )}

                {/* Round */}
                {match.round && (
                  <Badge variant="secondary" className="bg-gray-200 dark:bg-white/5 border-0 ml-auto text-gray-700 dark:text-gray-300">
                    {match.round}
                  </Badge>
                )}
              </div>
            </div>

            {/* Teams VS Section */}
            <div className="p-8">
              <div className="flex items-center justify-center gap-8">
                {/* Team 1 */}
                <div className="flex-1 text-center">
                  <div className="size-24 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                    {team1Logo ? (
                      <img src={team1Logo} alt={match.team1?.name} className="size-20 object-contain" />
                    ) : (
                      <Users className="size-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{match.team1?.name}</h3>
                  {match.team1?.shortName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{match.team1?.shortName}</p>
                  )}
                  {match.result && (
                    <p className={`text-4xl font-bold mt-4 ${
                      match.result.winner === (match.team1?.id || match.team1?._id)
                        ? "text-green-primary"
                        : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {match.result.team1Score}
                    </p>
                  )}
                </div>

                {/* VS */}
                <div className="flex flex-col items-center">
                  <Badge className={`${statusConfig.className} border gap-1 mb-4`}>
                    <StatusIcon className="size-4" />
                    {statusConfig.label}
                  </Badge>
                  <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">VS</span>
                  {match.bestOf && match.bestOf > 1 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Bo{match.bestOf}</span>
                  )}
                </div>

                {/* Team 2 */}
                <div className="flex-1 text-center">
                  <div className="size-24 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                    {team2Logo ? (
                      <img src={team2Logo} alt={match.team2?.name} className="size-20 object-contain" />
                    ) : (
                      <Users className="size-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{match.team2?.name}</h3>
                  {match.team2?.shortName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{match.team2?.shortName}</p>
                  )}
                  {match.result && (
                    <p className={`text-4xl font-bold mt-4 ${
                      match.result.winner === (match.team2?.id || match.team2?._id)
                        ? "text-green-primary"
                        : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {match.result.team2Score}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Match Info Footer */}
            <div className="px-6 pb-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>{formatDate(match.scheduledDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{formatTime(match.scheduledDate)}</span>
                </div>
                {match.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>{match.venue}</span>
                  </div>
                )}
                {match.isOnline !== undefined && (
                  <Badge variant="secondary" className={match.isOnline ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"}>
                    {match.isOnline ? t("online") : t("offline")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Live Score Controls - Only show for live matches */}
          {match.status === "live" && (
            <div className="bg-red-50 dark:bg-red-500/5 rounded-2xl p-6 border border-red-200 dark:border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 bg-red-500 rounded-full animate-pulse" />
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">{t("liveScoreControl") || "Live Score Control"}</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Team 1 Score Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                      {team1Logo ? (
                        <img src={team1Logo} alt={match.team1?.name} className="size-8 object-contain" />
                      ) : (
                        <Users className="size-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <span className="font-medium truncate text-gray-900 dark:text-white">{match.team1?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleScoreUpdate(1, -1)}
                      disabled={isLoading || (match.result?.team1Score || 0) <= 0}
                      className="size-12 rounded-xl bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {loadingAction === 'score-1-dec' ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Minus className="size-5" />
                      )}
                    </button>
                    <div className="flex-1 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-transparent flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-primary">
                        {match.result?.team1Score || 0}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleScoreUpdate(1, 1)}
                      disabled={isLoading}
                      className="size-12 rounded-xl bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {loadingAction === 'score-1-inc' ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Plus className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Team 2 Score Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                      {team2Logo ? (
                        <img src={team2Logo} alt={match.team2?.name} className="size-8 object-contain" />
                      ) : (
                        <Users className="size-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <span className="font-medium truncate text-gray-900 dark:text-white">{match.team2?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleScoreUpdate(2, -1)}
                      disabled={isLoading || (match.result?.team2Score || 0) <= 0}
                      className="size-12 rounded-xl bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {loadingAction === 'score-2-dec' ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Minus className="size-5" />
                      )}
                    </button>
                    <div className="flex-1 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-transparent flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-primary">
                        {match.result?.team2Score || 0}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleScoreUpdate(2, 1)}
                      disabled={isLoading}
                      className="size-12 rounded-xl bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {loadingAction === 'score-2-inc' ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Plus className="size-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Results */}
          {match.result?.maps && match.result.maps.length > 0 && (
            <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Flag className="size-5 text-green-primary" />
                {t("mapResults")}
              </h3>
              <div className="space-y-3">
                {match.result.maps.map((map, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{map.mapName || `Map ${index + 1}`}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${map.winner === (match.team1?.id || match.team1?._id) ? "text-green-primary" : "text-gray-400 dark:text-gray-500"}`}>
                        {map.team1Score}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                      <span className={`font-bold ${map.winner === (match.team2?.id || match.team2?._id) ? "text-green-primary" : "text-gray-400 dark:text-gray-500"}`}>
                        {map.team2Score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lineups */}
          {match.lineups && match.lineups.length > 0 && (
            <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="size-5 text-green-primary" />
                {t("lineups")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {match.lineups.map((lineup, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-white/5">
                      {lineup.team?.logo?.light && (
                        <img src={getImgUrl(lineup.team.logo.light)} alt={lineup.team.name} className="size-6 rounded" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{lineup.team?.name}</span>
                    </div>
                    <div className="space-y-2">
                      {lineup.players?.map((player) => (
                        <div key={player._id || player.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5">
                          <div className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                            {player.photo?.light ? (
                              <img src={getImgUrl(player.photo.light)} alt={player.nickname || player.fullName || 'Player'} className="size-full object-cover" />
                            ) : (
                              <Users className="size-5 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-gray-900 dark:text-white">{player.nickname || player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim() || 'Unknown'}</p>
                            {player.role && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">{player.role}</p>
                            )}
                          </div>
                          {player.country?.flag && (
                            <img src={player.country.flag} alt={player.country.name} className="size-5 rounded-sm" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t("matchInfo")}</h3>
            <div className="space-y-4">
              {/* Best Of */}
              {match.bestOf && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                    <Flag className="size-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("format")}</p>
                    <p className="font-medium text-gray-900 dark:text-white">Best of {match.bestOf}</p>
                  </div>
                </div>
              )}

              {/* Match Number */}
              {match.matchNumber && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                    <span className="text-purple-500 dark:text-purple-400 font-bold">#{match.matchNumber}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("matchNumber")}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{match.matchNumber}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Vote Stats */}
          {match.voteStats && match.voteStats.counts?.total > 0 && (
            <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t("predictions")}</h3>
              <div className="space-y-4">
                {/* Team 1 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{match.team1?.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{match.voteStats.percentages?.team1?.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${match.voteStats.percentages?.team1 || 0}%` }}
                    />
                  </div>
                </div>
                {/* Team 2 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{match.team2?.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{match.voteStats.percentages?.team2?.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${match.voteStats.percentages?.team2 || 0}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-white/5">
                  {match.voteStats.counts?.total?.toLocaleString()} {t("totalVotes")}
                </p>
              </div>
            </div>
          )}

          {/* Links */}
          {(match.streamUrl || match.highlightsUrl) && (
            <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t("links")}</h3>
              <div className="space-y-3">
                {match.streamUrl && (
                  <a
                    href={match.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                  >
                    <Tv className="size-5 text-red-500 dark:text-red-400" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{t("watchStream")}</span>
                    <ExternalLink className="size-4 text-gray-400 dark:text-gray-500" />
                  </a>
                )}
                {match.highlightsUrl && (
                  <a
                    href={match.highlightsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
                  >
                    <Video className="size-5 text-purple-500 dark:text-purple-400" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{t("watchHighlights")}</span>
                    <ExternalLink className="size-4 text-gray-400 dark:text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t("timestamps")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t("scheduledFor")}</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(match.scheduledDate)}</span>
              </div>
              {match.startedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t("startedAt")}</span>
                  <span className="text-gray-900 dark:text-white">{formatDateTime(match.startedAt)}</span>
                </div>
              )}
              {match.endedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t("endedAt")}</span>
                  <span className="text-gray-900 dark:text-white">{formatDateTime(match.endedAt)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/5">
                <span className="text-gray-500 dark:text-gray-400">{t("createdAt")}</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(match.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;

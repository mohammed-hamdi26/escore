"use client";

import { useState } from "react";
import { getImgUrl } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Calendar,
  Trophy,
  Gamepad2,
  Users,
  PauseCircle,
  Ban,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { startMatch, updateMatchStatus, updateMatchResult } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";
import Image from "next/image";

const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    icon: Clock,
  },
  live: {
    label: "LIVE",
    className: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30 animate-pulse",
    icon: Play,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30",
    icon: CheckCircle,
  },
  postponed: {
    label: "Postponed",
    className: "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    icon: PauseCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30",
    icon: XCircle,
  },
};

function MatchCard({ match, viewMode = "grid", t, onDelete }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { hasPermission } = usePermissions();

  // Permission checks
  const canUpdate = hasPermission(ENTITIES.MATCH, ACTIONS.UPDATE);
  const canDelete = hasPermission(ENTITIES.MATCH, ACTIONS.DELETE);

  const statusConfig = STATUS_CONFIG[match.status] || STATUS_CONFIG.scheduled;
  const StatusIcon = statusConfig.icon;

  const team1Logo = getImgUrl(match.team1?.logo?.light, "medium") || getImgUrl(match.team1?.logo?.dark, "medium");
  const team2Logo = getImgUrl(match.team2?.logo?.light, "medium") || getImgUrl(match.team2?.logo?.dark, "medium");
  const gameLogo = getImgUrl(match.game?.logo?.light, "medium") || getImgUrl(match.game?.logo?.dark, "medium");

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const formatTime = (date) => {
    if (!date) return "";
    return format(new Date(date), "HH:mm");
  };

  const handleCardClick = () => {
    router.push(`/dashboard/matches-management/view/${match.id || match._id}`);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(match.id || match._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMatch = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await startMatch(match.id || match._id);
      toast.success(t("matchStarted") || "Match started");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("errorStartingMatch") || "Error starting match");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (e, newStatus) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await updateMatchStatus(match.id || match._id, newStatus);
      toast.success(t("statusUpdated") || "Status updated");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("errorUpdatingStatus") || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreUpdate = async (e, team, increment) => {
    e.stopPropagation();
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
    }
  };

  // Render quick action buttons based on current status
  const renderQuickActions = () => {
    const actions = [];

    if (match.status === "scheduled") {
      actions.push(
        <DropdownMenuItem
          key="start"
          onClick={handleStartMatch}
          className="cursor-pointer text-green-600 dark:text-green-400 focus:text-green-600 dark:focus:text-green-400"
        >
          <Play className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("startMatch") || "Start Match"}
        </DropdownMenuItem>
      );
    }

    if (match.status === "live") {
      actions.push(
        <DropdownMenuItem
          key="complete"
          onClick={(e) => handleStatusChange(e, "completed")}
          className="cursor-pointer text-green-600 dark:text-green-400 focus:text-green-600 dark:focus:text-green-400"
        >
          <CheckCircle className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("endMatch") || "End Match"}
        </DropdownMenuItem>
      );
    }

    if (match.status !== "postponed" && match.status !== "cancelled" && match.status !== "completed") {
      actions.push(
        <DropdownMenuItem
          key="postpone"
          onClick={(e) => handleStatusChange(e, "postponed")}
          className="cursor-pointer text-amber-600 dark:text-amber-400 focus:text-amber-600 dark:focus:text-amber-400"
        >
          <PauseCircle className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("postpone") || "Postpone"}
        </DropdownMenuItem>
      );
      actions.push(
        <DropdownMenuItem
          key="cancel"
          onClick={(e) => handleStatusChange(e, "cancelled")}
          className="cursor-pointer text-gray-600 dark:text-gray-400 focus:text-gray-600 dark:focus:text-gray-400"
        >
          <Ban className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("cancel") || "Cancel"}
        </DropdownMenuItem>
      );
    }

    if (match.status === "postponed" || match.status === "cancelled") {
      actions.push(
        <DropdownMenuItem
          key="reschedule"
          onClick={(e) => handleStatusChange(e, "scheduled")}
          className="cursor-pointer text-blue-600 dark:text-blue-400 focus:text-blue-600 dark:focus:text-blue-400"
        >
          <RotateCcw className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("reschedule") || "Reschedule"}
        </DropdownMenuItem>
      );
    }

    return actions;
  };

  // Grid View
  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-white dark:bg-[#0f1118] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-primary/10 dark:hover:shadow-green-primary/5"
      >
        {/* Header with Game & Tournament */}
        <div className="relative p-4 bg-gradient-to-b from-gray-50 dark:from-[#1a1d2e] to-transparent">
          <div className="flex items-center justify-between gap-2">
            {/* Game Badge */}
            <div className="flex items-center gap-2">
              {gameLogo ? (
                <Image src={gameLogo} alt={match.game?.name} width={20} height={20} className="size-5 rounded" />
              ) : (
                <Gamepad2 className="size-5 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                {match.game?.name}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <Badge className={`${statusConfig.className} border gap-1 text-xs`}>
                <StatusIcon className="size-3" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Event & Tournament */}
          {(match.event || match.tournament) && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Trophy className="size-3 flex-shrink-0" />
              <span className="truncate">
                {match.event && match.tournament
                  ? `${match.event.name} — ${match.tournament.name}`
                  : match.tournament?.name || match.event?.name}
              </span>
            </div>
          )}

          {/* Actions Menu */}
          <div
            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 dark:bg-black/60 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-black/80 text-gray-700 dark:text-white size-8 shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner className="size-4" /> : <MoreVertical className="size-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href={`/dashboard/matches-management/view/${match.id || match._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails")}
                  </DropdownMenuItem>
                </Link>
                {canUpdate && (
                  <Link href={`/dashboard/matches-management/edit/${match.id || match._id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                  </Link>
                )}
                {(canUpdate || canDelete) && <DropdownMenuSeparator />}
                {/* Quick Actions - only show if user can update */}
                {canUpdate && renderQuickActions()}
                {canUpdate && renderQuickActions().length > 0 && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Teams VS Section */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Team 1 */}
            <div className="flex-1 text-center">
              <div className="relative size-16 mx-auto mb-2 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                {team1Logo ? (
                  <Image src={team1Logo} alt={match.team1?.name} width={48} height={48} className="size-12 object-contain" />
                ) : (
                  <Users className="size-8 text-muted-foreground" />
                )}
              </div>
              <p className="font-medium text-sm truncate">{match.team1?.name}</p>
              {match.status === "live" ? (
                canUpdate ? (
                  <div className="flex items-center justify-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleScoreUpdate(e, 1, -1)}
                      disabled={isLoading || (match.result?.team1Score || 0) <= 0}
                      className="size-8 rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="text-2xl font-bold text-green-primary min-w-[40px]">
                      {match.result?.team1Score || 0}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleScoreUpdate(e, 1, 1)}
                      disabled={isLoading}
                      className="size-8 rounded-lg bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-600 dark:text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-primary mt-1">
                    {match.result?.team1Score || 0}
                  </p>
                )
              ) : match.result && (
                <p className="text-2xl font-bold text-green-primary mt-1">
                  {match.result.team1Score}
                </p>
              )}
            </div>

            {/* VS */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-muted-foreground">VS</span>
              {match.bestOf && match.bestOf > 1 && (
                <span className="text-xs text-muted-foreground">Bo{match.bestOf}</span>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex-1 text-center">
              <div className="relative size-16 mx-auto mb-2 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                {team2Logo ? (
                  <Image src={team2Logo} alt={match.team2?.name} width={48} height={48} className="size-12 object-contain" />
                ) : (
                  <Users className="size-8 text-muted-foreground" />
                )}
              </div>
              <p className="font-medium text-sm truncate">{match.team2?.name}</p>
              {match.status === "live" ? (
                canUpdate ? (
                  <div className="flex items-center justify-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleScoreUpdate(e, 2, -1)}
                      disabled={isLoading || (match.result?.team2Score || 0) <= 0}
                      className="size-8 rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="text-2xl font-bold text-green-primary min-w-[40px]">
                      {match.result?.team2Score || 0}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleScoreUpdate(e, 2, 1)}
                      disabled={isLoading}
                      className="size-8 rounded-lg bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-600 dark:text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-primary mt-1">
                    {match.result?.team2Score || 0}
                  </p>
                )
              ) : match.result && (
                <p className="text-2xl font-bold text-green-primary mt-1">
                  {match.result.team2Score}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-gray-200 dark:border-white/5 pt-3">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{formatDate(match.scheduledDate)}</span>
              <span className="text-foreground font-medium">{formatTime(match.scheduledDate)}</span>
            </div>
            {match.round && (
              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-white/5 border-0">
                {match.round}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-[#0f1118] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/40 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Game Logo */}
        <div className="relative size-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
          {gameLogo ? (
            <Image src={gameLogo} alt={match.game?.name} width={24} height={24} className="size-6 object-contain" />
          ) : (
            <Gamepad2 className="size-5 text-muted-foreground" />
          )}
        </div>

        {/* Teams */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Team 1 */}
          <div className="flex items-center gap-2">
            {team1Logo && (
              <Image src={team1Logo} alt={match.team1?.name} width={24} height={24} className="size-6 rounded" />
            )}
            <span className="font-medium truncate max-w-[100px]">{match.team1?.name}</span>
            {match.status === "live" ? (
              canUpdate ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => handleScoreUpdate(e, 1, -1)}
                    disabled={isLoading || (match.result?.team1Score || 0) <= 0}
                    className="size-6 rounded bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="font-bold text-green-primary min-w-[24px] text-center">{match.result?.team1Score || 0}</span>
                  <button
                    type="button"
                    onClick={(e) => handleScoreUpdate(e, 1, 1)}
                    disabled={isLoading}
                    className="size-6 rounded bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-600 dark:text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              ) : (
                <span className="font-bold text-green-primary">{match.result?.team1Score || 0}</span>
              )
            ) : match.result && (
              <span className="font-bold text-green-primary">{match.result.team1Score}</span>
            )}
          </div>

          <span className="text-muted-foreground text-sm">vs</span>

          {/* Team 2 */}
          <div className="flex items-center gap-2">
            {team2Logo && (
              <Image src={team2Logo} alt={match.team2?.name} width={24} height={24} className="size-6 rounded" />
            )}
            <span className="font-medium truncate max-w-[100px]">{match.team2?.name}</span>
            {match.status === "live" ? (
              canUpdate ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => handleScoreUpdate(e, 2, -1)}
                    disabled={isLoading || (match.result?.team2Score || 0) <= 0}
                    className="size-6 rounded bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="font-bold text-green-primary min-w-[24px] text-center">{match.result?.team2Score || 0}</span>
                  <button
                    type="button"
                    onClick={(e) => handleScoreUpdate(e, 2, 1)}
                    disabled={isLoading}
                    className="size-6 rounded bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-600 dark:text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              ) : (
                <span className="font-bold text-green-primary">{match.result?.team2Score || 0}</span>
              )
            ) : match.result && (
              <span className="font-bold text-green-primary">{match.result.team2Score}</span>
            )}
          </div>
        </div>

        {/* Event & Tournament */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground min-w-[150px]">
          <Trophy className="size-4 flex-shrink-0" />
          <span className="truncate">
            {match.event && match.tournament
              ? `${match.event.name} — ${match.tournament.name}`
              : match.tournament?.name || match.event?.name || "-"}
          </span>
        </div>

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground min-w-[140px]">
          <Calendar className="size-4" />
          <span>{formatDate(match.scheduledDate)}</span>
          <span className="text-foreground">{formatTime(match.scheduledDate)}</span>
        </div>

        {/* Status */}
        <Badge className={`${statusConfig.className} border gap-1 text-xs`}>
          <StatusIcon className="size-3" />
          {statusConfig.label}
        </Badge>

        {/* Actions */}
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="size-4" /> : <MoreVertical className="size-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href={`/dashboard/matches-management/view/${match.id || match._id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("viewDetails")}
                </DropdownMenuItem>
              </Link>
              {canUpdate && (
                <Link href={`/dashboard/matches-management/edit/${match.id || match._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("edit")}
                  </DropdownMenuItem>
                </Link>
              )}
              {(canUpdate || canDelete) && <DropdownMenuSeparator />}
              {/* Quick Actions - only show if user can update */}
              {canUpdate && renderQuickActions()}
              {canUpdate && renderQuickActions().length > 0 && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;

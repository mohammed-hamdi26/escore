"use client";
import { Link } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import FilterMatches from "./FilterMatches";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  deleteMatch,
  startMatch,
  updateMatchStatus,
  toggleMatchFeatured,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  EllipsisVertical,
  Play,
  Square,
  Star,
  StarOff,
  Clock,
  XCircle,
  CheckCircle,
  Crosshair,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { getImgUrl } from "@/lib/utils";

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = {
    scheduled: {
      label: "Scheduled",
      className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      icon: Clock,
    },
    live: {
      label: "LIVE",
      className: "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse",
      icon: Play,
    },
    completed: {
      label: "Completed",
      className: "bg-green-500/20 text-green-500 border-green-500/30",
      icon: CheckCircle,
    },
    postponed: {
      label: "Postponed",
      className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      icon: Clock,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-gray-500/20 text-gray-500 border-gray-500/30",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.scheduled;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} flex items-center gap-1 px-2 py-1`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

function MatchesTable({ matches, columns, players, pagination }) {
  const [loadingId, setLoadingId] = useState(null);
  const searchParams = useSearchParams();
  const t = useTranslations("MatchesTable");

  // Handle start match
  const handleStartMatch = async (matchId) => {
    try {
      setLoadingId(matchId);
      await startMatch(matchId);
      toast.success(t("Match started successfully"));
    } catch (e) {
      toast.error(e.message || t("Error starting match"));
    } finally {
      setLoadingId(null);
    }
  };

  // Handle update status
  const handleUpdateStatus = async (matchId, status) => {
    try {
      setLoadingId(matchId);
      await updateMatchStatus(matchId, status);
      toast.success(t("Status updated successfully"));
    } catch (e) {
      toast.error(e.message || t("Error updating status"));
    } finally {
      setLoadingId(null);
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async (matchId) => {
    try {
      setLoadingId(matchId);
      await toggleMatchFeatured(matchId);
      toast.success(t("Featured status toggled"));
    } catch (e) {
      toast.error(e.message || t("Error toggling featured"));
    } finally {
      setLoadingId(null);
    }
  };

  // Handle delete
  const handleDelete = async (matchId) => {
    if (!confirm(t("Are you sure you want to delete this match?"))) return;
    try {
      setLoadingId(matchId);
      await deleteMatch(matchId);
      toast.success(t("The Match is Deleted"));
    } catch (e) {
      toast.error(t("error in Delete"));
    } finally {
      setLoadingId(null);
    }
  };

  // Calculate number of pages
  const numPages = pagination?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Filter section */}
      <FilterMatches />

      {/* Table */}
      <Table
        t={t}
        grid_cols="grid-cols-[1fr_1fr_0.6fr_0.5fr_0.6fr_1.5fr]"
        columns={[...columns]}
      >
        {matches?.map((match) => (
          <Table.Row
            grid_cols="grid-cols-[1fr_1fr_0.6fr_0.5fr_0.6fr_1.5fr]"
            key={match.id}
          >
            {/* Team 1 */}
            <Table.Cell className="flex gap-3 items-center">
              {match?.isMultiParticipant ? (
                <>
                  <Crosshair className="size-5 text-orange-500 shrink-0" />
                  <span className="truncate font-medium">
                    {match.matchLabel || t("brMatch") || "BR Match"}
                  </span>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 text-xs shrink-0">
                    <Users className="size-3 mr-1" />
                    {match.participants?.length || 0}
                  </Badge>
                </>
              ) : (
                <>
                  {match?.team1?.logo?.light && (
                    <img
                      width={28}
                      height={28}
                      src={getImgUrl(match?.team1?.logo?.light)}
                      alt={match?.team1?.name}
                      className="rounded"
                    />
                  )}
                  <span className="truncate">{match?.team1?.name}</span>
                  {match?.result && (
                    <span className="text-sm font-bold text-green-primary">
                      {match.result.team1Score}
                    </span>
                  )}
                </>
              )}
            </Table.Cell>

            {/* Team 2 */}
            <Table.Cell className="flex gap-3 items-center">
              {match?.isMultiParticipant ? (
                <span className="text-xs text-muted-foreground truncate">
                  {(() => {
                    const top = [...(match.participants || [])]
                      .sort((a, b) => (a.placement || 999) - (b.placement || 999))[0];
                    const name = top?.team?.name || top?.player?.nickname || top?.player?.name;
                    return name ? `🥇 ${name}` : "—";
                  })()}
                </span>
              ) : (
                <>
                  {match?.team2?.logo?.light && (
                    <img
                      width={28}
                      height={28}
                      src={getImgUrl(match?.team2?.logo?.light)}
                      alt={match?.team2?.name}
                      className="rounded"
                    />
                  )}
                  <span className="truncate">{match?.team2?.name}</span>
                  {match?.result && (
                    <span className="text-sm font-bold text-green-primary">
                      {match.result.team2Score}
                    </span>
                  )}
                </>
              )}
            </Table.Cell>

            {/* Status */}
            <Table.Cell>
              <StatusBadge status={match?.status} />
            </Table.Cell>

            {/* Round */}
            <Table.Cell className="text-sm text-gray-400">
              {match?.round || "-"}
            </Table.Cell>

            {/* Date */}
            <Table.Cell className="text-sm">
              {match?.scheduledDate
                ? format(new Date(match.scheduledDate), "MMM dd, HH:mm")
                : "-"}
            </Table.Cell>

            {/* Actions */}
            <Table.Cell className="flex gap-2 justify-end items-center">
              {/* Featured indicator */}
              {match?.isFeatured && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              )}

              {/* Edit Button */}
              <Link href={`/dashboard/matches-management/edit/${match.id}`}>
                <Button
                  size="sm"
                  className="text-white bg-green-primary rounded-full px-4 cursor-pointer hover:bg-green-primary/80"
                >
                  {t("Edit")}
                </Button>
              </Link>

              {/* Quick Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={loadingId === match.id}
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Start Match - only for scheduled */}
                  {match?.status === "scheduled" && (
                    <DropdownMenuItem
                      onClick={() => handleStartMatch(match.id)}
                      className="cursor-pointer"
                    >
                      <Play className="w-4 h-4 mr-2 text-green-500" />
                      {t("Start Match")}
                    </DropdownMenuItem>
                  )}

                  {/* End Match - only for live */}
                  {match?.status === "live" && (
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(match.id, "completed")}
                      className="cursor-pointer"
                    >
                      <Square className="w-4 h-4 mr-2 text-red-500" />
                      {t("End Match")}
                    </DropdownMenuItem>
                  )}

                  {/* Status changes */}
                  <DropdownMenuSeparator />

                  {match?.status !== "postponed" && (
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(match.id, "postponed")}
                      className="cursor-pointer"
                    >
                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                      {t("Postpone")}
                    </DropdownMenuItem>
                  )}

                  {match?.status !== "cancelled" && (
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(match.id, "cancelled")}
                      className="cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-2 text-gray-500" />
                      {t("Cancel")}
                    </DropdownMenuItem>
                  )}

                  {(match?.status === "postponed" ||
                    match?.status === "cancelled") && (
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(match.id, "scheduled")}
                      className="cursor-pointer"
                    >
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      {t("Reschedule")}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* Toggle Featured */}
                  <DropdownMenuItem
                    onClick={() => handleToggleFeatured(match.id)}
                    className="cursor-pointer"
                  >
                    {match?.isFeatured ? (
                      <>
                        <StarOff className="w-4 h-4 mr-2 text-yellow-500" />
                        {t("Remove Featured")}
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        {t("Mark Featured")}
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Delete */}
                  <DropdownMenuItem
                    onClick={() => handleDelete(match.id)}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t("Delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>

      {/* Pagination */}
      {numPages > 1 && <Pagination numPages={numPages} />}

      {/* Empty state */}
      {(!matches || matches.length === 0) && (
        <div className="text-center py-10 text-gray-400">
          {t("No matches found")}
        </div>
      )}
    </div>
  );
}

export default MatchesTable;

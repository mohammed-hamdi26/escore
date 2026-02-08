"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Pagination from "../ui app/Pagination";
import { Button } from "../ui/button";
import { format } from "date-fns";
import TournamentsFilter from "./TournamentsFilter";
import { useState } from "react";
import { deleteTournament, toggleTournamentFeatured } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trophy,
  Calendar,
  Star,
  Users,
  MoreHorizontal,
  Eye,
  StarOff,
  Loader2,
} from "lucide-react";

// Status badge colors
const STATUS_COLORS = {
  upcoming: "bg-blue-500/10 text-blue-500",
  ongoing: "bg-green-500/10 text-green-500",
  completed: "bg-gray-500/10 text-gray-400",
  cancelled: "bg-red-500/10 text-red-500",
};

// Tier badge colors
const TIER_COLORS = {
  S: "bg-yellow-500/10 text-yellow-500",
  A: "bg-purple-500/10 text-purple-500",
  B: "bg-cyan-500/10 text-cyan-500",
};

function TournamentsTable({ tournaments, pagination, games }) {
  const [loadingId, setLoadingId] = useState(null);
  const t = useTranslations("TournamentsTable");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const numPages = pagination?.totalPages || 1;
  const currentSort = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("sortOrder") || "desc";

  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams);
    if (currentSort === field) {
      // Toggle order
      params.set("sortOrder", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "desc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = (field) => {
    if (currentSort !== field) {
      return <ArrowUpDown className="size-3.5 opacity-50" />;
    }
    return currentOrder === "asc" ? (
      <ArrowUp className="size-3.5 text-green-primary" />
    ) : (
      <ArrowDown className="size-3.5 text-green-primary" />
    );
  };

  const handleDelete = async (id, name) => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setLoadingId(id);
      await deleteTournament(id);
      toast.success(t("deleteSuccess") || "Tournament deleted successfully");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete tournament");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TournamentsFilter games={games} />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("showing") || "Showing"}{" "}
          <span className="font-medium text-foreground">{tournaments.length}</span>{" "}
          {t("of") || "of"}{" "}
          <span className="font-medium text-foreground">{pagination?.total || 0}</span>{" "}
          {t("tournaments") || "tournaments"}
        </p>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
        {/* Table Header */}
        <div className="bg-muted/50 dark:bg-[#1a1d2e] border-b border-border">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-start"
            >
              {t("name") || "Tournament"}
              {getSortIcon("name")}
            </button>
            <button
              onClick={() => handleSort("status")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("status") || "Status"}
              {getSortIcon("status")}
            </button>
            <button
              onClick={() => handleSort("tier")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("tier") || "Tier"}
              {getSortIcon("tier")}
            </button>
            <button
              onClick={() => handleSort("startDate")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("date") || "Date"}
              {getSortIcon("startDate")}
            </button>
            <button
              onClick={() => handleSort("prizePool")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("prize") || "Prize Pool"}
              {getSortIcon("prizePool")}
            </button>
            <span className="text-sm font-medium text-muted-foreground text-end">
              {t("actions") || "Actions"}
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {tournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Trophy className="size-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">{t("noTournaments") || "No tournaments found"}</p>
              <p className="text-sm">{t("tryAdjusting") || "Try adjusting your filters"}</p>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => router.push(`/dashboard/tournaments-management/view/${tournament.id}`)}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-muted/30 dark:hover:bg-[#252a3d] transition-colors cursor-pointer"
              >
                {/* Tournament Name & Logo */}
                <div className="flex items-center gap-3 min-w-0">
                  {tournament?.logo?.light ? (
                    <img
                      src={tournament.logo.light}
                      alt={tournament.name}
                      className="size-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="size-5 text-green-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{tournament.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {tournament.organizer || tournament.game?.name || "-"}
                    </p>
                  </div>
                  {tournament.isFeatured && (
                    <Star className="size-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      STATUS_COLORS[tournament.status] || STATUS_COLORS.upcoming
                    }`}
                  >
                    {t(tournament.status) || tournament.status}
                  </span>
                </div>

                {/* Tier */}
                <div>
                  {tournament.tier && (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        TIER_COLORS[tournament.tier] || TIER_COLORS.B
                      }`}
                    >
                      {tournament.tier}-Tier
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className="text-sm">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {tournament.startDate
                      ? format(new Date(tournament.startDate), "MMM d, yyyy")
                      : "-"}
                  </div>
                  {tournament.endDate && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      → {format(new Date(tournament.endDate), "MMM d, yyyy")}
                    </p>
                  )}
                </div>

                {/* Prize Pool */}
                <div className="text-sm">
                  {tournament.prizePool ? (
                    <span className="font-medium text-green-primary">
                      ${tournament.prizePool.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                  {tournament.teams?.length > 0 && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Users className="size-3" />
                      {tournament.teams.length} teams
                    </p>
                  )}
                </div>

                {/* Actions */}
                <ActionsDropdown
                  tournament={tournament}
                  loadingId={loadingId}
                  onDelete={handleDelete}
                  t={t}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {numPages > 1 && <Pagination numPages={numPages} />}
    </div>
  );
}

// Actions Dropdown Component
function ActionsDropdown({ tournament, loadingId, onDelete, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);
  const router = useRouter();

  const isLoading = loadingId === tournament.id;

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/dashboard/tournaments-management/edit/${tournament.id}`);
  };

  const handleView = () => {
    setIsOpen(false);
    router.push(`/dashboard/tournaments-management/view/${tournament.id}`);
  };

  const handleToggleFeatured = async () => {
    try {
      setTogglingFeatured(true);
      await toggleTournamentFeatured(tournament.id);
      toast.success(t("toggleFeaturedSuccess") || "Featured status updated");
      setIsOpen(false);
    } catch (e) {
      toast.error(t("toggleFeaturedError") || "Failed to update featured status");
    } finally {
      setTogglingFeatured(false);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(tournament.id, tournament.name);
  };

  return (
    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
      {/* More Actions Dropdown */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d]"
          >
            <MoreHorizontal className="size-4 text-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-48 p-1.5 bg-background dark:bg-[#12141c] border-border"
          align="end"
        >
          <div className="space-y-0.5">
            {/* View Details */}
            <button
              onClick={handleView}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right"
            >
              <Eye className="size-4 text-muted-foreground" />
              {t("viewDetails") || "View Details"}
            </button>

            {/* Edit */}
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right"
            >
              <Pencil className="size-4 text-muted-foreground" />
              {t("edit") || "Edit"}
            </button>

            {/* Standings */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(
                  `/dashboard/tournaments-management/standings/${tournament.id}`
                );
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right"
            >
              <Trophy className="size-4 text-muted-foreground" />
              {t("standings") || "Standings"}
            </button>

            {/* Toggle Featured */}
            <button
              onClick={handleToggleFeatured}
              disabled={togglingFeatured}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right disabled:opacity-50"
            >
              {togglingFeatured ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("updating") || "Updating..."}
                </>
              ) : tournament.isFeatured ? (
                <>
                  <StarOff className="size-4 text-muted-foreground" />
                  {t("removeFeatured") || "Remove Featured"}
                </>
              ) : (
                <>
                  <Star className="size-4 text-yellow-500" />
                  {t("makeFeatured") || "Make Featured"}
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-border my-1" />

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left rtl:text-right disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {isLoading ? t("deleting") || "Deleting..." : t("delete") || "Delete"}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default TournamentsTable;

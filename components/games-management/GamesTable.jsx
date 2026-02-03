"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import { Button } from "../ui/button";
import { format } from "date-fns";
import GamesFilter from "./GamesFilter";
import { useState } from "react";
import { deleteGame, toggleGameActive } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Pencil,
  Trash2,
  Gamepad2,
  Calendar,
  MoreHorizontal,
  Eye,
  Power,
  PowerOff,
  Loader2,
  Users,
} from "lucide-react";

function GamesTable({ games, pagination }) {
  const [loadingId, setLoadingId] = useState(null);
  const t = useTranslations("GamesTable");
  const pathname = usePathname();
  const router = useRouter();

  const numPages = pagination?.totalPages || 1;

  const handleDelete = async (id, name) => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setLoadingId(id);
      await deleteGame(id);
      toast.success(t("deleteSuccess") || "Game deleted successfully");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete game");
    } finally {
      setLoadingId(null);
    }
  };

  // Helper to truncate description
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <GamesFilter />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("showing") || "Showing"}{" "}
          <span className="font-medium text-foreground">{games.length}</span>{" "}
          {t("of") || "of"}{" "}
          <span className="font-medium text-foreground">{pagination?.total || 0}</span>{" "}
          {t("games") || "games"}
        </p>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
        {/* Table Header */}
        <div className="bg-muted/50 dark:bg-[#1a1d2e] border-b border-border">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4">
            <span className="text-sm font-medium text-muted-foreground">
              {t("name") || "Game"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {t("description") || "Description"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {t("releaseDate") || "Release Date"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {t("status") || "Status"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {t("followers") || "Followers"}
            </span>
            <span className="text-sm font-medium text-muted-foreground text-end">
              {t("actions") || "Actions"}
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Gamepad2 className="size-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">{t("noGames") || "No games found"}</p>
              <p className="text-sm">{t("tryAdjusting") || "Try adjusting your filters"}</p>
            </div>
          ) : (
            games.map((game) => (
              <div
                key={game.id || game._id}
                onClick={() => router.push(`/dashboard/games-management/view/${game.id || game._id}`)}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-muted/30 dark:hover:bg-[#252a3d] transition-colors cursor-pointer"
              >
                {/* Game Name & Logo */}
                <div className="flex items-center gap-3 min-w-0">
                  {game?.logo?.light ? (
                    <img
                      src={game.logo.light}
                      alt={game.name}
                      className="size-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="size-5 text-green-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{game.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {game.slug || "-"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm text-muted-foreground truncate">
                  {truncateText(game.description)}
                </div>

                {/* Release Date */}
                <div className="text-sm">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {game.releaseDate
                      ? format(new Date(game.releaseDate), "MMM d, yyyy")
                      : "-"}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      game.isActive !== false
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {game.isActive !== false ? t("active") || "Active" : t("inactive") || "Inactive"}
                  </span>
                </div>

                {/* Followers */}
                <div className="text-sm">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Users className="size-3.5 text-muted-foreground" />
                    {game.followersCount || 0}
                  </div>
                </div>

                {/* Actions */}
                <ActionsDropdown
                  game={game}
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
function ActionsDropdown({ game, loadingId, onDelete, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);
  const router = useRouter();

  const gameId = game.id || game._id;
  const isLoading = loadingId === gameId;

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/dashboard/games-management/edit/${gameId}`);
  };

  const handleView = () => {
    setIsOpen(false);
    router.push(`/dashboard/games-management/view/${gameId}`);
  };

  const handleToggleActive = async () => {
    try {
      setTogglingActive(true);
      await toggleGameActive(gameId);
      toast.success(t("toggleActiveSuccess") || "Active status updated");
      setIsOpen(false);
    } catch (e) {
      toast.error(t("toggleActiveError") || "Failed to update active status");
    } finally {
      setTogglingActive(false);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(gameId, game.name);
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

            {/* Toggle Active */}
            <button
              onClick={handleToggleActive}
              disabled={togglingActive}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right disabled:opacity-50"
            >
              {togglingActive ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("updating") || "Updating..."}
                </>
              ) : game.isActive !== false ? (
                <>
                  <PowerOff className="size-4 text-red-500" />
                  {t("deactivate") || "Deactivate"}
                </>
              ) : (
                <>
                  <Power className="size-4 text-green-500" />
                  {t("activate") || "Activate"}
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

export default GamesTable;

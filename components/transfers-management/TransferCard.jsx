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
  User,
  Users,
  ArrowRight,
  DollarSign,
  Calendar,
  Gamepad2,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { deleteTransfer } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function TransferCard({ transfer, t, viewMode = "grid", onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();

  const formatFee = (fee, currency = "USD") => {
    if (!fee) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(fee);
  };

  const handleAction = async (action, actionName) => {
    setIsLoading(true);
    setLoadingAction(actionName);
    try {
      await action();
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/transfers-management/view/${transfer.id || transfer._id}`);
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this transfer?")) {
      return;
    }
    try {
      const result = await deleteTransfer(transfer.id || transfer._id);
      if (result.success) {
        toast.success(t("deleteSuccess") || "Transfer deleted");
        onRefresh?.();
      } else {
        toast.error(result.error || t("deleteError") || "Failed to delete");
      }
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete");
    }
  };

  const playerPhoto = getImgUrl(transfer.player?.photo?.light) || getImgUrl(transfer.player?.photo);
  const fromTeamLogo = getImgUrl(transfer.fromTeam?.logo?.light) || getImgUrl(transfer.fromTeam?.logo);
  const fromTeamLogoDark = getImgUrl(transfer.fromTeam?.logo?.dark);
  const toTeamLogo = getImgUrl(transfer.toTeam?.logo?.light) || getImgUrl(transfer.toTeam?.logo);
  const toTeamLogoDark = getImgUrl(transfer.toTeam?.logo?.dark);
  const gameLogo = getImgUrl(transfer.game?.logo?.light) || getImgUrl(transfer.game?.logo?.dark);

  // Grid View Card
  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group glass rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        {/* Header with Teams Transfer Visual */}
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a1d2e] dark:to-[#12141c] p-6">
          <div className="flex items-center justify-between gap-4">
            {/* From Team */}
            <div className="flex flex-col items-center text-center flex-1">
              {fromTeamLogo ? (
                <>
                  <img
                    src={fromTeamLogo}
                    alt={transfer.fromTeam?.name || ""}
                    className="size-12 rounded-lg object-contain dark:hidden"
                  />
                  <img
                    src={fromTeamLogoDark || fromTeamLogo}
                    alt={transfer.fromTeam?.name || ""}
                    className="size-12 rounded-lg object-contain hidden dark:block"
                  />
                </>
              ) : (
                <div className="size-12 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                  <User className="size-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate max-w-[80px]">
                {transfer.fromTeam?.name || t("freeAgent") || "Free Agent"}
              </span>
            </div>

            {/* Player & Arrow */}
            <div className="flex flex-col items-center">
              {playerPhoto ? (
                <img
                  src={playerPhoto}
                  alt={transfer.player?.nickname || ""}
                  className="size-16 rounded-full object-cover border-2 border-green-primary/30 shadow-sm"
                />
              ) : (
                <div className="size-16 rounded-full bg-green-primary/20 flex items-center justify-center border-2 border-green-primary/30">
                  <User className="size-7 text-green-primary" />
                </div>
              )}
              <ArrowRight className="size-5 text-green-primary mt-2" />
            </div>

            {/* To Team */}
            <div className="flex flex-col items-center text-center flex-1">
              {toTeamLogo ? (
                <>
                  <img
                    src={toTeamLogo}
                    alt={transfer.toTeam?.name || ""}
                    className="size-12 rounded-lg object-contain dark:hidden"
                  />
                  <img
                    src={toTeamLogoDark || toTeamLogo}
                    alt={transfer.toTeam?.name || ""}
                    className="size-12 rounded-lg object-contain hidden dark:block"
                  />
                </>
              ) : (
                <div className="size-12 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                  <Users className="size-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate max-w-[80px]">
                {transfer.toTeam?.name || "-"}
              </span>
            </div>
          </div>

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
                  className="bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black/70 text-gray-700 dark:text-white size-8 shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <MoreVertical className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href={`/dashboard/transfers-management/view/${transfer.id || transfer._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails") || "View Details"}
                  </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/transfers-management/edit/${transfer.id || transfer._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("edit") || "Edit"}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => handleAction(handleDelete, "delete")}
                  disabled={loadingAction === "delete"}
                >
                  <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("delete") || "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Player Name */}
          <h3 className="text-base font-bold text-foreground mb-2">
            {transfer.player?.nickname || "-"}
          </h3>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {/* Game */}
            {transfer.game && (
              <div className="flex items-center gap-1.5">
                {gameLogo ? (
                  <img src={gameLogo} alt={transfer.game.name} className="size-4 rounded" />
                ) : (
                  <Gamepad2 className="size-3.5" />
                )}
                <span>{transfer.game.name}</span>
              </div>
            )}

            {/* Fee */}
            {transfer.fee && (
              <div className="flex items-center gap-1">
                <DollarSign className="size-3.5 text-green-500" />
                <span className="text-green-500 font-medium">
                  {formatFee(transfer.fee, transfer.currency)}
                </span>
              </div>
            )}

            {/* Date */}
            {transfer.transferDate && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{format(new Date(transfer.transferDate), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View Card
  return (
    <div
      onClick={handleCardClick}
      className="group glass rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Player Photo */}
        <div className="relative size-14 sm:size-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a1d2e] dark:to-[#12141c] flex-shrink-0 border border-gray-200 dark:border-transparent">
          {playerPhoto ? (
            <img
              src={playerPhoto}
              alt={transfer.player?.nickname || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="size-7 text-gray-400 dark:text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-foreground truncate">
              {transfer.player?.nickname || "-"}
            </h3>
          </div>
          {/* Teams transfer info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate max-w-[100px]">
              {transfer.fromTeam?.name || t("freeAgent") || "Free Agent"}
            </span>
            <ArrowRight className="size-3.5 flex-shrink-0" />
            <span className="truncate max-w-[100px]">{transfer.toTeam?.name || "-"}</span>
          </div>
        </div>

        {/* Game Badge - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-4">
          {transfer.game && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-foreground text-sm">
              {gameLogo ? (
                <img src={gameLogo} alt={transfer.game.name} className="size-3.5 rounded" />
              ) : (
                <Gamepad2 className="size-3.5" />
              )}
              {transfer.game.name}
            </div>
          )}
        </div>

        {/* Fee - Hidden on mobile */}
        <div className="hidden md:flex items-center text-sm">
          {transfer.fee ? (
            <span className="font-medium text-green-500">
              {formatFee(transfer.fee, transfer.currency)}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>

        {/* Date - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            {transfer.transferDate
              ? format(new Date(transfer.transferDate), "MMM d, yyyy")
              : "-"}
          </span>
        </div>

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
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MoreVertical className="size-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href={`/dashboard/transfers-management/view/${transfer.id || transfer._id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("viewDetails") || "View Details"}
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/transfers-management/edit/${transfer.id || transfer._id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("edit") || "Edit"}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400"
                onClick={() => handleAction(handleDelete, "delete")}
                disabled={loadingAction === "delete"}
              >
                <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("delete") || "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default TransferCard;

"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  MoreVertical,
  Gamepad2,
  Power,
  PowerOff,
  Eye,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";

function GameCard({ game, onDelete, onToggleActive, t, viewMode = "grid" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();
  const { hasPermission } = usePermissions();

  // Permission checks
  const canUpdate = hasPermission(ENTITIES.GAME, ACTIONS.UPDATE);
  const canDelete = hasPermission(ENTITIES.GAME, ACTIONS.DELETE);

  const gameImage = game.logo?.light || game.logo?.dark;
  const coverImage = game.coverImage?.light || game.coverImage?.dark;

  const handleAction = async (action, actionName) => {
    setIsLoading(true);
    setLoadingAction(actionName);
    try {
      await action();
      toast.success(t(`${actionName}Success`));
    } catch (error) {
      toast.error(t(`${actionName}Error`));
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/games-management/view/${game.id || game._id}`);
  };

  // Grid View Card
  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer"
      >
        {/* Cover/Logo Image */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1a1d2e] to-[#12141c]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : gameImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1d2e] to-[#12141c]">
              <img
                src={gameImage}
                alt={game.name}
                className="max-w-[60%] max-h-[60%] object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className="size-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
            <Badge
              className={`border-0 gap-1 ${
                game.isActive !== false
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}
            >
              {game.isActive !== false ? (
                <>
                  <Power className="size-3" />
                  {t("active") || "Active"}
                </>
              ) : (
                <>
                  <PowerOff className="size-3" />
                  {t("inactive") || "Inactive"}
                </>
              )}
            </Badge>
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
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white size-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner className="size-4" />
                  ) : (
                    <MoreVertical className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href={`/dashboard/games-management/view/${game.id || game._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails") || "View Details"}
                  </DropdownMenuItem>
                </Link>
                {canUpdate && (
                  <Link href={`/dashboard/games-management/edit/${game.id || game._id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("edit") || "Edit"}
                    </DropdownMenuItem>
                  </Link>
                )}
                {canUpdate && <DropdownMenuSeparator />}
                {canUpdate && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleAction(() => onToggleActive(game.id || game._id), "toggleActive")}
                    disabled={loadingAction === "toggleActive"}
                  >
                    {game.isActive !== false ? (
                      <>
                        <PowerOff className="size-4 mr-2 rtl:mr-0 rtl:ml-2 text-red-500" />
                        {t("deactivate") || "Deactivate"}
                      </>
                    ) : (
                      <>
                        <Power className="size-4 mr-2 rtl:mr-0 rtl:ml-2 text-green-500" />
                        {t("activate") || "Activate"}
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {canDelete && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => handleAction(() => onDelete(game.id || game._id, game.name), "delete")}
                    disabled={loadingAction === "delete"}
                  >
                    <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("delete") || "Delete"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Logo and Name */}
          <div className="flex items-center gap-3 mb-2">
            {gameImage && (
              <img
                src={gameImage}
                alt={game.name}
                className="size-8 rounded-lg object-contain"
              />
            )}
            <h3 className="text-base font-bold text-foreground truncate">
              {game.name}
            </h3>
          </div>

          {/* Slug */}
          {game.slug && (
            <p className="text-xs text-muted-foreground mb-3">{game.slug}</p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* Release Date */}
            {game.releaseDate && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{format(new Date(game.releaseDate), "MMM d, yyyy")}</span>
              </div>
            )}

            {/* Followers */}
            <div className="flex items-center gap-1">
              <Users className="size-3.5" />
              <span>{game.followersCount || 0} {t("followers") || "followers"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View Card
  return (
    <div
      onClick={handleCardClick}
      className="group glass rounded-xl overflow-hidden border border-transparent dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Game Image */}
        <div className="relative size-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1d2e] to-[#12141c] flex-shrink-0">
          {gameImage ? (
            <img
              src={gameImage}
              alt={game.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className="size-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-foreground truncate">
              {game.name}
            </h3>
            <Badge
              className={`text-xs border-0 ${
                game.isActive !== false
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {game.isActive !== false ? t("active") || "Active" : t("inactive") || "Inactive"}
            </Badge>
          </div>
          {game.slug && (
            <p className="text-sm text-muted-foreground truncate">
              {game.slug}
            </p>
          )}
        </div>

        {/* Release Date */}
        <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
          {game.releaseDate && (
            <div className="flex items-center gap-1">
              <Calendar className="size-4" />
              <span>{format(new Date(game.releaseDate), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        {/* Followers */}
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{game.followersCount || 0}</span>
          </div>
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
                  <Spinner className="size-4" />
                ) : (
                  <MoreVertical className="size-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href={`/dashboard/games-management/view/${game.id || game._id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("viewDetails") || "View Details"}
                </DropdownMenuItem>
              </Link>
              {canUpdate && (
                <Link href={`/dashboard/games-management/edit/${game.id || game._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("edit") || "Edit"}
                  </DropdownMenuItem>
                </Link>
              )}
              {canUpdate && <DropdownMenuSeparator />}
              {canUpdate && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleAction(() => onToggleActive(game.id || game._id), "toggleActive")}
                  disabled={loadingAction === "toggleActive"}
                >
                  {game.isActive !== false ? (
                    <>
                      <PowerOff className="size-4 mr-2 rtl:mr-0 rtl:ml-2 text-red-500" />
                      {t("deactivate") || "Deactivate"}
                    </>
                  ) : (
                    <>
                      <Power className="size-4 mr-2 rtl:mr-0 rtl:ml-2 text-green-500" />
                      {t("activate") || "Activate"}
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {canDelete && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => handleAction(() => onDelete(game.id || game._id, game.name), "delete")}
                  disabled={loadingAction === "delete"}
                >
                  <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("delete") || "Delete"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default GameCard;

"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  Edit,
  Trash2,
  MoreVertical,
  User,
  Users,
  Calendar,
  Globe,
  Gamepad2,
  Award,
  Link as LinkIcon,
  Star,
  Eye,
  DollarSign,
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

function PlayerCard({ player, onDelete, t, viewMode = "grid" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();
  const { hasPermission } = usePermissions();

  // Permission checks
  const canUpdate = hasPermission(ENTITIES.PLAYER, ACTIONS.UPDATE);
  const canDelete = hasPermission(ENTITIES.PLAYER, ACTIONS.DELETE);

  const playerImage = player.photo?.light || player.photo?.dark;
  const teamImage = player.team?.logo?.light || player.team?.logo?.dark;

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(player.dateOfBirth);

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
    router.push(`/dashboard/player-management/view/${player.id}`);
  };

  // Get country flag
  const countryFlag = player.country?.code
    ? `https://flagcdn.com/24x18/${player.country.code.toLowerCase()}.png`
    : null;

  // Format earnings
  const formatEarnings = (earnings) => {
    if (!earnings) return null;
    if (earnings >= 1000000) {
      return `$${(earnings / 1000000).toFixed(1)}M`;
    }
    if (earnings >= 1000) {
      return `$${(earnings / 1000).toFixed(0)}K`;
    }
    return `$${earnings}`;
  };

  // Grid View Card
  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer"
      >
        {/* Player Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1d2e] to-[#12141c]">
          {playerImage ? (
            <img
              src={playerImage}
              alt={player.nickname}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="size-20 text-muted-foreground/30" />
            </div>
          )}

          {/* Game Badge Overlay */}
          {player.game && (
            <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
              <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 gap-1.5">
                {player.game.logo?.light ? (
                  <img
                    src={player.game.logo.light}
                    alt={player.game.name}
                    className="size-3.5 rounded"
                  />
                ) : (
                  <Gamepad2 className="size-3.5" />
                )}
                {player.game.name}
              </Badge>
            </div>
          )}

          {/* Team Badge Overlay */}
          {player.team && (
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                {teamImage ? (
                  <img
                    src={teamImage}
                    alt={player.team.name}
                    className="size-5 rounded"
                  />
                ) : (
                  <Users className="size-4 text-white" />
                )}
                <span className="text-xs text-white font-medium">
                  {player.team.name}
                </span>
              </div>
            </div>
          )}

          {/* Free Agent Badge */}
          {!player.team && (
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-0">
                {t("freeAgent") || "Free Agent"}
              </Badge>
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
                <Link href={`/dashboard/player-management/view/${player.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails") || "View Details"}
                  </DropdownMenuItem>
                </Link>
                {canUpdate && (
                  <Link href={`/dashboard/player-management/edit/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                  </Link>
                )}
                {canUpdate && <DropdownMenuSeparator />}
                {canUpdate && (
                  <>
                    <Link href={`/dashboard/player-management/awards/${player.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Award className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t("awards")}
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/player-management/links/${player.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <LinkIcon className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t("links")}
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/player-management/favorites-characters/${player.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Star className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t("favoritesCharacters")}
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                {canDelete && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => handleAction(() => onDelete(player.id), "delete")}
                    disabled={loadingAction === "delete"}
                  >
                    <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Nickname & Country */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground truncate">
              {player.nickname}
            </h3>
            {countryFlag && (
              <img
                src={countryFlag}
                alt={player.country?.name || player.country?.code}
                className="size-5 rounded-sm object-cover"
              />
            )}
          </div>

          {/* Real Name */}
          {(player.firstName || player.lastName) && (
            <p className="text-sm text-muted-foreground mb-3">
              {player.firstName} {player.lastName}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {age && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{age} {t("yearsOld") || "y/o"}</span>
              </div>
            )}
            {player.totalEarnings > 0 && (
              <div className="flex items-center gap-1 text-green-500">
                <DollarSign className="size-3.5" />
                <span>{formatEarnings(player.totalEarnings)}</span>
              </div>
            )}
            {player.role && (
              <Badge variant="secondary" className="text-xs">
                {player.role}
              </Badge>
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
      className="group glass rounded-xl overflow-hidden border border-transparent dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Player Image */}
        <div className="relative size-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1d2e] to-[#12141c] flex-shrink-0">
          {playerImage ? (
            <img
              src={playerImage}
              alt={player.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="size-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-foreground truncate">
              {player.nickname}
            </h3>
            {countryFlag && (
              <img
                src={countryFlag}
                alt={player.country?.name || player.country?.code}
                className="size-4 rounded-sm object-cover"
              />
            )}
            {player.role && (
              <Badge variant="secondary" className="text-xs">
                {player.role}
              </Badge>
            )}
          </div>
          {(player.firstName || player.lastName) && (
            <p className="text-sm text-muted-foreground truncate">
              {player.firstName} {player.lastName}
            </p>
          )}
        </div>

        {/* Game & Team */}
        <div className="hidden sm:flex items-center gap-4">
          {player.game && (
            <Badge className="bg-muted/50 text-foreground border-0 gap-1.5">
              {player.game.logo?.light ? (
                <img
                  src={player.game.logo.light}
                  alt={player.game.name}
                  className="size-3.5 rounded"
                />
              ) : (
                <Gamepad2 className="size-3.5" />
              )}
              {player.game.name}
            </Badge>
          )}
          {player.team ? (
            <div className="flex items-center gap-1.5">
              {teamImage ? (
                <img
                  src={teamImage}
                  alt={player.team.name}
                  className="size-5 rounded"
                />
              ) : (
                <Users className="size-4 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {player.team.name}
              </span>
            </div>
          ) : (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-0">
              {t("freeAgent") || "Free Agent"}
            </Badge>
          )}
        </div>

        {/* Age & Earnings */}
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          {age && (
            <div className="flex items-center gap-1">
              <Calendar className="size-4" />
              <span>{age}</span>
            </div>
          )}
          {player.totalEarnings > 0 && (
            <div className="flex items-center gap-1 text-green-500">
              <DollarSign className="size-4" />
              <span>{formatEarnings(player.totalEarnings)}</span>
            </div>
          )}
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
              <Link href={`/dashboard/player-management/view/${player.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("viewDetails") || "View Details"}
                </DropdownMenuItem>
              </Link>
              {canUpdate && (
                <Link href={`/dashboard/player-management/edit/${player.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("edit")}
                  </DropdownMenuItem>
                </Link>
              )}
              {canUpdate && <DropdownMenuSeparator />}
              {canUpdate && (
                <>
                  <Link href={`/dashboard/player-management/awards/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Award className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("awards")}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/player-management/links/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <LinkIcon className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("links")}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/player-management/favorites-characters/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Star className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("favoritesCharacters")}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
              {canDelete && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => handleAction(() => onDelete(player.id), "delete")}
                  disabled={loadingAction === "delete"}
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

export default PlayerCard;

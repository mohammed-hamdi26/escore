"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Calendar,
  Globe,
  Gamepad2,
  Award,
  Link as LinkIcon,
  Eye,
  Heart,
  MapPin,
  CheckCircle,
  XCircle,
  Trophy,
  Hash,
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

function TeamCard({ team, onDelete, t, viewMode = "grid" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();
  const { hasPermission } = usePermissions();

  // Permission checks
  const canUpdate = hasPermission(ENTITIES.TEAM, ACTIONS.UPDATE);
  const canDelete = hasPermission(ENTITIES.TEAM, ACTIONS.DELETE);

  const teamLogo = team.logo?.light || team.logo?.dark;

  // Get country flag
  const countryFlag = team.country?.code
    ? `https://flagcdn.com/24x18/${team.country.code.toLowerCase()}.png`
    : null;

  // Format followers count
  const formatFollowers = (count) => {
    if (!count) return null;
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  // Format founded date
  const formatFoundedYear = (date) => {
    if (!date) return null;
    return new Date(date).getFullYear();
  };

  const handleAction = async (action, actionName) => {
    setIsLoading(true);
    setLoadingAction(actionName);
    try {
      await action();
      toast.success(t(`${actionName}Success`) || `${actionName} successful`);
    } catch (error) {
      toast.error(t(`${actionName}Error`) || `${actionName} failed`);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/teams-management/view/${team.id}`);
  };

  // Grid View Card
  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-green-primary/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-primary/5"
      >
        {/* Logo Area */}
        <div className="relative aspect-[4/3] bg-gradient-to-b from-[#1a1d2e] to-[#12141c] flex items-center justify-center p-4">
          {teamLogo ? (
            <img
              src={teamLogo}
              alt={team.name}
              className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="size-20 rounded-xl bg-white/5 flex items-center justify-center">
              <Users className="size-10 text-muted-foreground/40" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
            {team.isActive !== false ? (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 gap-1.5 backdrop-blur-sm">
                <CheckCircle className="size-3" />
                {t("active") || "Active"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 gap-1.5 backdrop-blur-sm">
                <XCircle className="size-3" />
                {t("inactive") || "Inactive"}
              </Badge>
            )}
          </div>

          {/* World Ranking Badge */}
          {team.worldRanking && (
            <div className="absolute top-3 right-12 rtl:right-auto rtl:left-12">
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 gap-1 backdrop-blur-sm">
                <Hash className="size-3" />
                {team.worldRanking}
              </Badge>
            </div>
          )}

          {/* Actions Menu */}
          <div
            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white size-8 border border-white/10"
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
                <Link href={`/dashboard/teams-management/view/${team.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails") || "View Details"}
                  </DropdownMenuItem>
                </Link>
                {canUpdate && (
                  <Link href={`/dashboard/teams-management/edit/${team.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("edit") || "Edit"}
                    </DropdownMenuItem>
                  </Link>
                )}
                {canUpdate && <DropdownMenuSeparator />}
                {canUpdate && (
                  <>
                    <Link href={`/dashboard/teams-management/awards/${team.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Award className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t("awards") || "Awards"}
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/teams-management/links/${team.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <LinkIcon className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t("links") || "Links"}
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/teams-management/lineups/${team.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Users className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t("lineups") || "Lineups"}
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                {canDelete && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => handleAction(() => onDelete(team.id), "delete")}
                    disabled={loadingAction === "delete"}
                  >
                    <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("delete") || "Delete"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Region Badge - Bottom */}
          {team.region && (
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
              <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/10 gap-1.5">
                <MapPin className="size-3" />
                {team.region}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Team Name & Country */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground truncate group-hover:text-green-primary transition-colors">
                  {team.name}
                </h3>
                {countryFlag && (
                  <img
                    src={countryFlag}
                    alt={team.country?.name || team.country?.code}
                    className="size-5 rounded-sm object-cover ring-1 ring-white/10"
                  />
                )}
              </div>
              {team.shortName && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {team.shortName}
                </p>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs">
            {team.foundedDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{formatFoundedYear(team.foundedDate)}</span>
              </div>
            )}
            {team.followersCount > 0 && (
              <div className="flex items-center gap-1.5 text-pink-500">
                <Heart className="size-3.5 fill-current" />
                <span className="font-medium">{formatFollowers(team.followersCount)}</span>
              </div>
            )}
            {team.players?.length > 0 && (
              <div className="flex items-center gap-1.5 text-blue-400">
                <Users className="size-3.5" />
                <span>{team.players.length}</span>
              </div>
            )}
            {team.tournaments?.length > 0 && (
              <div className="flex items-center gap-1.5 text-amber-400">
                <Trophy className="size-3.5" />
                <span>{team.tournaments.length}</span>
              </div>
            )}
          </div>

          {/* Games Row */}
          {team.games?.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {team.games.slice(0, 3).map((game) => (
                <Badge
                  key={game.id || game._id}
                  variant="secondary"
                  className="text-xs gap-1.5 bg-white/5 hover:bg-white/10 border-0"
                >
                  {game.logo?.light ? (
                    <img
                      src={game.logo.light}
                      alt={game.name}
                      className="size-3.5 rounded"
                    />
                  ) : (
                    <Gamepad2 className="size-3.5" />
                  )}
                  {game.name}
                </Badge>
              ))}
              {team.games.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-white/5 border-0">
                  +{team.games.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View Card
  return (
    <div
      onClick={handleCardClick}
      className="group glass rounded-xl overflow-hidden border border-white/5 hover:border-green-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-primary/5"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Team Logo */}
        <div className="relative size-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1d2e] to-[#12141c] flex-shrink-0 ring-1 ring-white/10">
          {teamLogo ? (
            <img
              src={teamLogo}
              alt={team.name}
              className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="size-7 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-foreground truncate group-hover:text-green-primary transition-colors">
              {team.name}
            </h3>
            {countryFlag && (
              <img
                src={countryFlag}
                alt={team.country?.name || team.country?.code}
                className="size-4 rounded-sm object-cover ring-1 ring-white/10"
              />
            )}
            {team.isActive !== false ? (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs gap-1">
                <CheckCircle className="size-3" />
                {t("active") || "Active"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs gap-1">
                <XCircle className="size-3" />
                {t("inactive") || "Inactive"}
              </Badge>
            )}
            {team.worldRanking && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs gap-1">
                <Hash className="size-3" />
                {team.worldRanking}
              </Badge>
            )}
          </div>
          {team.shortName && (
            <p className="text-sm text-muted-foreground truncate">
              {team.shortName}
            </p>
          )}
        </div>

        {/* Region & Games */}
        <div className="hidden sm:flex items-center gap-3">
          {team.region && (
            <Badge className="bg-white/5 text-foreground border border-white/10 gap-1.5">
              <MapPin className="size-3.5" />
              {team.region}
            </Badge>
          )}
          {team.games?.length > 0 && (
            <div className="flex items-center gap-1.5">
              {team.games.slice(0, 2).map((game) => (
                <Badge
                  key={game.id || game._id}
                  variant="secondary"
                  className="text-xs gap-1.5 bg-white/5 border-0"
                >
                  {game.logo?.light ? (
                    <img
                      src={game.logo.light}
                      alt={game.name}
                      className="size-3.5 rounded"
                    />
                  ) : (
                    <Gamepad2 className="size-3.5" />
                  )}
                  {game.name}
                </Badge>
              ))}
              {team.games.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-white/5 border-0">
                  +{team.games.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {team.foundedDate && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-4" />
              <span>{formatFoundedYear(team.foundedDate)}</span>
            </div>
          )}
          {team.followersCount > 0 && (
            <div className="flex items-center gap-1.5 text-pink-500">
              <Heart className="size-4 fill-current" />
              <span className="font-medium">{formatFollowers(team.followersCount)}</span>
            </div>
          )}
          {team.players?.length > 0 && (
            <div className="flex items-center gap-1.5 text-blue-400">
              <Users className="size-4" />
              <span>{team.players.length}</span>
            </div>
          )}
          {team.tournaments?.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <Trophy className="size-4" />
              <span>{team.tournaments.length}</span>
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
                className="text-muted-foreground hover:text-foreground hover:bg-white/5"
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
              <Link href={`/dashboard/teams-management/view/${team.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("viewDetails") || "View Details"}
                </DropdownMenuItem>
              </Link>
              {canUpdate && (
                <Link href={`/dashboard/teams-management/edit/${team.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("edit") || "Edit"}
                  </DropdownMenuItem>
                </Link>
              )}
              {canUpdate && <DropdownMenuSeparator />}
              {canUpdate && (
                <>
                  <Link href={`/dashboard/teams-management/awards/${team.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Award className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("awards") || "Awards"}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/teams-management/links/${team.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <LinkIcon className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("links") || "Links"}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/teams-management/lineups/${team.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Users className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("lineups") || "Lineups"}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
              {canDelete && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => handleAction(() => onDelete(team.id), "delete")}
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

export default TeamCard;

"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getImgUrl } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import {
  Edit,
  Trash2,
  MoreVertical,
  Building2,
  Calendar,
  Heart,
  Eye,
  MapPin,
  CheckCircle,
  XCircle,
  Users,
  Gamepad2,
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
import {
  usePermissions,
  ENTITIES,
  ACTIONS,
} from "@/contexts/PermissionsContext";

function ClubCard({ club, onDelete, t, viewMode = "grid" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission(ENTITIES.CLUB, ACTIONS.UPDATE);
  const canDelete = hasPermission(ENTITIES.CLUB, ACTIONS.DELETE);

  const clubLogo = getImgUrl(club.logo?.light, "medium") || getImgUrl(club.logo?.dark, "medium");

  const countryFlag = club.country?.code
    ? `https://flagcdn.com/24x18/${club.country.code.toLowerCase()}.png`
    : null;

  const formatFollowers = (count) => {
    if (!count) return null;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

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
    router.push(`/dashboard/clubs-management/view/${club.id}`);
  };

  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-primary/5"
      >
        {/* Logo Area */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a1d2e] dark:to-[#12141c] flex items-center justify-center p-4">
          {clubLogo ? (
            <img
              src={clubLogo}
              alt={club.name}
              className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="size-20 rounded-xl bg-gray-200/50 dark:bg-white/5 flex items-center justify-center">
              <Building2 className="size-10 text-muted-foreground/40" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
            {club.isActive !== false ? (
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 gap-1.5 backdrop-blur-sm">
                <CheckCircle className="size-3" />
                {t("active") || "Active"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 gap-1.5 backdrop-blur-sm">
                <XCircle className="size-3" />
                {t("inactive") || "Inactive"}
              </Badge>
            )}
          </div>

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
                  className="bg-black/30 dark:bg-black/60 backdrop-blur-md hover:bg-black/50 dark:hover:bg-black/80 text-white size-8 border border-white/20 dark:border-white/10"
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
                <Link href={`/dashboard/clubs-management/view/${club.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails") || "View Details"}
                  </DropdownMenuItem>
                </Link>
                {canUpdate && (
                  <Link href={`/dashboard/clubs-management/edit/${club.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("edit") || "Edit"}
                    </DropdownMenuItem>
                  </Link>
                )}
                {canDelete && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() =>
                      handleAction(() => onDelete(club.id), "delete")
                    }
                    disabled={loadingAction === "delete"}
                  >
                    <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("delete") || "Delete"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Region Badge */}
          {club.region && (
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
              <Badge className="bg-white/80 dark:bg-black/60 backdrop-blur-md text-gray-700 dark:text-white border border-gray-200/50 dark:border-white/10 gap-1.5">
                <MapPin className="size-3" />
                {club.region}
              </Badge>
            </div>
          )}

          {/* Followers Badge */}
          {club.followersCount > 0 && (
            <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3">
              <Badge className="bg-white/80 dark:bg-black/60 backdrop-blur-md text-pink-500 dark:text-pink-400 border border-gray-200/50 dark:border-white/10 gap-1.5">
                <Heart className="size-3 fill-current" />
                {formatFollowers(club.followersCount)}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground truncate group-hover:text-green-primary transition-colors">
                  {club.name}
                </h3>
                {countryFlag && (
                  <img
                    src={countryFlag}
                    alt={club.country?.name || club.country?.code}
                    className="size-5 rounded-sm object-cover ring-1 ring-gray-200 dark:ring-white/10"
                  />
                )}
              </div>
              {club.shortName && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {club.shortName}
                </p>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
            {club.founded && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{formatFoundedYear(club.founded)}</span>
              </div>
            )}
            {club.followersCount > 0 && (
              <div className="flex items-center gap-1.5 text-pink-500">
                <Heart className="size-3.5 fill-current" />
                <span className="font-medium">
                  {formatFollowers(club.followersCount)}
                </span>
              </div>
            )}
            {club.teams?.length > 0 && (
              <div className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
                <Users className="size-3.5" />
                <span>
                  {club.teams.length} {t("teams") || "teams"}
                </span>
              </div>
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
      className="group rounded-xl p-4 bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all duration-200 cursor-pointer flex items-center gap-4"
    >
      {/* Logo */}
      <div className="size-12 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
        {clubLogo ? (
          <img
            src={clubLogo}
            alt={club.name}
            className="size-full object-contain"
          />
        ) : (
          <Building2 className="size-6 text-muted-foreground/40" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate group-hover:text-green-primary transition-colors">
            {club.name}
          </h3>
          {club.shortName && (
            <span className="text-sm text-muted-foreground">
              ({club.shortName})
            </span>
          )}
          {countryFlag && (
            <img
              src={countryFlag}
              alt={club.country?.name}
              className="size-4 rounded-sm object-cover"
            />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          {club.region && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {club.region}
            </span>
          )}
          {club.teams?.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {club.teams.length} {t("teams") || "teams"}
            </span>
          )}
        </div>
      </div>

      {/* Region Badge */}
      {club.region && (
        <div className="shrink-0">
          <Badge variant="outline" className="bg-gray-50 dark:bg-muted/50 text-muted-foreground border-gray-200 dark:border-white/10 gap-1">
            <MapPin className="size-3" />
            {club.region}
          </Badge>
        </div>
      )}

      {/* Followers */}
      {club.followersCount > 0 && (
        <div className="shrink-0 flex items-center gap-1.5 text-pink-500 text-xs">
          <Heart className="size-3.5 fill-current" />
          <span className="font-medium">{formatFollowers(club.followersCount)}</span>
        </div>
      )}

      {/* Status */}
      <div className="shrink-0">
        {club.isActive !== false ? (
          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 gap-1">
            <CheckCircle className="size-3" />
            {t("active") || "Active"}
          </Badge>
        ) : (
          <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 gap-1">
            <XCircle className="size-3" />
            {t("inactive") || "Inactive"}
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <Link href={`/dashboard/clubs-management/view/${club.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("viewDetails") || "View Details"}
              </DropdownMenuItem>
            </Link>
            {canUpdate && (
              <Link href={`/dashboard/clubs-management/edit/${club.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("edit") || "Edit"}
                </DropdownMenuItem>
              </Link>
            )}
            {canDelete && <DropdownMenuSeparator />}
            {canDelete && (
              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400"
                onClick={() =>
                  handleAction(() => onDelete(club.id), "delete")
                }
              >
                <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("delete") || "Delete"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ClubCard;

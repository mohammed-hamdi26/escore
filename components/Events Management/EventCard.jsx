"use client";

import { Link } from "@/i18n/navigation";
import {
  CalendarDays,
  Edit,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
  Trophy,
  Building2,
  Globe,
  DollarSign,
  Star,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";
import { getImgUrl } from "@/lib/utils";
import Image from "next/image";
import SelectableCheckbox from "../ui app/SelectableCheckbox";

const STATUS_COLORS = {
  upcoming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ongoing: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount, currency = "USD") {
  if (!amount) return null;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function EventCard({ event, viewMode = "grid", onDelete, t, isSelected, onToggleSelect, selectionMode }) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(ENTITIES.EVENT, ACTIONS.UPDATE);
  const canDelete = hasPermission(ENTITIES.EVENT, ACTIONS.DELETE);

  const eventLogo = getImgUrl(event.logo?.light, "medium") || getImgUrl(event.logo?.dark, "medium");
  const countryFlag = event.country?.code
    ? `https://flagcdn.com/24x18/${event.country.code.toLowerCase()}.png`
    : null;

  if (viewMode === "list") {
    return (
      <div className="group relative flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all duration-200">
        <SelectableCheckbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          selectionMode={selectionMode}
          className="relative top-auto left-auto opacity-100 flex-shrink-0"
        />
        <div className="relative shrink-0 size-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
          {eventLogo ? (
            <Image
              src={eventLogo}
              alt={event.name}
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          ) : (
            <CalendarDays className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/events-management/view/${event.id}`}
            className="font-semibold text-foreground hover:text-green-primary transition-colors truncate block"
          >
            {event.name}
          </Link>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {event.location}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {event.tournamentsCount > 0 && (
            <span className="flex items-center gap-1">
              <Trophy className="size-3" />
              {event.tournamentsCount}
            </span>
          )}
          {event.clubsCount > 0 && (
            <span className="flex items-center gap-1">
              <Building2 className="size-3" />
              {event.clubsCount}
            </span>
          )}
        </div>

        {event.isFeatured && (
          <Star className="size-4 text-yellow-500 fill-yellow-500 shrink-0" />
        )}

        <Badge
          variant="outline"
          className={`text-[10px] shrink-0 ${STATUS_COLORS[event.status] || STATUS_COLORS.upcoming}`}
        >
          {t(event.status) || event.status}
        </Badge>

        {event.isActive === false && (
          <Badge variant="outline" className="text-[9px] shrink-0 bg-red-500/10 text-red-400 border-red-500/20">
            Inactive
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/events-management/view/${event.id}`}>
                <Eye className="size-4 rtl:ml-2 ltr:mr-2" />
                {t("view") || "View Details"}
              </Link>
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events-management/edit/${event.id}`}>
                  <Edit className="size-4 rtl:ml-2 ltr:mr-2" />
                  {t("edit") || "Edit"}
                </Link>
              </DropdownMenuItem>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => onDelete(event.id)}
                >
                  <Trash2 className="size-4 rtl:ml-2 ltr:mr-2" />
                  {t("delete") || "Delete"}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-primary/5">
      <SelectableCheckbox
        checked={isSelected}
        onCheckedChange={onToggleSelect}
        selectionMode={selectionMode}
        className="top-3 left-3 rtl:left-auto rtl:right-3 z-20"
      />
      {/* Header with logo */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/5 dark:to-white/[0.02] flex items-center justify-center">
        {eventLogo ? (
          <Image
            src={eventLogo}
            alt={event.name}
            width={80}
            height={80}
            className="size-20 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <CalendarDays className="size-12 text-muted-foreground/50" />
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
          <Badge
            variant="outline"
            className={`text-[10px] ${STATUS_COLORS[event.status] || STATUS_COLORS.upcoming}`}
          >
            {t(event.status) || event.status}
          </Badge>
        </div>

        {/* Featured star */}
        {event.isFeatured && (
          <Star className="absolute top-3.5 right-12 rtl:right-auto rtl:left-12 size-4 text-yellow-500 fill-yellow-500" />
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors">
              <MoreVertical className="size-4 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events-management/view/${event.id}`}>
                  <Eye className="size-4 rtl:ml-2 ltr:mr-2" />
                  {t("view") || "View Details"}
                </Link>
              </DropdownMenuItem>
              {canEdit && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/events-management/edit/${event.id}`}>
                    <Edit className="size-4 rtl:ml-2 ltr:mr-2" />
                    {t("edit") || "Edit"}
                  </Link>
                </DropdownMenuItem>
              )}
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => onDelete(event.id)}
                  >
                    <Trash2 className="size-4 rtl:ml-2 ltr:mr-2" />
                    {t("delete") || "Delete"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Prize pool badge */}
        {event.prizePool > 0 && (
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
            <Badge
              variant="outline"
              className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20"
            >
              <DollarSign className="size-3 mr-0.5" />
              {formatCurrency(event.prizePool, event.currency)}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <Link
        href={`/dashboard/events-management/view/${event.id}`}
        className="block p-4"
      >
        <h3 className="font-semibold text-foreground truncate group-hover:text-green-primary transition-colors">
          {event.name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3" />
          <span>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span className="truncate">{event.location}</span>
            {countryFlag && (
              <Image
                src={countryFlag}
                alt={event.country?.name}
                width={16}
                height={16}
                className="size-4 rounded-sm"
              />
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-white/5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Trophy className="size-3" />
            {event.tournamentsCount || 0} {t("tournaments") || "Tournaments"}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="size-3" />
            {event.clubsCount || 0} {t("clubs") || "Clubs"}
          </span>
          {event.clubChampionship?.enabled && (
            <Badge
              variant="outline"
              className="text-[9px] bg-purple-500/10 text-purple-500 border-purple-500/20"
            >
              CC
            </Badge>
          )}
          {event.isActive === false && (
            <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20">
              Inactive
            </Badge>
          )}
        </div>
      </Link>
    </div>
  );
}

export default EventCard;

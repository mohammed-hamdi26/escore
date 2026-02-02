"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Trophy,
  Calendar,
  MapPin,
  Globe,
  Users,
  Coins,
  Award,
  Star,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Pencil,
  ArrowLeft,
  Tv,
  Link as LinkIcon,
  FileText,
  Wifi,
  WifiOff,
  Power,
  Eye,
  CalendarRange,
} from "lucide-react";

// Status badge colors
const STATUS_CONFIG = {
  upcoming: { color: "bg-blue-500/10 text-blue-500 border-blue-500/30", icon: Clock },
  ongoing: { color: "bg-green-500/10 text-green-500 border-green-500/30", icon: Play },
  completed: { color: "bg-purple-500/10 text-purple-500 border-purple-500/30", icon: CheckCircle2 },
  cancelled: { color: "bg-red-500/10 text-red-500 border-red-500/30", icon: XCircle },
};

// Tier badge colors
const TIER_CONFIG = {
  S: { color: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 border-yellow-500/30", badge: "bg-gradient-to-r from-yellow-400 to-orange-500" },
  A: { color: "bg-purple-500/10 text-purple-500 border-purple-500/30", badge: "bg-purple-500" },
  B: { color: "bg-blue-500/10 text-blue-500 border-blue-500/30", badge: "bg-blue-500" },
};

function TournamentDetails({ tournament }) {
  const t = useTranslations("TournamentDetails");

  const statusConfig = STATUS_CONFIG[tournament.status] || STATUS_CONFIG.upcoming;
  const StatusIcon = statusConfig.icon;
  const tierConfig = TIER_CONFIG[tournament.tier] || TIER_CONFIG.B;

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP");
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: tournament.currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/tournaments-management">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "Tournament Details"}</h1>
        </div>
        <Link href={`/dashboard/tournaments-management/edit/${tournament.id || tournament._id}`}>
          <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
            <Pencil className="size-4" />
            {t("edit") || "Edit Tournament"}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tournament Header Card */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                {tournament.logo?.light ? (
                  <img
                    src={tournament.logo.light}
                    alt={tournament.name}
                    className="size-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="size-24 rounded-2xl bg-green-primary/10 flex items-center justify-center ring-2 ring-green-primary/20">
                    <Trophy className="size-10 text-green-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground truncate">{tournament.name}</h2>
                  {tournament.isFeatured && (
                    <Star className="size-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>

                {tournament.organizer && (
                  <p className="text-muted-foreground mb-3">{t("by") || "by"} {tournament.organizer}</p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                    <StatusIcon className="size-4" />
                    {t(tournament.status) || tournament.status}
                  </span>

                  {/* Tier Badge */}
                  {tournament.tier && (
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${tierConfig.color}`}>
                      <Award className="size-4" />
                      {tournament.tier}-Tier
                    </span>
                  )}

                  {/* Online/Offline */}
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    tournament.isOnline
                      ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/30"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                  }`}>
                    {tournament.isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
                    {tournament.isOnline ? t("online") || "Online" : t("offline") || "Offline"}
                  </span>

                  {/* Active Status */}
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    tournament.isActive
                      ? "bg-green-500/10 text-green-500 border-green-500/30"
                      : "bg-red-500/10 text-red-500 border-red-500/30"
                  }`}>
                    <Power className="size-4" />
                    {tournament.isActive ? t("active") || "Active" : t("inactive") || "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {tournament.description && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-5 text-green-primary" />
                {t("description") || "Description"}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{tournament.description}</p>
            </div>
          )}

          {/* Schedule */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-green-primary" />
              {t("schedule") || "Schedule"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label={t("startDate") || "Start Date"}
                value={formatDate(tournament.startDate)}
                icon={<CalendarRange className="size-4" />}
              />
              <InfoItem
                label={t("endDate") || "End Date"}
                value={formatDate(tournament.endDate)}
                icon={<CalendarRange className="size-4" />}
              />
              {tournament.registrationStartDate && (
                <InfoItem
                  label={t("registrationStart") || "Registration Start"}
                  value={formatDate(tournament.registrationStartDate)}
                  icon={<Clock className="size-4" />}
                />
              )}
              {tournament.registrationEndDate && (
                <InfoItem
                  label={t("registrationEnd") || "Registration End"}
                  value={formatDate(tournament.registrationEndDate)}
                  icon={<Clock className="size-4" />}
                />
              )}
            </div>
          </div>

          {/* Rules */}
          {tournament.rules && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-5 text-green-primary" />
                {t("rules") || "Rules"}
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{tournament.rules}</p>
              </div>
            </div>
          )}

          {/* Images */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="size-5 text-green-primary" />
              {t("images") || "Images"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.coverImage?.light && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t("coverImage") || "Cover Image"}</p>
                  <img
                    src={tournament.coverImage.light}
                    alt="Cover"
                    className="w-full h-40 object-cover rounded-xl ring-1 ring-white/10"
                  />
                </div>
              )}
              {tournament.bracketImage?.light && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t("bracketImage") || "Bracket Image"}</p>
                  <img
                    src={tournament.bracketImage.light}
                    alt="Bracket"
                    className="w-full h-40 object-cover rounded-xl ring-1 ring-white/10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Prize Pool */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Coins className="size-5 text-green-primary" />
              {t("prizePool") || "Prize Pool"}
            </h3>
            <p className="text-3xl font-bold text-green-primary">
              {formatCurrency(tournament.prizePool)}
            </p>
          </div>

          {/* Teams */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="size-5 text-green-primary" />
              {t("teams") || "Teams"}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">
                {tournament.teams?.length || 0}
              </p>
              {tournament.maxTeams && (
                <p className="text-muted-foreground">/ {tournament.maxTeams} max</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-green-primary" />
              {t("location") || "Location"}
            </h3>
            {tournament.country && (
              <div className="flex items-center gap-3 mb-2">
                {tournament.country.flag && (
                  <img
                    src={tournament.country.flag}
                    alt={tournament.country.name}
                    className="size-6 rounded"
                  />
                )}
                <span className="text-foreground font-medium">{tournament.country.name}</span>
                {tournament.country.code && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {tournament.country.code}
                  </span>
                )}
              </div>
            )}
            {tournament.location && (
              <p className="text-muted-foreground">{tournament.location}</p>
            )}
          </div>

          {/* Format */}
          {tournament.format && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="size-5 text-green-primary" />
                {t("format") || "Format"}
              </h3>
              <p className="text-foreground">{tournament.format}</p>
            </div>
          )}

          {/* Games */}
          {tournament.games && tournament.games.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="size-5 text-green-primary" />
                {t("games") || "Games"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tournament.games.map((game) => (
                  <span
                    key={game._id || game.id || game}
                    className="px-3 py-1.5 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] text-sm font-medium text-foreground"
                  >
                    {game.name || game}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(tournament.streamUrl || tournament.websiteUrl) && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <LinkIcon className="size-5 text-green-primary" />
                {t("links") || "Links"}
              </h3>
              <div className="space-y-3">
                {tournament.streamUrl && (
                  <a
                    href={tournament.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-colors group"
                  >
                    <Tv className="size-5 text-purple-500" />
                    <span className="text-sm font-medium text-purple-500 truncate flex-1">
                      {t("watchStream") || "Watch Stream"}
                    </span>
                  </a>
                )}
                {tournament.websiteUrl && (
                  <a
                    href={tournament.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors group"
                  >
                    <Globe className="size-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-500 truncate flex-1">
                      {t("visitWebsite") || "Visit Website"}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="size-5 text-green-primary" />
              {t("stats") || "Statistics"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("views") || "Views"}</span>
                <span className="font-medium text-foreground">{tournament.viewsCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("followers") || "Followers"}</span>
                <span className="font-medium text-foreground">{tournament.followersCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Item Component
function InfoItem({ label, value, icon }) {
  return (
    <div className="p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        {icon}
        {label}
      </div>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

export default TournamentDetails;

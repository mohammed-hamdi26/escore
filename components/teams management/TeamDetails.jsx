"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import {
  Users,
  Calendar,
  MapPin,
  Globe,
  Award,
  ArrowLeft,
  Pencil,
  Gamepad2,
  Link as LinkIcon,
  Heart,
  Trophy,
  Power,
  Eye,
  Hash,
  Building2,
  User,
} from "lucide-react";
import { getImgUrl } from "@/lib/utils";

function TeamDetails({ team }) {
  const t = useTranslations("TeamDetails");

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP");
  };

  const formatFoundedYear = (date) => {
    if (!date) return null;
    return new Date(date).getFullYear();
  };

  const formatFollowers = (count) => {
    if (!count) return "0";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const teamLogo = getImgUrl(team.logo?.light) || getImgUrl(team.logo?.dark);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/teams-management">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "Team Details"}</h1>
        </div>
        <Link href={`/dashboard/teams-management/edit/${team.id || team._id}`}>
          <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
            <Pencil className="size-4" />
            {t("edit") || "Edit Team"}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Header Card */}
          <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="flex-shrink-0 relative">
                  {teamLogo ? (
                    <img
                      src={teamLogo}
                      alt={team.name}
                      className="size-24 rounded-2xl object-contain bg-muted/50 dark:bg-[#1a1d2e] p-2"
                    />
                  ) : (
                    <div className="size-24 rounded-2xl bg-green-primary/10 flex items-center justify-center">
                      <Users className="size-10 text-green-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground truncate">{team.name}</h2>
                    {team.shortName && (
                      <span className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                        {team.shortName}
                      </span>
                    )}
                  </div>

                  {team.slug && (
                    <p className="text-muted-foreground mb-3">@{team.slug}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Active Status */}
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                      team.isActive !== false
                        ? "bg-green-500/10 text-green-500 border-green-500/30"
                        : "bg-red-500/10 text-red-500 border-red-500/30"
                    }`}>
                      <Power className="size-4" />
                      {team.isActive !== false ? t("active") || "Active" : t("inactive") || "Inactive"}
                    </span>

                    {/* Region */}
                    {team.region && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-blue-500/10 text-blue-500 border-blue-500/30">
                        <MapPin className="size-4" />
                        {team.region}
                      </span>
                    )}

                    {/* Country */}
                    {team.country?.name && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-purple-500/10 text-purple-500 border-purple-500/30">
                        {team.country.flag ? (
                          <img src={team.country.flag} alt="" className="size-4 rounded" />
                        ) : (
                          <Globe className="size-4" />
                        )}
                        {team.country.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {team.description && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="size-5 text-green-primary" />
                {t("about") || "About"}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{team.description}</p>
            </div>
          )}

          {/* Images */}
          {(team.logo?.light || team.logo?.dark || team.coverImage?.light || team.coverImage?.dark) && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="size-5 text-green-primary" />
                {t("images") || "Images"}
              </h3>
              <div className="space-y-6">
                {/* Logo Section */}
                {(team.logo?.light || team.logo?.dark) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t("logo") || "Logo"} (1:1)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {team.logo?.light && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                          <div className="aspect-square w-full rounded-xl bg-white p-2 ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={getImgUrl(team.logo.light)}
                              alt="Logo Light"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                      {team.logo?.dark && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                          <div className="aspect-square w-full rounded-xl bg-[#1a1d2e] p-2 ring-1 ring-white/10 overflow-hidden">
                            <img
                              src={getImgUrl(team.logo.dark)}
                              alt="Logo Dark"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Image Section */}
                {(team.coverImage?.light || team.coverImage?.dark) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t("coverImage") || "Cover Image"} (3:2)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {team.coverImage?.light && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                          <div className="aspect-[3/2] w-full rounded-xl ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={getImgUrl(team.coverImage.light)}
                              alt="Cover Light"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {team.coverImage?.dark && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                          <div className="aspect-[3/2] w-full rounded-xl ring-1 ring-white/10 overflow-hidden">
                            <img
                              src={getImgUrl(team.coverImage.dark)}
                              alt="Cover Dark"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team Info */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-green-primary" />
              {t("teamInfo") || "Team Information"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label={t("foundedDate") || "Founded"}
                value={formatFoundedYear(team.foundedDate) || "-"}
                icon={<Calendar className="size-4" />}
              />
              <InfoItem
                label={t("country") || "Country"}
                value={team.country?.name || "-"}
                icon={<Globe className="size-4" />}
                extra={team.country?.flag && (
                  <img src={team.country.flag} alt="" className="size-5 rounded" />
                )}
              />
              {team.region && (
                <InfoItem
                  label={t("region") || "Region"}
                  value={team.region}
                  icon={<MapPin className="size-4" />}
                />
              )}
              {team.worldRanking && (
                <InfoItem
                  label={t("worldRanking") || "World Ranking"}
                  value={`#${team.worldRanking}`}
                  icon={<Hash className="size-4" />}
                />
              )}
            </div>
          </div>

          {/* Players */}
          {team.players && team.players.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="size-5 text-green-primary" />
                {t("players") || "Players"} ({team.players.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.players.map((player, index) => (
                  <Link
                    key={player.id || player._id || index}
                    href={`/dashboard/player-management/view/${player.id || player._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] hover:bg-muted/50 dark:hover:bg-[#252a3d] transition-colors"
                  >
                    {player.photo?.light ? (
                      <img src={getImgUrl(player.photo.light, "thumbnail")} alt={player.nickname || player.fullName || 'Player'} className="size-10 rounded-lg object-cover" />
                    ) : (
                      <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <User className="size-5 text-green-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {player.nickname || player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim() || 'Unknown'}
                      </p>
                      {player.role && (
                        <p className="text-xs text-muted-foreground">{player.role}</p>
                      )}
                    </div>
                    {player.country?.flag && (
                      <img src={player.country.flag} alt="" className="size-5 rounded" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tournaments */}
          {team.tournaments && team.tournaments.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="size-5 text-green-primary" />
                {t("tournaments") || "Tournaments"} ({team.tournaments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.tournaments.map((tournament, index) => (
                  <div key={tournament.id || tournament._id || index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                    {tournament.logo?.light ? (
                      <img src={getImgUrl(tournament.logo.light, "thumbnail")} alt={tournament.name} className="size-10 rounded-lg object-cover" />
                    ) : (
                      <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Trophy className="size-5 text-green-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{tournament.name}</p>
                      {tournament.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tournament.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          tournament.status === 'ongoing' ? 'bg-blue-500/10 text-blue-500' :
                          tournament.status === 'upcoming' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                          {tournament.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {team.awards && team.awards.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="size-5 text-green-primary" />
                {t("awards") || "Awards"} ({team.awards.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.awards.map((award, index) => (
                  <div key={award.id || index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                    {award.image?.light ? (
                      <img src={getImgUrl(award.image.light, "thumbnail")} alt={award.name} className="size-10 rounded-lg object-cover" />
                    ) : (
                      <div className="size-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Award className="size-5 text-yellow-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{award.name}</p>
                      {award.game?.name && (
                        <p className="text-xs text-muted-foreground">{award.game.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {team.socialLinks && team.socialLinks.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <LinkIcon className="size-5 text-green-primary" />
                {t("socialLinks") || "Social Links"} ({team.socialLinks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                  >
                    {link.image?.light ? (
                      <img src={getImgUrl(link.image.light, "thumbnail")} alt={link.name} className="size-6 rounded" />
                    ) : (
                      <LinkIcon className="size-5 text-blue-500" />
                    )}
                    <span className="font-medium text-blue-500">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Games */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gamepad2 className="size-5 text-green-primary" />
              {t("games") || "Games"}
            </h3>
            {team.game ? (
              <div className="flex items-center gap-3">
                {team.game.logo?.light ? (
                  <img
                    src={getImgUrl(team.game.logo.light, "thumbnail")}
                    alt={team.game.name}
                    className="size-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                    <Gamepad2 className="size-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{team.game.name}</p>
                  {team.game.slug && (
                    <p className="text-sm text-muted-foreground">@{team.game.slug}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("noGames") || "No game assigned"}</p>
            )}
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="size-5 text-green-primary" />
              {t("stats") || "Statistics"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("followers") || "Followers"}</span>
                <span className="font-medium text-foreground">{formatFollowers(team.followersCount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("playersCount") || "Players"}</span>
                <span className="font-medium text-foreground">{team.players?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("awardsCount") || "Awards"}</span>
                <span className="font-medium text-foreground">{team.awards?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("tournamentsCount") || "Tournaments"}</span>
                <span className="font-medium text-foreground">{team.tournaments?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <LinkIcon className="size-5 text-green-primary" />
              {t("quickLinks") || "Quick Links"}
            </h3>
            <div className="space-y-2">
              <Link
                href={`/dashboard/teams-management/lineups/${team.id || team._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors"
              >
                <Users className="size-5 text-green-500" />
                <span className="font-medium text-green-500">{t("manageLineups") || "Manage Lineups"}</span>
              </Link>
              <Link
                href={`/dashboard/teams-management/awards/${team.id || team._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
              >
                <Award className="size-5 text-yellow-500" />
                <span className="font-medium text-yellow-500">{t("manageAwards") || "Manage Awards"}</span>
              </Link>
              <Link
                href={`/dashboard/teams-management/links/${team.id || team._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                <LinkIcon className="size-5 text-blue-500" />
                <span className="font-medium text-blue-500">{t("manageLinks") || "Manage Links"}</span>
              </Link>
            </div>
          </div>

          {/* Created Info */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-green-primary" />
              {t("metadata") || "Metadata"}
            </h3>
            <div className="space-y-3 text-sm">
              {team.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("createdAt") || "Created"}</span>
                  <span className="font-medium text-foreground">{formatDate(team.createdAt)}</span>
                </div>
              )}
              {team.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("updatedAt") || "Updated"}</span>
                  <span className="font-medium text-foreground">{formatDate(team.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Item Component
function InfoItem({ label, value, icon, extra }) {
  return (
    <div className="p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default TeamDetails;

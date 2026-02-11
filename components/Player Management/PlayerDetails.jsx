"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import {
  User,
  Calendar,
  MapPin,
  Globe,
  Users,
  Award,
  Star,
  ArrowLeft,
  Pencil,
  Gamepad2,
  Link as LinkIcon,
  Heart,
  Trophy,
  Power,
  Eye,
  DollarSign,
  Hash,
} from "lucide-react";

function PlayerDetails({ player }) {
  const t = useTranslations("PlayerDetails");

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP");
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const age = calculateAge(player.dateOfBirth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/player-management">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "Player Details"}</h1>
        </div>
        <Link href={`/dashboard/player-management/edit/${player.id || player._id}`}>
          <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
            <Pencil className="size-4" />
            {t("edit") || "Edit Player"}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player Header Card */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <div className="flex items-start gap-6">
              {/* Photo */}
              <div className="flex-shrink-0">
                {player.photo?.light ? (
                  <img
                    src={player.photo.light}
                    alt={player.nickname}
                    className="size-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="size-24 rounded-2xl bg-green-primary/10 flex items-center justify-center ring-2 ring-green-primary/20">
                    <User className="size-10 text-green-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground truncate">
                    {player.nickname || player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim()}
                  </h2>
                  {player.isFreeAgent && (
                    <span className="px-2 py-1 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-medium">
                      {t("freeAgent") || "Free Agent"}
                    </span>
                  )}
                </div>

                {/* Show full name below nickname if both exist */}
                {player.nickname && (player.fullName || player.firstName || player.lastName) && (
                  <p className="text-muted-foreground mb-3">
                    {player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim()}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {/* Active Status */}
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    player.isActive
                      ? "bg-green-500/10 text-green-500 border-green-500/30"
                      : "bg-red-500/10 text-red-500 border-red-500/30"
                  }`}>
                    <Power className="size-4" />
                    {player.isActive ? t("active") || "Active" : t("inactive") || "Inactive"}
                  </span>

                  {/* Roles */}
                  {player.gameRosters?.length > 0 ? (
                    [...new Set(player.gameRosters.map(r => r.role).filter(Boolean))].map((role, i) => (
                      <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-purple-500/10 text-purple-500 border-purple-500/30">
                        <Star className="size-4" />
                        {role}
                      </span>
                    ))
                  ) : player.role ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-purple-500/10 text-purple-500 border-purple-500/30">
                      <Star className="size-4" />
                      {player.role}
                    </span>
                  ) : null}

                  {/* Age */}
                  {age && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-blue-500/10 text-blue-500 border-blue-500/30">
                      <Calendar className="size-4" />
                      {age} {t("yearsOld") || "years old"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {player.bio && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="size-5 text-green-primary" />
                {t("bio") || "Biography"}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{player.bio}</p>
            </div>
          )}

          {/* Images */}
          {(player.photo?.light || player.photo?.dark || player.coverImage?.light || player.coverImage?.dark) && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="size-5 text-green-primary" />
                {t("images") || "Images"}
              </h3>
              <div className="space-y-6">
                {/* Photo Section */}
                {(player.photo?.light || player.photo?.dark) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t("photo") || "Photo"} (1:1)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {player.photo?.light && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                          <div className="aspect-square w-full rounded-xl bg-white p-2 ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={player.photo.light}
                              alt="Photo Light"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                      {player.photo?.dark && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                          <div className="aspect-square w-full rounded-xl bg-[#1a1d2e] p-2 ring-1 ring-white/10 overflow-hidden">
                            <img
                              src={player.photo.dark}
                              alt="Photo Dark"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Image Section */}
                {(player.coverImage?.light || player.coverImage?.dark) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t("coverImage") || "Cover Image"} (3:2)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {player.coverImage?.light && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                          <div className="aspect-[3/2] w-full rounded-xl ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={player.coverImage.light}
                              alt="Cover Light"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {player.coverImage?.dark && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                          <div className="aspect-[3/2] w-full rounded-xl ring-1 ring-white/10 overflow-hidden">
                            <img
                              src={player.coverImage.dark}
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

          {/* Personal Info */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-green-primary" />
              {t("personalInfo") || "Personal Information"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label={t("dateOfBirth") || "Date of Birth"}
                value={formatDate(player.dateOfBirth)}
                icon={<Calendar className="size-4" />}
              />
              <InfoItem
                label={t("country") || "Country"}
                value={player.country?.name || "-"}
                icon={<Globe className="size-4" />}
                extra={player.country?.flag && (
                  <img src={player.country.flag} alt="" className="size-5 rounded" />
                )}
              />
              {player.ranking && (
                <InfoItem
                  label={t("ranking") || "World Ranking"}
                  value={`#${player.ranking}`}
                  icon={<Hash className="size-4" />}
                />
              )}
              {player.marketValue && (
                <InfoItem
                  label={t("marketValue") || "Market Value"}
                  value={formatCurrency(player.marketValue)}
                  icon={<DollarSign className="size-4" />}
                />
              )}
            </div>
          </div>

          {/* Awards */}
          {player.awards && player.awards.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="size-5 text-green-primary" />
                {t("awards") || "Awards"} ({player.awards.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {player.awards.map((award, index) => (
                  <div key={award.id || index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                    {award.image?.light ? (
                      <img src={award.image.light} alt={award.name} className="size-10 rounded-lg object-cover" />
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

          {/* Favourite Characters */}
          {player.favouriteCharacters && player.favouriteCharacters.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="size-5 text-green-primary" />
                {t("favouriteCharacters") || "Favourite Characters"} ({player.favouriteCharacters.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {player.favouriteCharacters.map((char, index) => (
                  <div key={char.id || index} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                    {char.image?.light ? (
                      <img src={char.image.light} alt={char.name} className="size-8 rounded-lg object-cover" />
                    ) : (
                      <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <Heart className="size-4 text-pink-500" />
                      </div>
                    )}
                    <span className="font-medium text-foreground">{char.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tournaments */}
          {player.tournaments && player.tournaments.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="size-5 text-green-primary" />
                {t("tournaments") || "Tournaments"} ({player.tournaments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {player.tournaments.map((tournament, index) => (
                  <div key={tournament.id || tournament._id || index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                    {tournament.logo?.light ? (
                      <img src={tournament.logo.light} alt={tournament.name} className="size-10 rounded-lg object-cover" />
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

          {/* Social Links */}
          {player.socialLinks && player.socialLinks.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <LinkIcon className="size-5 text-green-primary" />
                {t("socialLinks") || "Social Links"} ({player.socialLinks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {player.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                  >
                    {link.image?.light ? (
                      <img src={link.image.light} alt={link.name} className="size-6 rounded" />
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
          {/* Game Rosters */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gamepad2 className="size-5 text-green-primary" />
              {t("gameRosters") || "Game Rosters"}
              {((player.gameRosters && player.gameRosters.length > 0) || player.game) && (
                <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full font-normal">
                  {player.gameRosters?.length || 1}
                </span>
              )}
            </h3>
            {player.gameRosters && player.gameRosters.length > 0 ? (
              <div className="space-y-3">
                {player.gameRosters.map((roster, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] space-y-3">
                    {/* Game */}
                    <div className="flex items-center gap-3">
                      {roster.game?.logo?.light ? (
                        <img
                          src={roster.game.logo.light}
                          alt={roster.game.name}
                          className="size-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
                          <Gamepad2 className="size-5 text-green-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {roster.game?.name || t("unknownGame") || "Unknown Game"}
                        </p>
                        {roster.role && (
                          <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                            {roster.role}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Team */}
                    {roster.team ? (
                      <div className="flex items-center gap-3 pl-2 border-l-2 border-blue-500/30 ml-1">
                        {roster.team.logo?.light ? (
                          <img
                            src={roster.team.logo.light}
                            alt={roster.team.name}
                            className="size-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Users className="size-4 text-blue-500" />
                          </div>
                        )}
                        <p className="text-sm font-medium text-foreground truncate">{roster.team.name}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pl-2 border-l-2 border-orange-500/30 ml-1">
                        <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                          {t("freeAgent") || "Free Agent"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : player.game ? (
              /* Fallback to legacy single game/team */
              <div className="p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] space-y-3">
                <div className="flex items-center gap-3">
                  {player.game.logo?.light ? (
                    <img
                      src={player.game.logo.light}
                      alt={player.game.name}
                      className="size-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
                      <Gamepad2 className="size-5 text-green-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{player.game.name}</p>
                    {player.role && (
                      <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                        {player.role}
                      </span>
                    )}
                  </div>
                </div>
                {player.team ? (
                  <div className="flex items-center gap-3 pl-2 border-l-2 border-blue-500/30 ml-1">
                    {player.team.logo?.light ? (
                      <img
                        src={player.team.logo.light}
                        alt={player.team.name}
                        className="size-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Users className="size-4 text-blue-500" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-foreground truncate">{player.team.name}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pl-2 border-l-2 border-orange-500/30 ml-1">
                    <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      {t("freeAgent") || "Free Agent"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">{t("noGame") || "No game assigned"}</p>
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
                <span className="font-medium text-foreground">{player.followersCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("awardsCount") || "Awards"}</span>
                <span className="font-medium text-foreground">{player.awardsNumber || player.awards?.length || 0}</span>
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
                href={`/dashboard/player-management/awards/${player.id || player._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
              >
                <Award className="size-5 text-yellow-500" />
                <span className="font-medium text-yellow-500">{t("manageAwards") || "Manage Awards"}</span>
              </Link>
              <Link
                href={`/dashboard/player-management/links/${player.id || player._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                <LinkIcon className="size-5 text-blue-500" />
                <span className="font-medium text-blue-500">{t("manageLinks") || "Manage Links"}</span>
              </Link>
              <Link
                href={`/dashboard/player-management/favorites-characters/${player.id || player._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 transition-colors"
              >
                <Heart className="size-5 text-pink-500" />
                <span className="font-medium text-pink-500">{t("manageCharacters") || "Manage Characters"}</span>
              </Link>
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

export default PlayerDetails;

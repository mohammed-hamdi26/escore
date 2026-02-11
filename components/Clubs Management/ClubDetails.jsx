"use client";
import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  Heart,
  MapPin,
  Users,
  Gamepad2,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Loader2,
  User,
  Power,
  FileText,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  addTeamToClub,
  removeTeamFromClub,
  addPlayerToClub,
  removePlayerFromClub,
} from "@/app/[locale]/_Lib/actions";
import {
  usePermissions,
  ENTITIES,
  ACTIONS,
} from "@/contexts/PermissionsContext";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ClubDetails({ club, games = [], teams = [] }) {
  const t = useTranslations("clubForm");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission(ENTITIES.CLUB, ACTIONS.UPDATE);

  const clubLogo = club?.logo?.light || club?.logo?.dark;
  const clubCover = club?.coverImage?.light || club?.coverImage?.dark;
  const countryFlag = club?.country?.code
    ? `https://flagcdn.com/w40/${club.country.code.toLowerCase()}.png`
    : null;

  const handleAddTeam = async () => {
    if (!selectedTeam || !selectedGame) {
      toast.error(t("selectTeamAndGame") || "Please select both team and game");
      return;
    }
    setIsLoading(true);
    try {
      await addTeamToClub(club.id, {
        team: selectedTeam,
        game: selectedGame,
      });
      toast.success(t("teamAdded") || "Team added successfully");
      setShowAddTeam(false);
      setSelectedTeam("");
      setSelectedGame("");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("teamAddError") || "Failed to add team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeam = async (teamId) => {
    if (!confirm(t("confirmRemoveTeam") || "Remove this team from the club?"))
      return;
    setIsLoading(true);
    try {
      await removeTeamFromClub(club.id, teamId);
      toast.success(t("teamRemoved") || "Team removed");
      router.refresh();
    } catch (error) {
      toast.error(
        error.message || t("teamRemoveError") || "Failed to remove team"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (
      !confirm(
        t("confirmRemovePlayer") || "Remove this player from the club?"
      )
    )
      return;
    setIsLoading(true);
    try {
      await removePlayerFromClub(club.id, playerId);
      toast.success(t("playerRemoved") || "Player removed");
      router.refresh();
    } catch (error) {
      toast.error(
        error.message || t("playerRemoveError") || "Failed to remove player"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "info", label: t("overview") || "Overview", icon: Eye },
    { id: "teams", label: t("teamsTab") || "Teams", icon: Users },
    { id: "players", label: t("playersTab") || "Players", icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/clubs-management">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("back") || "Back"}
          </Button>
        </Link>
        {canUpdate && (
          <Link href={`/dashboard/clubs-management/edit/${club.id}`}>
            <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
              <Pencil className="size-4" />
              {t("edit") || "Edit"}
            </Button>
          </Link>
        )}
      </div>

      {/* Header Card */}
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-start gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            {clubLogo ? (
              <img
                src={clubLogo}
                alt={club.name}
                className="size-24 rounded-2xl object-contain ring-2 ring-white/10 bg-white/5 p-1"
              />
            ) : (
              <div className="size-24 rounded-2xl bg-green-primary/10 flex items-center justify-center ring-2 ring-green-primary/20">
                <Building2 className="size-10 text-green-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground truncate">
                {club.name}
              </h2>
              {club.shortName && (
                <Badge variant="secondary" className="text-xs">
                  {club.shortName}
                </Badge>
              )}
              {countryFlag && (
                <img
                  src={countryFlag}
                  alt={club.country?.name}
                  className="size-6 rounded-sm object-cover ring-1 ring-white/10"
                />
              )}
            </div>

            {/* Badge Row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {/* Active/Inactive */}
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  club.isActive !== false
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : "bg-red-500/10 text-red-500 border-red-500/30"
                }`}
              >
                <Power className="size-4" />
                {club.isActive !== false
                  ? t("active") || "Active"
                  : t("inactive") || "Inactive"}
              </span>

              {/* Region */}
              {club.region && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-amber-500/10 text-amber-500 border-amber-500/30">
                  <MapPin className="size-4" />
                  {club.region}
                </span>
              )}
            </div>

            {/* Subtitle */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              {club.founded && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {t("founded") || "Founded"} {formatDate(club.founded)}
                </span>
              )}
              {club.country?.name && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {club.country.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 dark:bg-[#1a1d2e] rounded-lg p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-5 text-green-primary" />
                {t("description") || "Description"}
              </h3>
              {club.description ? (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {club.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  {t("noDescription") || "No description available"}
                </p>
              )}
            </div>

            {/* Teams Summary */}
            {club.teams?.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="size-5 text-green-primary" />
                  {t("teamsTab") || "Teams"}
                  <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full ml-auto">
                    {club.teams.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {club.teams.slice(0, 5).map((entry, index) => {
                    const team = entry.team || {};
                    const game = entry.game || {};
                    const teamLogo = team.logo?.light || team.logo?.dark;
                    const gameLogo = game.logo?.light || game.logo?.dark;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt={team.name}
                            className="size-8 rounded-lg object-contain bg-white/5 p-0.5"
                          />
                        ) : (
                          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Users className="size-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground truncate flex-1">
                          {team.name || "Unknown Team"}
                        </span>
                        {gameLogo && (
                          <img
                            src={gameLogo}
                            alt={game.name}
                            className="size-5 rounded"
                          />
                        )}
                        <Badge
                          className={
                            entry.isActive !== false
                              ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                              : "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                          }
                        >
                          {entry.isActive !== false
                            ? t("active") || "Active"
                            : t("inactive") || "Inactive"}
                        </Badge>
                      </div>
                    );
                  })}
                  {club.teams.length > 5 && (
                    <button
                      onClick={() => setActiveTab("teams")}
                      className="text-sm text-green-primary hover:underline mt-2"
                    >
                      +{club.teams.length - 5} more...
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Images Section */}
            {(club.logo?.light ||
              club.logo?.dark ||
              club.coverImage?.light ||
              club.coverImage?.dark) && (
              <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Eye className="size-5 text-green-primary" />
                  {t("images") || "Images"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Logo */}
                  {(club.logo?.light || club.logo?.dark) && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {t("logoLabel") || "Logo"}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {club.logo?.light && (
                          <div className="space-y-1.5">
                            <div className="aspect-square rounded-xl bg-white border border-gray-200 flex items-center justify-center p-4 overflow-hidden">
                              <img
                                src={club.logo.light}
                                alt="Logo Light"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                              <Sun className="size-3" />
                              {t("lightMode") || "Light"}
                            </p>
                          </div>
                        )}
                        {club.logo?.dark && (
                          <div className="space-y-1.5">
                            <div className="aspect-square rounded-xl bg-[#1a1d2e] border border-white/10 flex items-center justify-center p-4 overflow-hidden">
                              <img
                                src={club.logo.dark}
                                alt="Logo Dark"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                              <Moon className="size-3" />
                              {t("darkMode") || "Dark"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cover Image */}
                  {(club.coverImage?.light || club.coverImage?.dark) && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {t("coverImageLabel") || "Cover Image"}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {club.coverImage?.light && (
                          <div className="space-y-1.5">
                            <div className="aspect-video rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                              <img
                                src={club.coverImage.light}
                                alt="Cover Light"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                              <Sun className="size-3" />
                              {t("lightMode") || "Light"}
                            </p>
                          </div>
                        )}
                        {club.coverImage?.dark && (
                          <div className="space-y-1.5">
                            <div className="aspect-video rounded-xl bg-[#1a1d2e] border border-white/10 flex items-center justify-center overflow-hidden">
                              <img
                                src={club.coverImage.dark}
                                alt="Cover Dark"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                              <Moon className="size-3" />
                              {t("darkMode") || "Dark"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="size-5 text-green-primary" />
                {t("stats") || "Statistics"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="size-4" />
                    {t("teamCount") || "Teams"}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {club.teams?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="size-4" />
                    {t("playerCount") || "Players"}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {club.players?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Heart className="size-4 text-pink-500" />
                    {t("followerCount") || "Followers"}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {club.followersCount?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            {(club.country?.name || club.region) && (
              <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="size-5 text-green-primary" />
                  {t("location") || "Location"}
                </h3>
                {club.country?.name && (
                  <div className="flex items-center gap-3 mb-3">
                    {countryFlag && (
                      <img
                        src={countryFlag}
                        alt={club.country.name}
                        className="size-8 rounded object-cover ring-1 ring-white/10"
                      />
                    )}
                    <div>
                      <span className="text-foreground font-medium">
                        {club.country.name}
                      </span>
                      {club.country.code && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded ml-2">
                          {club.country.code}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {club.region && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="size-4" />
                    {club.region}
                  </div>
                )}
              </div>
            )}

            {/* Founded */}
            {club.founded && (
              <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="size-5 text-green-primary" />
                  {t("founded") || "Founded"}
                </h3>
                <p className="text-xl font-bold text-foreground">
                  {formatDate(club.founded)}
                </p>
              </div>
            )}

            {/* Website */}
            {club.websiteUrl && (
              <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="size-5 text-green-primary" />
                  {t("websiteLabel") || "Website"}
                </h3>
                <a
                  href={club.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium w-full justify-center"
                >
                  <ExternalLink className="size-4" />
                  {t("visitWebsite") || "Visit Website"}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "teams" && (
        <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5 space-y-4">
          {/* Add Team Button */}
          {canUpdate && (
            <div className="flex justify-end">
              <Button
                className="bg-green-primary hover:bg-green-primary/80 gap-2"
                onClick={() => setShowAddTeam(!showAddTeam)}
              >
                <Plus className="size-4" />
                {t("addTeam") || "Add Team"}
              </Button>
            </div>
          )}

          {/* Add Team Form */}
          {showAddTeam && (
            <div className="glass rounded-xl p-4 border border-green-primary/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    {t("selectGame") || "Select Game"}
                  </label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                  >
                    <option value="">
                      {t("selectGame") || "Select Game"}
                    </option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    {t("selectTeam") || "Select Team"}
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                  >
                    <option value="">
                      {t("selectTeam") || "Select Team"}
                    </option>
                    {teams
                      .filter(
                        (team) =>
                          !selectedGame ||
                          team.games?.some(
                            (g) => (g.id || g._id || g) === selectedGame
                          )
                      )
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddTeam(false)}
                >
                  {t("cancel") || "Cancel"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddTeam}
                  disabled={isLoading || !selectedTeam || !selectedGame}
                  className="bg-green-primary hover:bg-green-primary/80 gap-1"
                >
                  {isLoading && <Loader2 className="size-3 animate-spin" />}
                  {t("add") || "Add"}
                </Button>
              </div>
            </div>
          )}

          {/* Teams List */}
          {club.teams?.length > 0 ? (
            <div className="space-y-2">
              {club.teams.map((entry, index) => {
                const team = entry.team || {};
                const game = entry.game || {};
                const teamLogo = team.logo?.light || team.logo?.dark;
                const gameLogo = game.logo?.light || game.logo?.dark;

                return (
                  <div
                    key={index}
                    className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4"
                  >
                    {teamLogo ? (
                      <img
                        src={teamLogo}
                        alt={team.name}
                        className="size-10 rounded-lg object-contain bg-white/5 p-1"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Users className="size-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {team.name || "Unknown Team"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {gameLogo && (
                          <img
                            src={gameLogo}
                            alt={game.name}
                            className="size-4 rounded"
                          />
                        )}
                        <span>{game.name || "Unknown Game"}</span>
                        {entry.joinedDate && (
                          <>
                            <span>·</span>
                            <span>
                              {t("joined") || "Joined"}{" "}
                              {formatDate(entry.joinedDate)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={
                        entry.isActive !== false
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {entry.isActive !== false
                        ? t("active") || "Active"
                        : t("inactive") || "Inactive"}
                    </Badge>
                    {canUpdate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() =>
                          handleRemoveTeam(team.id || team._id)
                        }
                        disabled={isLoading}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {t("noTeams") || "No teams assigned to this club"}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "players" && (
        <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5 space-y-4">
          {club.players?.length > 0 ? (
            <div className="space-y-2">
              {club.players.map((entry, index) => {
                const player = entry.player || {};
                const game = entry.game || {};
                const playerPhoto =
                  player.photo?.light || player.photo?.dark;

                return (
                  <div
                    key={index}
                    className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4"
                  >
                    {playerPhoto ? (
                      <img
                        src={playerPhoto}
                        alt={player.nickname || player.name}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {player.nickname || player.name || "Unknown Player"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {game.name || "Unknown Game"}
                      </p>
                    </div>
                    {canUpdate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() =>
                          handleRemovePlayer(player.id || player._id)
                        }
                        disabled={isLoading}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <User className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {t("noPlayers") || "No players assigned to this club"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClubDetails;

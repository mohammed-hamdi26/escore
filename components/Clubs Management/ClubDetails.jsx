"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
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
  Edit,
  ExternalLink,
  Loader2,
  User,
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
  const countryFlag = club?.country?.code
    ? `https://flagcdn.com/24x18/${club.country.code.toLowerCase()}.png`
    : null;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
    if (!confirm(t("confirmRemoveTeam") || "Remove this team from the club?")) return;
    setIsLoading(true);
    try {
      await removeTeamFromClub(club.id, teamId);
      toast.success(t("teamRemoved") || "Team removed");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("teamRemoveError") || "Failed to remove team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!confirm(t("confirmRemovePlayer") || "Remove this player from the club?")) return;
    setIsLoading(true);
    try {
      await removePlayerFromClub(club.id, playerId);
      toast.success(t("playerRemoved") || "Player removed");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("playerRemoveError") || "Failed to remove player");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "info", label: t("infoTab") || "Info", icon: Building2 },
    { id: "teams", label: t("teamsTab") || "Teams", icon: Users },
    { id: "players", label: t("playersTab") || "Players", icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="size-10 rounded-xl"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" />
          </Button>
          <div className="flex items-center gap-4">
            {clubLogo ? (
              <img
                src={clubLogo}
                alt={club.name}
                className="size-12 rounded-xl object-contain bg-white/5 p-1"
              />
            ) : (
              <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Building2 className="size-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {club.name}
                </h1>
                {club.shortName && (
                  <Badge variant="secondary">{club.shortName}</Badge>
                )}
                {countryFlag && (
                  <img
                    src={countryFlag}
                    alt={club.country?.name}
                    className="size-5 rounded-sm"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {club.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {club.region}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        {canUpdate && (
          <Link href={`/dashboard/clubs-management/edit/${club.id}`}>
            <Button
              variant="outline"
              className="gap-2"
            >
              <Edit className="size-4" />
              {t("edit") || "Edit"}
            </Button>
          </Link>
        )}
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
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
          {club.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("description") || "Description"}
              </h3>
              <p className="text-foreground">{club.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {club.country?.name && (
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">
                  {t("country") || "Country"}
                </h4>
                <p className="text-sm text-foreground flex items-center gap-1.5">
                  {countryFlag && (
                    <img src={countryFlag} alt="" className="size-4" />
                  )}
                  {club.country.name}
                </p>
              </div>
            )}
            {club.region && (
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">
                  {t("region") || "Region"}
                </h4>
                <p className="text-sm text-foreground">{club.region}</p>
              </div>
            )}
            {club.founded && (
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">
                  {t("founded") || "Founded"}
                </h4>
                <p className="text-sm text-foreground">
                  {formatDate(club.founded)}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-xs text-muted-foreground mb-1">
                {t("followers") || "Followers"}
              </h4>
              <p className="text-sm text-foreground flex items-center gap-1.5">
                <Heart className="size-3.5 text-pink-500" />
                {club.followersCount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          {club.websiteUrl && (
            <div>
              <h4 className="text-xs text-muted-foreground mb-1">
                {t("websiteUrl") || "Website"}
              </h4>
              <a
                href={club.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-primary hover:underline flex items-center gap-1"
              >
                {club.websiteUrl}
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === "teams" && (
        <div className="space-y-4">
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
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm"
                  >
                    <option value="">{t("selectGame") || "Select Game"}</option>
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
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm"
                  >
                    <option value="">{t("selectTeam") || "Select Team"}</option>
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
            <div className="glass rounded-2xl p-8 text-center border border-white/5">
              <Users className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {t("noTeams") || "No teams assigned to this club"}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "players" && (
        <div className="space-y-4">
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
            <div className="glass rounded-2xl p-8 text-center border border-white/5">
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

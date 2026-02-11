"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Trophy,
  Building2,
  Settings,
  Eye,
  MapPin,
  Globe,
  DollarSign,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  Medal,
  CheckCircle,
  XCircle,
  Gamepad2,
  Hash,
  Loader2,
  Search,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  addTournamentToEvent,
  removeTournamentFromEvent,
  assignClubToTournament,
  removeClubFromTournament,
  recordClubResult,
  removeClubResult,
} from "@/app/[locale]/_Lib/actions";

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
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function EventDetails({
  event,
  tournaments,
  clubs,
  standings,
  allTournaments,
  allClubs,
}) {
  const t = useTranslations("eventDetails");
  const tForm = useTranslations("eventForm");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Tournament linking state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [tournamentSearch, setTournamentSearch] = useState("");

  // Club assignment state
  const [assignTournamentId, setAssignTournamentId] = useState(null);
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  // Record result state
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [resultTournament, setResultTournament] = useState("");
  const [resultClub, setResultClub] = useState("");
  const [resultPlacement, setResultPlacement] = useState("");
  const [resultTeamOrPlayer, setResultTeamOrPlayer] = useState("");
  const [resultModel, setResultModel] = useState("Team");

  // Expanded standings
  const [expandedStanding, setExpandedStanding] = useState(null);

  const eventLogo = event.logo?.light || event.logo?.dark;

  const tabs = [
    { id: "overview", label: t("overview") || "Overview", icon: Eye },
    {
      id: "tournaments",
      label: t("tournaments") || "Tournaments",
      icon: Trophy,
    },
    {
      id: "championship",
      label: t("clubChampionship") || "Club Championship",
      icon: Medal,
    },
    { id: "settings", label: t("settings") || "Settings", icon: Settings },
  ];

  // Filter available tournaments (not already linked to any event)
  const availableTournaments = allTournaments.filter(
    (t) =>
      !t.parentEvent &&
      t.name?.toLowerCase().includes(tournamentSearch.toLowerCase())
  );

  // Get club's teams for assignment
  const getClubTeams = (clubId) => {
    const club = allClubs.find((c) => c.id === clubId);
    return club?.teams?.filter((t) => t.isActive !== false) || [];
  };

  const handleLinkTournament = async (tournamentId) => {
    setIsLoading(true);
    try {
      await addTournamentToEvent(event.id, tournamentId);
      toast.success(t("tournamentLinked") || "Tournament linked successfully");
      setShowLinkModal(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("linkError") || "Failed to link tournament");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkTournament = async (tournamentId) => {
    if (!confirm(t("confirmUnlink") || "Unlink this tournament from the event?")) return;
    setIsLoading(true);
    try {
      await removeTournamentFromEvent(event.id, tournamentId);
      toast.success(t("tournamentUnlinked") || "Tournament unlinked");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("unlinkError") || "Failed to unlink");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignClub = async (tournamentId) => {
    if (!selectedClub) {
      toast.error(t("selectClub") || "Select a club");
      return;
    }
    setIsLoading(true);
    try {
      const data = { club: selectedClub };
      if (selectedTeam) data.team = selectedTeam;
      await assignClubToTournament(event.id, tournamentId, data);
      toast.success(t("clubAssigned") || "Club assigned successfully");
      setAssignTournamentId(null);
      setSelectedClub("");
      setSelectedTeam("");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("assignError") || "Failed to assign club");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAssignment = async (tournamentId, clubId) => {
    if (!confirm(t("confirmRemoveAssignment") || "Remove this club assignment?")) return;
    setIsLoading(true);
    try {
      await removeClubFromTournament(event.id, tournamentId, clubId);
      toast.success(t("assignmentRemoved") || "Assignment removed");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("removeAssignmentError") || "Failed to remove");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordResult = async () => {
    if (!resultTournament || !resultClub || !resultPlacement || !resultTeamOrPlayer) {
      toast.error(t("fillAllFields") || "Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      await recordClubResult(event.id, {
        tournament: resultTournament,
        club: resultClub,
        placement: Number(resultPlacement),
        teamOrPlayer: resultTeamOrPlayer,
        teamOrPlayerModel: resultModel,
      });
      toast.success(t("resultRecorded") || "Result recorded successfully");
      setShowRecordModal(false);
      setResultTournament("");
      setResultClub("");
      setResultPlacement("");
      setResultTeamOrPlayer("");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("recordError") || "Failed to record result");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveResult = async (clubId, tournamentId) => {
    if (!confirm(t("confirmRemoveResult") || "Remove this result?")) return;
    setIsLoading(true);
    try {
      await removeClubResult(event.id, clubId, tournamentId);
      toast.success(t("resultRemoved") || "Result removed");
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("removeResultError") || "Failed to remove result");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {eventLogo ? (
          <img
            src={eventLogo}
            alt={event.name}
            className="size-14 rounded-xl object-contain bg-white/5 p-1"
          />
        ) : (
          <div className="size-14 rounded-xl bg-white/5 flex items-center justify-center">
            <CalendarDays className="size-7 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
            <Badge
              variant="outline"
              className={STATUS_COLORS[event.status] || STATUS_COLORS.upcoming}
            >
              {t(event.status) || event.status}
            </Badge>
            {event.clubChampionship?.enabled && (
              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-500 border-purple-500/20"
              >
                <Trophy className="size-3 mr-1" />
                CC
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {event.location}
              </span>
            )}
            {event.prizePool > 0 && (
              <span className="flex items-center gap-1">
                <DollarSign className="size-3.5" />
                {formatCurrency(event.prizePool, event.currency)}
              </span>
            )}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
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
      <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl border border-gray-200 dark:border-white/5 p-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {event.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {t("description") || "Description"}
                </h3>
                <p className="text-foreground">{event.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("tournaments") || "Tournaments"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {event.tournamentsCount || tournaments.length || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("clubs") || "Clubs"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {event.clubsCount || clubs.length || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("prizePool") || "Prize Pool"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(event.prizePool, event.currency)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("followers") || "Followers"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {event.followersCount || 0}
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4">
              {event.websiteUrl && (
                <a
                  href={event.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-green-primary hover:underline"
                >
                  <Globe className="size-4" />
                  {t("website") || "Website"}
                  <ExternalLink className="size-3" />
                </a>
              )}
              {event.streamUrl && (
                <a
                  href={event.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-green-primary hover:underline"
                >
                  <LinkIcon className="size-4" />
                  {t("stream") || "Stream"}
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            {/* Club Championship Summary */}
            {event.clubChampionship?.enabled && (
              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="size-5 text-purple-500" />
                  <h3 className="font-semibold text-foreground">
                    {t("clubChampionship") || "Club Championship"}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {event.clubChampionship.prizePool > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs">{tForm("championshipPrizePool") || "Prize Pool"}</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(event.clubChampionship.prizePool, event.currency)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs">{tForm("minTop8") || "Min Top 8"}</p>
                    <p className="font-semibold text-foreground">
                      {event.clubChampionship.eligibility?.minTop8 || 2}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{tForm("mustWinOne") || "Must Win One"}</p>
                    <p className="font-semibold text-foreground">
                      {event.clubChampionship.eligibility?.mustWinOne
                        ? (t("yes") || "Yes")
                        : (t("no") || "No")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOURNAMENTS TAB */}
        {activeTab === "tournaments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {t("linkedTournaments") || "Linked Tournaments"} ({tournaments.length})
              </h3>
              <Button
                size="sm"
                onClick={() => setShowLinkModal(true)}
                className="bg-green-primary hover:bg-green-600 text-white"
              >
                <Plus className="size-4 mr-1" />
                {t("linkTournament") || "Link Tournament"}
              </Button>
            </div>

            {/* Link Tournament Modal */}
            {showLinkModal && (
              <div className="p-4 rounded-xl border border-green-primary/20 bg-green-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">
                    {t("selectTournament") || "Select Tournament"}
                  </h4>
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <XCircle className="size-5" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={tournamentSearch}
                    onChange={(e) => setTournamentSearch(e.target.value)}
                    placeholder={t("searchTournaments") || "Search tournaments..."}
                    className={`${inputClass} pl-10 rtl:pl-3 rtl:pr-10`}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {availableTournaments.length > 0 ? (
                    availableTournaments.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleLinkTournament(t.id)}
                        disabled={isLoading}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-green-primary/10 transition-colors text-left cursor-pointer"
                      >
                        {t.game?.logo?.light ? (
                          <img src={t.game.logo.light} alt="" className="size-6 object-contain" />
                        ) : (
                          <Gamepad2 className="size-6 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.game?.name || ""}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t("noAvailableTournaments") || "No available tournaments"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tournament List */}
            {tournaments.length > 0 ? (
              <div className="space-y-3">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      {tournament.game?.logo?.light ? (
                        <img
                          src={tournament.game.logo.light}
                          alt=""
                          className="size-8 object-contain"
                        />
                      ) : (
                        <Gamepad2 className="size-8 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {tournament.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{tournament.game?.name}</span>
                          {tournament.prizePool > 0 && (
                            <span>
                              {formatCurrency(tournament.prizePool, tournament.currency)}
                            </span>
                          )}
                          <span>
                            {tournament.teams?.length || 0} {t("teams") || "teams"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => handleUnlinkTournament(tournament.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        {t("unlinkTournament") || "Unlink"}
                      </Button>
                    </div>

                    {/* Club Assignments */}
                    <div className="pl-11 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t("clubAssignments") || "Club Assignments"}
                        </span>
                        <button
                          onClick={() =>
                            setAssignTournamentId(
                              assignTournamentId === tournament.id
                                ? null
                                : tournament.id
                            )
                          }
                          className="text-xs text-green-primary hover:underline cursor-pointer"
                        >
                          <Plus className="size-3 inline mr-0.5" />
                          {t("assignClub") || "Assign Club"}
                        </button>
                      </div>

                      {/* Assign Club Form */}
                      {assignTournamentId === tournament.id && (
                        <div className="flex items-end gap-2 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                          <div className="flex-1 space-y-1">
                            <label className="text-xs text-muted-foreground">
                              {t("club") || "Club"}
                            </label>
                            <select
                              value={selectedClub}
                              onChange={(e) => {
                                setSelectedClub(e.target.value);
                                setSelectedTeam("");
                              }}
                              className={inputClass}
                            >
                              <option value="">{t("selectClub") || "Select Club"}</option>
                              {allClubs.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {selectedClub && (
                            <div className="flex-1 space-y-1">
                              <label className="text-xs text-muted-foreground">
                                {t("team") || "Team"}
                              </label>
                              <select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                className={inputClass}
                              >
                                <option value="">{t("selectTeam") || "Select Team"}</option>
                                {getClubTeams(selectedClub).map((ct) => (
                                  <option key={ct.team?.id || ct.team} value={ct.team?.id || ct.team}>
                                    {ct.team?.name || ct.team}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleAssignClub(tournament.id)}
                            disabled={isLoading}
                            className="bg-green-primary hover:bg-green-600 text-white"
                          >
                            {isLoading ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              t("assign") || "Assign"
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Existing Assignments */}
                      {tournament.clubAssignments?.length > 0 ? (
                        <div className="space-y-1">
                          {tournament.clubAssignments.map((assignment, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="size-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {assignment.club?.name || "Club"}
                                </span>
                                {assignment.team?.name && (
                                  <Badge variant="secondary" className="text-xs">
                                    {assignment.team.name}
                                  </Badge>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveAssignment(
                                    tournament.id,
                                    assignment.club?.id || assignment.club
                                  )
                                }
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          {t("noAssignments") || "No clubs assigned"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {t("noTournaments") || "No tournaments linked"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* CLUB CHAMPIONSHIP TAB */}
        {activeTab === "championship" && (
          <div className="space-y-4">
            {event.clubChampionship?.enabled ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {t("standings") || "Standings"}
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => setShowRecordModal(true)}
                    className="bg-green-primary hover:bg-green-600 text-white"
                  >
                    <Plus className="size-4 mr-1" />
                    {t("recordResult") || "Record Result"}
                  </Button>
                </div>

                {/* Record Result Modal */}
                {showRecordModal && (
                  <div className="p-4 rounded-xl border border-green-primary/20 bg-green-primary/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">
                        {t("recordResult") || "Record Result"}
                      </h4>
                      <button
                        onClick={() => setShowRecordModal(false)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <XCircle className="size-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          {t("selectTournament") || "Tournament"}
                        </label>
                        <select
                          value={resultTournament}
                          onChange={(e) => setResultTournament(e.target.value)}
                          className={inputClass}
                        >
                          <option value="">
                            {t("selectTournament") || "Select Tournament"}
                          </option>
                          {tournaments.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          {t("selectClub") || "Club"}
                        </label>
                        <select
                          value={resultClub}
                          onChange={(e) => setResultClub(e.target.value)}
                          className={inputClass}
                        >
                          <option value="">
                            {t("selectClub") || "Select Club"}
                          </option>
                          {allClubs.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          {t("placement") || "Placement"}
                        </label>
                        <input
                          type="number"
                          value={resultPlacement}
                          onChange={(e) => setResultPlacement(e.target.value)}
                          min="1"
                          placeholder="1"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          {t("teamOrPlayer") || "Team/Player ID"}
                        </label>
                        <input
                          type="text"
                          value={resultTeamOrPlayer}
                          onChange={(e) => setResultTeamOrPlayer(e.target.value)}
                          placeholder="Team or Player ID"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          {t("model") || "Type"}
                        </label>
                        <select
                          value={resultModel}
                          onChange={(e) => setResultModel(e.target.value)}
                          className={inputClass}
                        >
                          <option value="Team">{t("team") || "Team"}</option>
                          <option value="Player">{t("player") || "Player"}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleRecordResult}
                        disabled={isLoading}
                        className="bg-green-primary hover:bg-green-600 text-white"
                      >
                        {isLoading ? (
                          <Loader2 className="size-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="size-4 mr-1" />
                        )}
                        {t("confirmRecord") || "Confirm & Record"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Standings Table */}
                {standings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-white/10">
                          <th className="py-3 px-2 text-left text-xs font-medium text-muted-foreground">
                            #
                          </th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-muted-foreground">
                            {t("club") || "Club"}
                          </th>
                          <th className="py-3 px-2 text-center text-xs font-medium text-muted-foreground">
                            {t("totalPoints") || "Points"}
                          </th>
                          <th className="py-3 px-2 text-center text-xs font-medium text-muted-foreground">
                            {t("tournamentsPlayed") || "Played"}
                          </th>
                          <th className="py-3 px-2 text-center text-xs font-medium text-muted-foreground">
                            {t("top8Finishes") || "Top 8"}
                          </th>
                          <th className="py-3 px-2 text-center text-xs font-medium text-muted-foreground">
                            {t("wins") || "Wins"}
                          </th>
                          <th className="py-3 px-2 text-center text-xs font-medium text-muted-foreground">
                            {t("status") || "Status"}
                          </th>
                          <th className="py-3 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((standing) => {
                          const clubLogo =
                            standing.club?.logo?.light || standing.club?.logo?.dark;
                          const isExpanded = expandedStanding === standing.id;
                          return (
                            <>
                              <tr
                                key={standing.id}
                                className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                              >
                                <td className="py-3 px-2 font-bold text-foreground">
                                  {standing.position}
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2">
                                    {clubLogo ? (
                                      <img
                                        src={clubLogo}
                                        alt=""
                                        className="size-6 object-contain"
                                      />
                                    ) : (
                                      <Building2 className="size-6 text-muted-foreground" />
                                    )}
                                    <span className="font-medium text-foreground">
                                      {standing.club?.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-center font-bold text-foreground">
                                  {standing.totalPoints}
                                </td>
                                <td className="py-3 px-2 text-center text-muted-foreground">
                                  {standing.tournamentsPlayed}
                                </td>
                                <td className="py-3 px-2 text-center text-muted-foreground">
                                  {standing.top8Count}
                                </td>
                                <td className="py-3 px-2 text-center text-muted-foreground">
                                  {standing.winsCount}
                                </td>
                                <td className="py-3 px-2 text-center">
                                  {standing.isEligible ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                                    >
                                      {t("eligible") || "Eligible"}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-red-500/10 text-red-400 border-red-500/20 text-xs"
                                    >
                                      {t("notEligible") || "Not Eligible"}
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3 px-2">
                                  <button
                                    onClick={() =>
                                      setExpandedStanding(
                                        isExpanded ? null : standing.id
                                      )
                                    }
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="size-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="size-4 text-muted-foreground" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                              {/* Expanded Results */}
                              {isExpanded && standing.results?.length > 0 && (
                                <tr key={`${standing.id}-results`}>
                                  <td colSpan={8} className="p-0">
                                    <div className="bg-gray-50 dark:bg-white/[0.02] px-8 py-3 space-y-2">
                                      {standing.results.map((result, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1a1d2e]"
                                        >
                                          <div className="flex items-center gap-3">
                                            {result.game?.logo?.light ? (
                                              <img
                                                src={result.game.logo.light}
                                                alt=""
                                                className="size-5 object-contain"
                                              />
                                            ) : (
                                              <Gamepad2 className="size-5 text-muted-foreground" />
                                            )}
                                            <span className="text-sm text-foreground">
                                              {result.tournament?.name || "Tournament"}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="text-xs">
                                              #{result.placement}
                                            </Badge>
                                            <span className="text-sm font-semibold text-green-primary">
                                              {result.points} pts
                                            </span>
                                            <button
                                              onClick={() =>
                                                handleRemoveResult(
                                                  standing.club?.id,
                                                  result.tournament?.id
                                                )
                                              }
                                              className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                                            >
                                              <Trash2 className="size-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Medal className="size-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {t("noStandings") || "No standings recorded yet"}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {t("championshipNotEnabled") ||
                    "Club Championship is not enabled for this event"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("eventInfo") || "Event Information"}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">{tForm("status") || "Status"}</p>
                <Badge
                  variant="outline"
                  className={STATUS_COLORS[event.status] || STATUS_COLORS.upcoming}
                >
                  {t(event.status) || event.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{tForm("isOnline") || "Online"}</p>
                <p className="font-medium text-foreground">
                  {event.isOnline ? (t("yes") || "Yes") : (t("no") || "No")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t("rosterLockDate") || "Roster Lock"}</p>
                <p className="font-medium text-foreground">
                  {event.rosterLockDate
                    ? formatDate(event.rosterLockDate)
                    : (t("notSet") || "Not set")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{tForm("currency") || "Currency"}</p>
                <p className="font-medium text-foreground">{event.currency || "USD"}</p>
              </div>
            </div>

            {/* Points Distribution Table */}
            {event.clubChampionship?.enabled &&
              event.clubChampionship?.pointsDistribution?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {tForm("pointsDistribution") || "Points Distribution"}
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {event.clubChampionship.pointsDistribution.map((pd) => (
                      <div
                        key={pd.place}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-center"
                      >
                        <p className="text-xs text-muted-foreground">
                          #{pd.place}
                        </p>
                        <p className="font-bold text-foreground">{pd.points}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;

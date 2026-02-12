"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Trophy,
  Building2,
  Settings,
  Eye as EyeIcon,
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
  CheckCircle2,
  XCircle,
  Gamepad2,
  Hash,
  Loader2,
  Search,
  Star,
  Clock,
  Play,
  ArrowLeft,
  Pencil,
  Tv,
  Wifi,
  WifiOff,
  Power,
  CalendarRange,
  FileText,
  Check,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import {
  addTournamentToEvent,
  removeTournamentFromEvent,
  assignClubToTournament,
  removeClubFromTournament,
  recordClubResult,
  removeClubResult,
} from "@/app/[locale]/_Lib/actions";

// Status config with icons (for header badges)
const STATUS_CONFIG = {
  upcoming: { color: "bg-blue-500/10 text-blue-500 border-blue-500/30", icon: Clock },
  ongoing: { color: "bg-green-500/10 text-green-500 border-green-500/30", icon: Play },
  completed: { color: "bg-purple-500/10 text-purple-500 border-purple-500/30", icon: CheckCircle2 },
  cancelled: { color: "bg-red-500/10 text-red-500 border-red-500/30", icon: XCircle },
};

// Kept for tournament tab badges
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
  const [clubPopoverOpen, setClubPopoverOpen] = useState(false);
  const [teamPopoverOpen, setTeamPopoverOpen] = useState(false);
  const [clubSearch, setClubSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

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

  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.upcoming;
  const StatusIcon = statusConfig.icon;

  const tabs = [
    { id: "overview", label: t("overview") || "Overview", icon: EyeIcon },
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
      {/* Header - Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events-management">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
        </div>
        <Link href={`/dashboard/events-management/edit/${event.id}`}>
          <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
            <Pencil className="size-4" />
            {t("edit") || "Edit Event"}
          </Button>
        </Link>
      </div>

      {/* Header - Event Identity */}
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-start gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            {eventLogo ? (
              <img
                src={eventLogo}
                alt={event.name}
                className="size-24 rounded-2xl object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="size-24 rounded-2xl bg-green-primary/10 flex items-center justify-center ring-2 ring-green-primary/20">
                <CalendarDays className="size-10 text-green-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground truncate">{event.name}</h2>
              {event.isFeatured && (
                <Star className="size-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              )}
            </div>

            {/* Badge Row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {/* Status Badge */}
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                <StatusIcon className="size-4" />
                {t(event.status) || event.status}
              </span>

              {/* Online/Offline */}
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                event.isOnline
                  ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/30"
                  : "bg-gray-500/10 text-gray-400 border-gray-500/30"
              }`}>
                {event.isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
                {event.isOnline ? t("online") || "Online" : t("offline") || "Offline"}
              </span>

              {/* Active Status */}
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                event.isActive
                  ? "bg-green-500/10 text-green-500 border-green-500/30"
                  : "bg-red-500/10 text-red-500 border-red-500/30"
              }`}>
                <Power className="size-4" />
                {event.isActive ? t("active") || "Active" : t("inactive") || "Inactive"}
              </span>

              {/* Club Championship Badge */}
              {event.clubChampionship?.enabled && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-purple-500/10 text-purple-500 border-purple-500/30">
                  <Trophy className="size-4" />
                  CC
                </span>
              )}
            </div>

            {/* Subtitle Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarRange className="size-4" />
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {event.location}
                </span>
              )}
              {event.prizePool > 0 && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="size-4" />
                  {formatCurrency(event.prizePool, event.currency)}
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

      {/* OVERVIEW TAB - 3-column layout */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-5 text-green-primary" />
                {t("description") || "Description"}
              </h3>
              {event.description ? (
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              ) : (
                <p className="text-muted-foreground italic">{t("noDescription") || "No description provided"}</p>
              )}
            </div>

            {/* Schedule */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarDays className="size-5 text-green-primary" />
                {t("schedule") || "Schedule"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label={t("startDate") || "Start Date"}
                  value={formatDate(event.startDate) || "-"}
                  icon={<CalendarRange className="size-4" />}
                />
                <InfoItem
                  label={t("endDate") || "End Date"}
                  value={formatDate(event.endDate) || "-"}
                  icon={<CalendarRange className="size-4" />}
                />
                {event.rosterLockDate && (
                  <InfoItem
                    label={t("rosterLockDate") || "Roster Lock Date"}
                    value={formatDate(event.rosterLockDate)}
                    icon={<CalendarRange className="size-4" />}
                  />
                )}
              </div>
            </div>

            {/* Club Championship Summary */}
            {event.clubChampionship?.enabled && (
              <div className="glass rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="size-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("clubChampionship") || "Club Championship"}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {event.clubChampionship.prizePool > 0 && (
                    <div className="p-4 rounded-xl bg-purple-500/5">
                      <p className="text-muted-foreground text-xs mb-1">{tForm("championshipPrizePool") || "Prize Pool"}</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(event.clubChampionship.prizePool, event.currency)}
                      </p>
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-purple-500/5">
                    <p className="text-muted-foreground text-xs mb-1">{tForm("minTop8") || "Min Top 8"}</p>
                    <p className="font-semibold text-foreground">
                      {event.clubChampionship.eligibility?.minTop8 || 2}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/5">
                    <p className="text-muted-foreground text-xs mb-1">{tForm("mustWinOne") || "Must Win One"}</p>
                    <p className="font-semibold text-foreground">
                      {event.clubChampionship.eligibility?.mustWinOne
                        ? (t("yes") || "Yes")
                        : (t("no") || "No")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <EyeIcon className="size-5 text-green-primary" />
                {t("images") || "Images"}
              </h3>
              <div className="space-y-6">
                {/* Logo Section */}
                {(event.logo?.light || event.logo?.dark) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t("logo") || "Logo"} (1:1)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {event.logo?.light && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                          <div className="aspect-square w-full rounded-xl bg-white p-2 ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={event.logo.light}
                              alt="Logo Light"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                      {event.logo?.dark && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                          <div className="aspect-square w-full rounded-xl bg-[#1a1d2e] p-2 ring-1 ring-white/10 overflow-hidden">
                            <img
                              src={event.logo.dark}
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
                {(event.coverImage?.light || event.coverImage?.dark) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t("coverImage") || "Cover Image"} (3:2)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {event.coverImage?.light && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                          <div className="aspect-[3/2] w-full rounded-xl ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={event.coverImage.light}
                              alt="Cover Light"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {event.coverImage?.dark && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                          <div className="aspect-[3/2] w-full rounded-xl ring-1 ring-white/10 overflow-hidden">
                            <img
                              src={event.coverImage.dark}
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
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Prize Pool */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="size-5 text-green-primary" />
                {t("prizePool") || "Prize Pool"}
              </h3>
              <p className="text-3xl font-bold text-green-primary">
                {formatCurrency(event.prizePool, event.currency)}
              </p>
            </div>

            {/* Stats */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <EyeIcon className="size-5 text-green-primary" />
                {t("stats") || "Statistics"}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("tournamentCount") || "Tournaments"}</span>
                  <span className="font-medium text-foreground">{event.tournamentsCount || tournaments.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("clubCount") || "Clubs"}</span>
                  <span className="font-medium text-foreground">{event.clubsCount || clubs.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("followers") || "Followers"}</span>
                  <span className="font-medium text-foreground">{event.followersCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-green-primary" />
                {t("location") || "Location"}
              </h3>
              {event.country && (
                <div className="flex items-center gap-3 mb-2">
                  {event.country.flag && (
                    <img
                      src={event.country.flag}
                      alt={event.country.name}
                      className="size-6 rounded"
                    />
                  )}
                  <span className="text-foreground font-medium">{event.country.name}</span>
                  {event.country.code && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {event.country.code}
                    </span>
                  )}
                </div>
              )}
              {event.location && (
                <p className="text-muted-foreground">{event.location}</p>
              )}
            </div>

            {/* Links */}
            {(event.streamUrl || event.websiteUrl) && (
              <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <LinkIcon className="size-5 text-green-primary" />
                  {t("links") || "Links"}
                </h3>
                <div className="space-y-3">
                  {event.streamUrl && (
                    <a
                      href={event.streamUrl}
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
                  {event.websiteUrl && (
                    <a
                      href={event.websiteUrl}
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
          </div>
        </div>
      )}

      {/* TOURNAMENTS TAB - full width */}
      {activeTab === "tournaments" && (
        <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
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
                    availableTournaments.map((tr) => (
                      <button
                        key={tr.id}
                        onClick={() => handleLinkTournament(tr.id)}
                        disabled={isLoading}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-green-primary/10 transition-colors text-left cursor-pointer"
                      >
                        {tr.logo?.light ? (
                          <img src={tr.logo.light} alt="" className="size-8 rounded-lg object-contain bg-muted/50 p-0.5" />
                        ) : (
                          <div className="size-8 rounded-lg bg-muted/50 flex items-center justify-center">
                            <Trophy className="size-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{tr.name}</p>
                          <p className="text-xs text-muted-foreground">{tr.game?.name || ""}</p>
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
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden"
                  >
                    {/* Tournament Header */}
                    <div className="p-4 flex items-center gap-4">
                      {tournament.logo?.light ? (
                        <img
                          src={tournament.logo.light}
                          alt=""
                          className="size-14 rounded-xl object-contain bg-muted/30 ring-1 ring-gray-200 dark:ring-white/10 p-1"
                        />
                      ) : (
                        <div className="size-14 rounded-xl bg-gradient-to-br from-green-primary/10 to-green-primary/5 ring-1 ring-green-primary/20 flex items-center justify-center">
                          <Trophy className="size-6 text-green-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate text-base">
                          {tournament.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {tournament.game?.name && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              <Gamepad2 className="size-3" />
                              {tournament.game.name}
                            </span>
                          )}
                          {tournament.prizePool > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              <DollarSign className="size-3" />
                              {formatCurrency(tournament.prizePool, tournament.currency)}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <Users className="size-3" />
                            {tournament.teams?.length || 0} {t("teams") || "teams"}
                          </span>
                          {tournament.status && (
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                              tournament.status === "ongoing" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                              tournament.status === "completed" ? "bg-gray-500/10 text-gray-600 dark:text-gray-400" :
                              tournament.status === "upcoming" ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {tournament.status === "ongoing" ? <Play className="size-3" /> :
                               tournament.status === "completed" ? <CheckCircle2 className="size-3" /> :
                               <Clock className="size-3" />}
                              {tournament.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600 shrink-0"
                        onClick={() => handleUnlinkTournament(tournament.id)}
                        disabled={isLoading}
                        title={t("unlinkTournament") || "Unlink"}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    {/* Club Assignments Section */}
                    <div className="border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {t("clubAssignments") || "Club Assignments"}
                          </span>
                          {tournament.clubAssignments?.length > 0 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-primary/10 text-green-primary">
                              {tournament.clubAssignments.length}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setAssignTournamentId(
                              assignTournamentId === tournament.id
                                ? null
                                : tournament.id
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-green-primary hover:text-green-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-green-primary/10"
                        >
                          <Plus className="size-3.5" />
                          {t("assignClub") || "Assign Club"}
                        </button>
                      </div>

                      {/* Assign Club Form */}
                      {assignTournamentId === tournament.id && (() => {
                        const selectedClubObj = allClubs.find((c) => c.id === selectedClub);
                        const clubTeams = selectedClub ? getClubTeams(selectedClub) : [];
                        const selectedTeamObj = clubTeams.find((ct) => (ct.team?.id || ct.team) === selectedTeam);
                        const filteredClubs = allClubs.filter((c) =>
                          c.name?.toLowerCase().includes(clubSearch.toLowerCase())
                        );
                        const filteredTeams = clubTeams.filter((ct) =>
                          (ct.team?.name || "").toLowerCase().includes(teamSearch.toLowerCase())
                        );
                        return (
                        <div className="mb-3 p-3 rounded-xl border border-green-primary/20 bg-green-primary/5 dark:bg-green-primary/5 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Club Popover */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                {t("club") || "Club"}
                              </label>
                              <Popover open={clubPopoverOpen} onOpenChange={setClubPopoverOpen}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className={`${inputClass} flex items-center justify-between gap-2 cursor-pointer`}
                                  >
                                    {selectedClubObj ? (
                                      <span className="flex items-center gap-2 truncate">
                                        {selectedClubObj.logo?.light ? (
                                          <img src={selectedClubObj.logo.light} alt="" className="size-5 rounded object-contain" />
                                        ) : (
                                          <Building2 className="size-4 text-muted-foreground shrink-0" />
                                        )}
                                        <span className="truncate">{selectedClubObj.name}</span>
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">{t("selectClub") || "Select Club"}</span>
                                    )}
                                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[280px] p-0" align="start">
                                  <Command>
                                    <div className="flex items-center border-b border-gray-200 dark:border-white/10 px-3">
                                      <Search className="size-4 text-muted-foreground shrink-0" />
                                      <input
                                        value={clubSearch}
                                        onChange={(e) => setClubSearch(e.target.value)}
                                        placeholder={t("searchClubs") || "Search clubs..."}
                                        className="flex h-10 w-full bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground"
                                      />
                                    </div>
                                    <CommandList className="max-h-[200px]">
                                      <CommandGroup>
                                        {filteredClubs.length > 0 ? (
                                          filteredClubs.map((c) => (
                                            <CommandItem
                                              key={c.id}
                                              value={c.name}
                                              onSelect={() => {
                                                setSelectedClub(c.id);
                                                setSelectedTeam("");
                                                setClubPopoverOpen(false);
                                                setClubSearch("");
                                              }}
                                              className="flex items-center gap-2 cursor-pointer"
                                            >
                                              {c.logo?.light ? (
                                                <img src={c.logo.light} alt="" className="size-6 rounded object-contain bg-muted/30 p-0.5" />
                                              ) : (
                                                <div className="size-6 rounded bg-muted/30 flex items-center justify-center">
                                                  <Building2 className="size-3.5 text-muted-foreground" />
                                                </div>
                                              )}
                                              <span className="flex-1 truncate">{c.name}</span>
                                              {selectedClub === c.id && (
                                                <Check className="size-4 text-green-primary shrink-0" />
                                              )}
                                            </CommandItem>
                                          ))
                                        ) : (
                                          <p className="text-sm text-muted-foreground text-center py-4">
                                            {t("noClubsFound") || "No clubs found"}
                                          </p>
                                        )}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Team Popover */}
                            {selectedClub && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                  {t("team") || "Team"}
                                </label>
                                <Popover open={teamPopoverOpen} onOpenChange={setTeamPopoverOpen}>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${inputClass} flex items-center justify-between gap-2 cursor-pointer`}
                                    >
                                      {selectedTeamObj ? (
                                        <span className="flex items-center gap-2 truncate">
                                          {selectedTeamObj.team?.logo?.light ? (
                                            <img src={selectedTeamObj.team.logo.light} alt="" className="size-5 rounded object-contain" />
                                          ) : (
                                            <Users className="size-4 text-muted-foreground shrink-0" />
                                          )}
                                          <span className="truncate">{selectedTeamObj.team?.name || selectedTeamObj.team}</span>
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground">{t("selectTeam") || "Select Team"}</span>
                                      )}
                                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[280px] p-0" align="start">
                                    <Command>
                                      <div className="flex items-center border-b border-gray-200 dark:border-white/10 px-3">
                                        <Search className="size-4 text-muted-foreground shrink-0" />
                                        <input
                                          value={teamSearch}
                                          onChange={(e) => setTeamSearch(e.target.value)}
                                          placeholder={t("searchTeams") || "Search teams..."}
                                          className="flex h-10 w-full bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground"
                                        />
                                      </div>
                                      <CommandList className="max-h-[200px]">
                                        <CommandGroup>
                                          {filteredTeams.length > 0 ? (
                                            filteredTeams.map((ct) => {
                                              const teamId = ct.team?.id || ct.team;
                                              const teamName = ct.team?.name || ct.team;
                                              return (
                                                <CommandItem
                                                  key={teamId}
                                                  value={teamName}
                                                  onSelect={() => {
                                                    setSelectedTeam(teamId);
                                                    setTeamPopoverOpen(false);
                                                    setTeamSearch("");
                                                  }}
                                                  className="flex items-center gap-2 cursor-pointer"
                                                >
                                                  {ct.team?.logo?.light ? (
                                                    <img src={ct.team.logo.light} alt="" className="size-6 rounded object-contain bg-muted/30 p-0.5" />
                                                  ) : (
                                                    <div className="size-6 rounded bg-muted/30 flex items-center justify-center">
                                                      <Users className="size-3.5 text-muted-foreground" />
                                                    </div>
                                                  )}
                                                  <span className="flex-1 truncate">{teamName}</span>
                                                  {selectedTeam === teamId && (
                                                    <Check className="size-4 text-green-primary shrink-0" />
                                                  )}
                                                </CommandItem>
                                              );
                                            })
                                          ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                              {t("noTeamsFound") || "No teams found"}
                                            </p>
                                          )}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleAssignClub(tournament.id)}
                              disabled={isLoading}
                              className="bg-green-primary hover:bg-green-600 text-white"
                            >
                              {isLoading ? (
                                <Loader2 className="size-4 animate-spin mr-1.5" />
                              ) : (
                                <Plus className="size-4 mr-1.5" />
                              )}
                              {t("assign") || "Assign"}
                            </Button>
                          </div>
                        </div>
                        );
                      })()}

                      {/* Existing Assignments */}
                      {tournament.clubAssignments?.length > 0 ? (
                        <div className="space-y-2">
                          {tournament.clubAssignments.map((assignment, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5"
                            >
                              <div className="flex items-center gap-3">
                                {assignment.club?.logo?.light ? (
                                  <img
                                    src={assignment.club.logo.light}
                                    alt=""
                                    className="size-8 rounded-lg object-contain bg-muted/30 p-0.5"
                                  />
                                ) : (
                                  <div className="size-8 rounded-lg bg-muted/30 flex items-center justify-center">
                                    <Building2 className="size-4 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <span className="text-sm font-medium text-foreground">
                                    {assignment.club?.name || "Club"}
                                  </span>
                                  {assignment.team?.name && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Users className="size-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">{assignment.team.name}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveAssignment(
                                    tournament.id,
                                    assignment.club?.id || assignment.club
                                  )
                                }
                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4 text-center">
                          <p className="text-xs text-muted-foreground/60">
                            {t("noAssignments") || "No clubs assigned"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                  <Trophy className="size-7 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("noTournaments") || "No tournaments linked"}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {t("linkTournamentHint") || "Link tournaments to this event to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CLUB CHAMPIONSHIP TAB - full width */}
      {activeTab === "championship" && (
        <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
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
        </div>
      )}

      {/* SETTINGS TAB - full width */}
      {activeTab === "settings" && (
        <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
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
        </div>
      )}
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

export default EventDetails;

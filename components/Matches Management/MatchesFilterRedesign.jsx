"use client";

import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Trophy,
  Calendar,
  Wifi,
  WifiOff,
  Clock,
  Users,
  CalendarRange,
  Check,
  Circle,
  Radio,
  CheckCircle2,
  PauseCircle,
  XCircle,
  ListFilter,
  Globe,
  MapPin,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "allStatus", icon: ListFilter, color: "text-gray-500" },
  { value: "scheduled", label: "scheduled", icon: Clock, color: "text-blue-500" },
  { value: "live", label: "live", icon: Radio, color: "text-red-500" },
  { value: "completed", label: "completed", icon: CheckCircle2, color: "text-green-500" },
  { value: "postponed", label: "postponed", icon: PauseCircle, color: "text-yellow-500" },
  { value: "cancelled", label: "cancelled", icon: XCircle, color: "text-gray-400" },
];

const ONLINE_OPTIONS = [
  { value: "all", label: "allMatches", icon: Globe, color: "text-gray-500" },
  { value: "true", label: "onlineOnly", icon: Wifi, color: "text-green-500" },
  { value: "false", label: "offlineOnly", icon: MapPin, color: "text-blue-500" },
];

// Quick date presets
const getQuickDateRanges = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const formatDate = (d) => d.toISOString().split("T")[0];

  return [
    {
      label: "today",
      value: "today",
      date: formatDate(today),
    },
    {
      label: "tomorrow",
      value: "tomorrow",
      date: formatDate(tomorrow),
    },
    {
      label: "thisWeek",
      value: "thisWeek",
      dateFrom: formatDate(weekStart),
      dateTo: formatDate(weekEnd),
    },
    {
      label: "thisMonth",
      value: "thisMonth",
      dateFrom: formatDate(monthStart),
      dateTo: formatDate(monthEnd),
    },
  ];
};

function MatchesFilterRedesign({ games = [], tournaments = [], teams = [] }) {
  const t = useTranslations("MatchesFilter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Search states for dropdowns
  const [gameSearchOpen, setGameSearchOpen] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [tournamentSearchOpen, setTournamentSearchOpen] = useState(false);
  const [tournamentSearch, setTournamentSearch] = useState("");
  const [teamSearchOpen, setTeamSearchOpen] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [matchTypeOpen, setMatchTypeOpen] = useState(false);

  const searchTimeoutRef = useRef(null);

  const currentSearch = searchParams.get("search") || "";
  const currentGame = searchParams.get("game") || "all";
  const currentTournament = searchParams.get("tournament") || "all";
  const currentStatus = searchParams.get("status") || "all";
  const currentDate = searchParams.get("date") || "";
  const currentDateFrom = searchParams.get("dateFrom") || "";
  const currentDateTo = searchParams.get("dateTo") || "";
  const currentOnline = searchParams.get("isOnline") || "all";
  const currentTeam = searchParams.get("team") || "all";

  // Sync search term with URL
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Count active filters
  const activeFilters = [
    currentGame !== "all",
    currentTournament !== "all",
    currentStatus !== "all",
    currentDate !== "",
    currentDateFrom !== "",
    currentDateTo !== "",
    currentOnline !== "all",
    currentTeam !== "all",
  ].filter(Boolean).length;

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const updateMultipleParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname);
    setSearchTerm("");
  }, [pathname, router]);

  // Real-time search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      updateParams("search", value);
    }, 400);
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateParams("search", "");
  };

  // Quick date handler
  const handleQuickDate = (preset) => {
    if (preset.date) {
      updateMultipleParams({
        date: preset.date,
        dateFrom: "",
        dateTo: "",
      });
    } else {
      updateMultipleParams({
        date: "",
        dateFrom: preset.dateFrom,
        dateTo: preset.dateTo,
      });
    }
  };

  // Clear date filters
  const clearDateFilters = () => {
    updateMultipleParams({
      date: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const quickDateRanges = getQuickDateRanges();
  const hasDateFilter = currentDate || currentDateFrom || currentDateTo;

  // Filter games based on search
  const filteredGames = useMemo(() => {
    if (!gameSearch) return games || [];
    return (games || []).filter((game) =>
      game.name.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [games, gameSearch]);

  // Get selected game name
  const selectedGameName = useMemo(() => {
    if (currentGame === "all") return null;
    const game = games?.find((g) => (g.id || g._id) === currentGame);
    return game?.name;
  }, [currentGame, games]);

  // Filter tournaments based on search
  const filteredTournaments = useMemo(() => {
    if (!tournamentSearch) return tournaments || [];
    return (tournaments || []).filter((tournament) =>
      tournament.name.toLowerCase().includes(tournamentSearch.toLowerCase())
    );
  }, [tournaments, tournamentSearch]);

  // Get selected tournament name
  const selectedTournamentName = useMemo(() => {
    if (currentTournament === "all") return null;
    const tournament = tournaments?.find((t) => (t.id || t._id) === currentTournament);
    return tournament?.name;
  }, [currentTournament, tournaments]);

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!teamSearch) return teams || [];
    return (teams || []).filter((team) =>
      team.name.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teams, teamSearch]);

  // Get selected team name
  const selectedTeamName = useMemo(() => {
    if (currentTeam === "all") return null;
    const team = teams?.find((t) => (t.id || t._id) === currentTeam);
    return team?.name;
  }, [currentTeam, teams]);

  // Get selected status
  const selectedStatus = useMemo(() => {
    return STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];
  }, [currentStatus]);

  // Get selected match type
  const selectedMatchType = useMemo(() => {
    return ONLINE_OPTIONS.find((o) => o.value === currentOnline) || ONLINE_OPTIONS[0];
  }, [currentOnline]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input - Real-time */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder") || "Search by team name..."}
            className="w-full h-10 pl-10 rtl:pl-4 rtl:pr-10 pr-10 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Quick Date Filters */}
        <div className="flex gap-2">
          {quickDateRanges.slice(0, 2).map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              onClick={() => handleQuickDate(preset)}
              className={`h-10 px-3 rounded-xl border border-gray-200 dark:border-transparent bg-white dark:bg-[#1a1d2e] hover:bg-gray-100 dark:hover:bg-[#252a3d] transition-all ${
                (preset.date && currentDate === preset.date) ||
                (preset.dateFrom && currentDateFrom === preset.dateFrom)
                  ? "!bg-green-primary/20 !text-green-primary ring-1 ring-green-primary/30 !border-green-primary/30"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Clock className="size-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
              {t(preset.label) || preset.label}
            </Button>
          ))}
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-10 px-4 rounded-xl border-0 bg-gray-100 dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] transition-all ${
            activeFilters > 0 ? "text-green-primary" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Filter className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("filters") || "Filters"}
          {activeFilters > 0 && (
            <span className="ml-2 rtl:ml-0 rtl:mr-2 size-5 rounded-full bg-green-primary text-white text-xs flex items-center justify-center">
              {activeFilters}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="size-4 ml-2 rtl:ml-0 rtl:mr-2" />
          ) : (
            <ChevronDown className="size-4 ml-2 rtl:ml-0 rtl:mr-2" />
          )}
        </Button>

        {/* Clear All Button */}
        {(activeFilters > 0 || searchTerm) && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="h-10 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <X className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("clearAll") || "Clear All"}
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-[#0f1118] rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Game Filter - Enhanced with Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Gamepad2 className="size-4" />
                {t("game") || "Game"}
              </label>
              <Popover open={gameSearchOpen} onOpenChange={setGameSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={gameSearchOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {selectedGameName ? (
                        <>
                          {games?.find((g) => (g.id || g._id) === currentGame)?.logo && (
                            <img
                              src={games?.find((g) => (g.id || g._id) === currentGame)?.logo?.light || games?.find((g) => (g.id || g._id) === currentGame)?.logo?.dark}
                              alt=""
                              className="size-5 rounded object-contain"
                            />
                          )}
                          <span className="text-gray-900 dark:text-white truncate">{selectedGameName}</span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t("allGames") || "All Games"}</span>
                      )}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("searchGame") || "Search game..."}
                      value={gameSearch}
                      onValueChange={setGameSearch}
                    />
                    <CommandList>
                      <CommandEmpty>{t("noGameFound") || "No game found"}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-games"
                          onSelect={() => {
                            updateParams("game", "all");
                            setGameSearchOpen(false);
                            setGameSearch("");
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              currentGame === "all" ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {t("allGames") || "All Games"}
                        </CommandItem>
                        {filteredGames.map((game) => {
                          const gameId = game.id || game._id;
                          const gameLogo = game.logo?.light || game.logo?.dark;
                          return (
                            <CommandItem
                              key={gameId}
                              value={game.name}
                              onSelect={() => {
                                updateParams("game", gameId);
                                setGameSearchOpen(false);
                                setGameSearch("");
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  currentGame === gameId ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {gameLogo && (
                                <img
                                  src={gameLogo}
                                  alt={game.name}
                                  className="size-5 rounded mr-2 object-contain"
                                />
                              )}
                              <span className="truncate">{game.name}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tournament Filter - Enhanced with Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Trophy className="size-4" />
                {t("tournament") || "Tournament"}
              </label>
              <Popover open={tournamentSearchOpen} onOpenChange={setTournamentSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={tournamentSearchOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {selectedTournamentName ? (
                        <>
                          {tournaments?.find((t) => (t.id || t._id) === currentTournament)?.logo && (
                            <img
                              src={tournaments?.find((t) => (t.id || t._id) === currentTournament)?.logo?.light || tournaments?.find((t) => (t.id || t._id) === currentTournament)?.logo?.dark}
                              alt=""
                              className="size-5 rounded object-contain"
                            />
                          )}
                          <span className="text-gray-900 dark:text-white truncate">{selectedTournamentName}</span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t("allTournaments") || "All Tournaments"}</span>
                      )}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("searchTournament") || "Search tournament..."}
                      value={tournamentSearch}
                      onValueChange={setTournamentSearch}
                    />
                    <CommandList>
                      <CommandEmpty>{t("noTournamentFound") || "No tournament found"}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-tournaments"
                          onSelect={() => {
                            updateParams("tournament", "all");
                            setTournamentSearchOpen(false);
                            setTournamentSearch("");
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              currentTournament === "all" ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {t("allTournaments") || "All Tournaments"}
                        </CommandItem>
                        {filteredTournaments.map((tournament) => {
                          const tournamentId = tournament.id || tournament._id;
                          const tournamentLogo = tournament.logo?.light || tournament.logo?.dark;
                          return (
                            <CommandItem
                              key={tournamentId}
                              value={tournament.name}
                              onSelect={() => {
                                updateParams("tournament", tournamentId);
                                setTournamentSearchOpen(false);
                                setTournamentSearch("");
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  currentTournament === tournamentId ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {tournamentLogo && (
                                <img
                                  src={tournamentLogo}
                                  alt={tournament.name}
                                  className="size-5 rounded mr-2 object-contain"
                                />
                              )}
                              <span className="truncate">{tournament.name}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Team Filter - Enhanced with Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="size-4" />
                {t("team") || "Team"}
              </label>
              <Popover open={teamSearchOpen} onOpenChange={setTeamSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={teamSearchOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {selectedTeamName ? (
                        <>
                          {teams?.find((t) => (t.id || t._id) === currentTeam)?.logo && (
                            <img
                              src={teams?.find((t) => (t.id || t._id) === currentTeam)?.logo?.light || teams?.find((t) => (t.id || t._id) === currentTeam)?.logo?.dark}
                              alt=""
                              className="size-5 rounded object-contain"
                            />
                          )}
                          <span className="text-gray-900 dark:text-white truncate">{selectedTeamName}</span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t("allTeams") || "All Teams"}</span>
                      )}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("searchTeam") || "Search team..."}
                      value={teamSearch}
                      onValueChange={setTeamSearch}
                    />
                    <CommandList>
                      <CommandEmpty>{t("noTeamFound") || "No team found"}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-teams"
                          onSelect={() => {
                            updateParams("team", "all");
                            setTeamSearchOpen(false);
                            setTeamSearch("");
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              currentTeam === "all" ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {t("allTeams") || "All Teams"}
                        </CommandItem>
                        {filteredTeams.map((team) => {
                          const teamId = team.id || team._id;
                          const teamLogo = team.logo?.light || team.logo?.dark;
                          return (
                            <CommandItem
                              key={teamId}
                              value={team.name}
                              onSelect={() => {
                                updateParams("team", teamId);
                                setTeamSearchOpen(false);
                                setTeamSearch("");
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  currentTeam === teamId ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {teamLogo && (
                                <img
                                  src={teamLogo}
                                  alt={team.name}
                                  className="size-5 rounded mr-2 object-contain"
                                />
                              )}
                              <span className="truncate">{team.name}</span>
                              {team.shortName && (
                                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                  ({team.shortName})
                                </span>
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter - Enhanced with Icons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ListFilter className="size-4" />
                {t("status") || "Status"}
              </label>
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={statusOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const StatusIcon = selectedStatus.icon;
                        return (
                          <>
                            <StatusIcon className={`size-4 ${selectedStatus.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedStatus.label) || selectedStatus.label}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {STATUS_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={() => {
                                updateParams("status", option.value);
                                setStatusOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentStatus === option.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <OptionIcon className={`size-4 ${option.color}`} />
                              <span>{t(option.label) || option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Match Type Filter - Enhanced with Icons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe className="size-4" />
                {t("matchType") || "Match Type"}
              </label>
              <Popover open={matchTypeOpen} onOpenChange={setMatchTypeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={matchTypeOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const TypeIcon = selectedMatchType.icon;
                        return (
                          <>
                            <TypeIcon className={`size-4 ${selectedMatchType.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedMatchType.label) || selectedMatchType.label}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {ONLINE_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={() => {
                                updateParams("isOnline", option.value);
                                setMatchTypeOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentOnline === option.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <OptionIcon className={`size-4 ${option.color}`} />
                              <span>{t(option.label) || option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CalendarRange className="size-4" />
                {t("dateRange") || "Date Range"}
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Quick Date Buttons */}
                <div className="flex gap-1 flex-wrap">
                  {quickDateRanges.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDate(preset)}
                      className={`h-8 px-2.5 text-xs rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-[#151823] hover:bg-gray-100 dark:hover:bg-[#252a3d] transition-all ${
                        (preset.date && currentDate === preset.date) ||
                        (preset.dateFrom && currentDateFrom === preset.dateFrom)
                          ? "!bg-green-primary/20 !text-green-primary ring-1 ring-green-primary/30 !border-green-primary/30"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {t(preset.label) || preset.label}
                    </Button>
                  ))}
                </div>

                {/* Custom Date Range */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 px-2.5 text-xs rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-[#151823] hover:bg-gray-100 dark:hover:bg-[#252a3d] ${
                        hasDateFilter && !quickDateRanges.some(
                          (p) =>
                            (p.date && currentDate === p.date) ||
                            (p.dateFrom && currentDateFrom === p.dateFrom)
                        )
                          ? "!bg-green-primary/20 !text-green-primary ring-1 ring-green-primary/30 !border-green-primary/30"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Calendar className="size-3.5 mr-1" />
                      {t("custom") || "Custom"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 bg-white dark:bg-[#12141c] border border-gray-200 dark:border-white/10" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t("specificDate") || "Specific Date"}
                        </label>
                        <Input
                          type="date"
                          value={currentDate}
                          onChange={(e) => {
                            updateMultipleParams({
                              date: e.target.value,
                              dateFrom: "",
                              dateTo: "",
                            });
                          }}
                          className="h-10 bg-gray-50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg"
                        />
                      </div>
                      <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          {t("orDateRange") || "Or Date Range"}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {t("from") || "From"}
                            </label>
                            <Input
                              type="date"
                              value={currentDateFrom}
                              onChange={(e) => {
                                updateMultipleParams({
                                  date: "",
                                  dateFrom: e.target.value,
                                });
                              }}
                              className="h-10 bg-gray-50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {t("to") || "To"}
                            </label>
                            <Input
                              type="date"
                              value={currentDateTo}
                              onChange={(e) => {
                                updateMultipleParams({
                                  date: "",
                                  dateTo: e.target.value,
                                });
                              }}
                              className="h-10 bg-gray-50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Clear Date Filter */}
                {hasDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateFilters}
                    className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <X className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchesFilterRedesign;

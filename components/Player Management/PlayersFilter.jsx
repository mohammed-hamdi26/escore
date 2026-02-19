"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Gamepad2,
  Users,
  Globe,
  ListFilter,
  UserCheck,
  UserX,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
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
import { useTranslations } from "next-intl";
import { getImgUrl } from "@/lib/utils";

const FREE_AGENT_OPTIONS = [
  { value: "", label: "allPlayers", icon: ListFilter, color: "text-gray-500" },
  { value: "true", label: "freeAgents", icon: UserCheck, color: "text-green-500" },
  { value: "false", label: "teamPlayers", icon: Users, color: "text-blue-500" },
];

const COUNTRIES = [
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
];

function PlayersFilter({ games = [], teams = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("playerList");
  const searchTimeoutRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Popover states
  const [gameSearchOpen, setGameSearchOpen] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [teamSearchOpen, setTeamSearchOpen] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  // Get current filter values from URL
  const currentSearch = searchParams.get("search") || "";
  const currentGame = searchParams.get("game") || "";
  const currentTeam = searchParams.get("team") || "";
  const currentCountry = searchParams.get("country") || "";
  const currentFreeAgent = searchParams.get("isFreeAgent") || "";

  // Sync search term with URL
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Count active filters
  const activeFiltersCount = [currentGame, currentTeam, currentCountry, currentFreeAgent].filter(Boolean).length;

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearAllFilters = () => {
    router.push(pathname);
    setSearchTerm("");
  };

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

  // Filter games based on search
  const filteredGames = useMemo(() => {
    if (!gameSearch) return games;
    return games.filter((game) =>
      game.name.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [games, gameSearch]);

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!teamSearch) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teams, teamSearch]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES;
    return COUNTRIES.filter((country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Get selected values
  const selectedGameName = useMemo(() => {
    if (!currentGame) return null;
    const game = games.find((g) => (g.id || g._id) === currentGame);
    return game?.name;
  }, [currentGame, games]);

  const selectedTeamName = useMemo(() => {
    if (!currentTeam) return null;
    const team = teams.find((t) => (t.id || t._id) === currentTeam);
    return team?.name;
  }, [currentTeam, teams]);

  const selectedCountry = useMemo(() => {
    if (!currentCountry) return null;
    return COUNTRIES.find((c) => c.code === currentCountry);
  }, [currentCountry]);

  const selectedStatus = useMemo(() => {
    return FREE_AGENT_OPTIONS.find((s) => s.value === currentFreeAgent) || FREE_AGENT_OPTIONS[0];
  }, [currentFreeAgent]);

  return (
    <div className="space-y-4">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title") || "Players"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("subtitle") || "Manage all players in the system"}
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/player-management/add")}
          className="bg-green-primary hover:bg-green-primary/90 text-white gap-2"
        >
          <Plus className="size-4" />
          {t("addPlayer") || "Add Player"}
        </Button>
      </div>

      {/* Search and Filter Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input - Real-time */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder") || "Search players..."}
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

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-4 rounded-xl border-0 bg-gray-100 dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] transition-all ${
            activeFiltersCount > 0 ? "text-green-primary" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Filter className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("filters") || "Filters"}
          {activeFiltersCount > 0 && (
            <span className="ml-2 rtl:ml-0 rtl:mr-2 size-5 rounded-full bg-green-primary text-white text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          {showFilters ? (
            <ChevronUp className="size-4 ml-2 rtl:ml-0 rtl:mr-2" />
          ) : (
            <ChevronDown className="size-4 ml-2 rtl:ml-0 rtl:mr-2" />
          )}
        </Button>

        {/* Clear All Button */}
        {(activeFiltersCount > 0 || searchTerm) && (
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
      {showFilters && (
        <div className="bg-gray-50 dark:bg-[#0f1118] rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Game Filter */}
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
                          {games.find((g) => (g.id || g._id) === currentGame)?.logo && (
                            <img
                              src={getImgUrl(games.find((g) => (g.id || g._id) === currentGame)?.logo?.light) || getImgUrl(games.find((g) => (g.id || g._id) === currentGame)?.logo?.dark)}
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
                            updateParams("game", "");
                            setGameSearchOpen(false);
                            setGameSearch("");
                          }}
                        >
                          <Check className={`mr-2 h-4 w-4 ${!currentGame ? "opacity-100" : "opacity-0"}`} />
                          {t("allGames") || "All Games"}
                        </CommandItem>
                        {filteredGames.map((game) => {
                          const gameId = game.id || game._id;
                          const gameLogo = getImgUrl(game.logo?.light) || getImgUrl(game.logo?.dark);
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
                              <Check className={`mr-2 h-4 w-4 ${currentGame === gameId ? "opacity-100" : "opacity-0"}`} />
                              {gameLogo && <img src={gameLogo} alt={game.name} className="size-5 rounded mr-2 object-contain" />}
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

            {/* Team Filter */}
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
                          {teams.find((t) => (t.id || t._id) === currentTeam)?.logo && (
                            <img
                              src={getImgUrl(teams.find((t) => (t.id || t._id) === currentTeam)?.logo?.light) || getImgUrl(teams.find((t) => (t.id || t._id) === currentTeam)?.logo?.dark)}
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
                            updateParams("team", "");
                            setTeamSearchOpen(false);
                            setTeamSearch("");
                          }}
                        >
                          <Check className={`mr-2 h-4 w-4 ${!currentTeam ? "opacity-100" : "opacity-0"}`} />
                          {t("allTeams") || "All Teams"}
                        </CommandItem>
                        {filteredTeams.map((team) => {
                          const teamId = team.id || team._id;
                          const teamLogo = getImgUrl(team.logo?.light) || getImgUrl(team.logo?.dark);
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
                              <Check className={`mr-2 h-4 w-4 ${currentTeam === teamId ? "opacity-100" : "opacity-0"}`} />
                              {teamLogo && <img src={teamLogo} alt={team.name} className="size-5 rounded mr-2 object-contain" />}
                              <span className="truncate">{team.name}</span>
                              {team.shortName && <span className="ml-1 text-xs text-gray-500">({team.shortName})</span>}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Country Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe className="size-4" />
                {t("country") || "Country"}
              </label>
              <Popover open={countrySearchOpen} onOpenChange={setCountrySearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countrySearchOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {selectedCountry ? (
                        <>
                          <span className="text-base">{selectedCountry.flag}</span>
                          <span className="text-gray-900 dark:text-white truncate">{selectedCountry.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t("allCountries") || "All Countries"}</span>
                      )}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("searchCountry") || "Search country..."}
                      value={countrySearch}
                      onValueChange={setCountrySearch}
                    />
                    <CommandList>
                      <CommandEmpty>{t("noCountryFound") || "No country found"}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-countries"
                          onSelect={() => {
                            updateParams("country", "");
                            setCountrySearchOpen(false);
                            setCountrySearch("");
                          }}
                        >
                          <Check className={`mr-2 h-4 w-4 ${!currentCountry ? "opacity-100" : "opacity-0"}`} />
                          {t("allCountries") || "All Countries"}
                        </CommandItem>
                        {filteredCountries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => {
                              updateParams("country", country.code);
                              setCountrySearchOpen(false);
                              setCountrySearch("");
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${currentCountry === country.code ? "opacity-100" : "opacity-0"}`} />
                            <span className="text-base mr-2">{country.flag}</span>
                            <span className="truncate">{country.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
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
                        {FREE_AGENT_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("isFreeAgent", option.value);
                                setStatusOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check className={`h-4 w-4 ${currentFreeAgent === option.value ? "opacity-100" : "opacity-0"}`} />
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
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayersFilter;

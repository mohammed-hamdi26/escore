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
  Gamepad2,
  Trophy,
  Star,
  ListFilter,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Award,
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

const STATUS_OPTIONS = [
  { value: "", label: "allStatus", icon: ListFilter, color: "text-gray-500" },
  { value: "upcoming", label: "upcoming", icon: Clock, color: "text-blue-500" },
  { value: "ongoing", label: "ongoing", icon: Play, color: "text-green-500" },
  { value: "completed", label: "completed", icon: CheckCircle2, color: "text-gray-400" },
  { value: "cancelled", label: "cancelled", icon: XCircle, color: "text-red-500" },
];

const TIER_OPTIONS = [
  { value: "", label: "allTiers", icon: Award, color: "text-gray-500" },
  { value: "S", label: "sTier", icon: Award, color: "text-yellow-500" },
  { value: "A", label: "aTier", icon: Award, color: "text-purple-500" },
  { value: "B", label: "bTier", icon: Award, color: "text-blue-500" },
];

const COMPETITION_TYPE_OPTIONS = [
  { value: "", label: "allTypes", icon: Trophy, color: "text-gray-500" },
  { value: "standard", label: "standard", icon: Trophy, color: "text-gray-400" },
  { value: "battle_royale", label: "battleRoyale", icon: Trophy, color: "text-red-500" },
  { value: "fighting", label: "fighting", icon: Trophy, color: "text-orange-500" },
  { value: "racing", label: "racing", icon: Trophy, color: "text-blue-500" },
  { value: "ffa", label: "ffa", icon: Trophy, color: "text-purple-500" },
  { value: "sports_sim", label: "sportsSim", icon: Trophy, color: "text-green-500" },
];

const FEATURED_OPTIONS = [
  { value: "", label: "all", icon: ListFilter, color: "text-gray-500" },
  { value: "true", label: "featured", icon: Star, color: "text-yellow-500" },
  { value: "false", label: "notFeatured", icon: Star, color: "text-gray-400" },
];

function TournamentsFilter({ games = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("TournamentsFilter");
  const searchTimeoutRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Popover states
  const [gameSearchOpen, setGameSearchOpen] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [tierOpen, setTierOpen] = useState(false);
  const [competitionTypeOpen, setCompetitionTypeOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);

  // Get current filter values from URL
  const currentSearch = searchParams.get("search") || "";
  const currentGame = searchParams.get("game") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentTier = searchParams.get("tier") || "";
  const currentCompetitionType = searchParams.get("competitionType") || "";
  const currentFeatured = searchParams.get("isFeatured") || "";

  // Sync search term with URL
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Count active filters
  const activeFiltersCount = [currentGame, currentStatus, currentTier, currentCompetitionType, currentFeatured].filter(Boolean).length;

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

  // Ensure games is always an array
  const gamesArray = Array.isArray(games) ? games : [];

  // Filter games based on search
  const filteredGames = useMemo(() => {
    if (!gameSearch) return gamesArray;
    return gamesArray.filter((game) =>
      game.name?.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [gamesArray, gameSearch]);

  // Get selected game name
  const selectedGameName = useMemo(() => {
    if (!currentGame) return null;
    const game = gamesArray.find((g) => (g.id || g._id) === currentGame);
    return game?.name;
  }, [currentGame, gamesArray]);

  // Get selected status
  const selectedStatus = useMemo(() => {
    return STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];
  }, [currentStatus]);

  // Get selected tier
  const selectedTier = useMemo(() => {
    return TIER_OPTIONS.find((t) => t.value === currentTier) || TIER_OPTIONS[0];
  }, [currentTier]);

  // Get selected competition type
  const selectedCompetitionType = useMemo(() => {
    return COMPETITION_TYPE_OPTIONS.find((c) => c.value === currentCompetitionType) || COMPETITION_TYPE_OPTIONS[0];
  }, [currentCompetitionType]);

  // Get selected featured
  const selectedFeatured = useMemo(() => {
    return FEATURED_OPTIONS.find((f) => f.value === currentFeatured) || FEATURED_OPTIONS[0];
  }, [currentFeatured]);

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
            placeholder={t("searchPlaceholder") || "Search tournaments..."}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                          {gamesArray.find((g) => (g.id || g._id) === currentGame)?.logo && (
                            <img
                              src={getImgUrl(gamesArray.find((g) => (g.id || g._id) === currentGame)?.logo?.light, "thumbnail") || getImgUrl(gamesArray.find((g) => (g.id || g._id) === currentGame)?.logo?.dark, "thumbnail")}
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
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              !currentGame ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {t("allGames") || "All Games"}
                        </CommandItem>
                        {filteredGames.map((game) => {
                          const gameId = game.id || game._id;
                          const gameLogo = getImgUrl(game.logo?.light, "thumbnail") || getImgUrl(game.logo?.dark, "thumbnail");
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
                              value={option.value || "all"}
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

            {/* Competition Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Trophy className="size-4" />
                {t("competitionType") || "Type"}
              </label>
              <Popover open={competitionTypeOpen} onOpenChange={setCompetitionTypeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={competitionTypeOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const TypeIcon = selectedCompetitionType.icon;
                        return (
                          <>
                            <TypeIcon className={`size-4 ${selectedCompetitionType.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedCompetitionType.label) || selectedCompetitionType.label}
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
                        {COMPETITION_TYPE_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value || "all"}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("competitionType", option.value);
                                setCompetitionTypeOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentCompetitionType === option.value ? "opacity-100" : "opacity-0"
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

            {/* Tier Filter - Enhanced with Icons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Award className="size-4" />
                {t("tier") || "Tier"}
              </label>
              <Popover open={tierOpen} onOpenChange={setTierOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={tierOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const TierIcon = selectedTier.icon;
                        return (
                          <>
                            <TierIcon className={`size-4 ${selectedTier.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedTier.label) || selectedTier.label}
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
                        {TIER_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("tier", option.value);
                                setTierOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentTier === option.value ? "opacity-100" : "opacity-0"
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

            {/* Featured Filter - Enhanced with Icons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Star className="size-4" />
                {t("featured") || "Featured"}
              </label>
              <Popover open={featuredOpen} onOpenChange={setFeaturedOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={featuredOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const FeaturedIcon = selectedFeatured.icon;
                        return (
                          <>
                            <FeaturedIcon className={`size-4 ${selectedFeatured.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedFeatured.label) || selectedFeatured.label}
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
                        {FEATURED_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("isFeatured", option.value);
                                setFeaturedOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentFeatured === option.value ? "opacity-100" : "opacity-0"
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
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentsFilter;

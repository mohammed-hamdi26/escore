"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Plus,
  Check,
  Gamepad2,
  ListFilter,
  CheckCircle2,
  XCircle,
  Globe,
  MapPin,
  Building2,
  Flag,
} from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
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
import Image from "next/image";
import { getImgUrl } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "allTeams", icon: ListFilter, color: "text-gray-500" },
  { value: "true", label: "activeTeams", icon: CheckCircle2, color: "text-green-500" },
  { value: "false", label: "inactiveTeams", icon: XCircle, color: "text-red-500" },
];

const REGION_OPTIONS = [
  { value: "", label: "allRegions", icon: Globe, color: "text-gray-500" },
  { value: "MENA", label: "MENA", icon: MapPin, color: "text-amber-500" },
  { value: "Europe", label: "Europe", icon: Building2, color: "text-blue-500" },
  { value: "North America", label: "North America", icon: Flag, color: "text-red-500" },
  { value: "South America", label: "South America", icon: Flag, color: "text-green-500" },
  { value: "Asia Pacific", label: "Asia Pacific", icon: Globe, color: "text-purple-500" },
  { value: "CIS", label: "CIS", icon: Building2, color: "text-cyan-500" },
  { value: "Oceania", label: "Oceania", icon: Globe, color: "text-teal-500" },
];

function TeamsFilterRedesign({ games = [], countries = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("teamList");

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Popover states
  const [gameOpen, setGameOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Search states for popovers
  const [gameSearch, setGameSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  // Get current filter values from URL
  const currentGame = searchParams.get("game") || "";
  const currentCountry = searchParams.get("country") || "";
  const currentRegion = searchParams.get("region") || "";
  const currentStatus = searchParams.get("isActive") || "";

  // Count active filters
  const activeFiltersCount = [currentGame, currentCountry, currentRegion, currentStatus].filter(Boolean).length;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

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
    const params = new URLSearchParams();
    router.push(`${pathname}?${params.toString()}`);
    setSearchTerm("");
  };

  // Filtered lists for searchable dropdowns
  const filteredGames = useMemo(() => {
    if (!gameSearch) return games;
    return games.filter((game) =>
      game.name.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [games, gameSearch]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter((country) =>
      country.label.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countries, countrySearch]);

  // Get selected values
  const selectedGame = useMemo(() => {
    return games.find((g) => g.id === currentGame);
  }, [games, currentGame]);

  const selectedCountry = useMemo(() => {
    return countries.find((c) => c.value === currentCountry);
  }, [countries, currentCountry]);

  const selectedRegion = useMemo(() => {
    return REGION_OPTIONS.find((r) => r.value === currentRegion) || REGION_OPTIONS[0];
  }, [currentRegion]);

  const selectedStatus = useMemo(() => {
    return STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];
  }, [currentStatus]);

  return (
    <div className="space-y-4">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title") || "Teams"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("subtitle") || "Manage all teams in the system"}
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/teams-management/add")}
          className="bg-green-primary hover:bg-green-primary/90 text-white gap-2"
        >
          <Plus className="size-4" />
          {t("addTeam") || "Add Team"}
        </Button>
      </div>

      {/* Search and Filter Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPlaceholder") || "Search teams..."}
            className="w-full h-10 pl-10 rtl:pl-4 rtl:pr-10 pr-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
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
            activeFiltersCount > 0 ? "text-green-primary" : "text-gray-700 dark:text-white"
          }`}
        >
          <Filter className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("filters") || "Filters"}
          {activeFiltersCount > 0 && (
            <span className="ml-2 rtl:ml-0 rtl:mr-2 size-5 rounded-full bg-green-primary text-white text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`size-4 ml-2 rtl:ml-0 rtl:mr-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
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

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-[#12141c] rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Game Filter - Searchable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("game") || "Game"}
              </label>
              <Popover open={gameOpen} onOpenChange={setGameOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={gameOpen}
                    className="w-full h-10 px-3 justify-between rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#252a3d]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {selectedGame ? (
                        <>
                          {selectedGame.logo?.light || selectedGame.logo?.dark ? (
                            <Image
                              src={getImgUrl(selectedGame.logo.light, "thumbnail") || getImgUrl(selectedGame.logo.dark, "thumbnail")}
                              alt={selectedGame.name}
                              width={20}
                              height={20}
                              className="rounded"
                            />
                          ) : (
                            <Gamepad2 className="size-4 text-gray-500" />
                          )}
                          <span className="truncate">{selectedGame.name}</span>
                        </>
                      ) : (
                        <>
                          <Gamepad2 className="size-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">{t("allGames") || "All Games"}</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0 bg-white dark:bg-[#12141c] border border-gray-200 dark:border-white/10" align="start">
                  <Command className="bg-transparent">
                    <CommandInput
                      placeholder={t("searchGames") || "Search games..."}
                      value={gameSearch}
                      onValueChange={setGameSearch}
                      className="text-gray-900 dark:text-white"
                    />
                    <CommandList>
                      <CommandEmpty className="text-gray-500 dark:text-gray-400 text-center py-4">
                        {t("noGamesFound") || "No games found"}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value=""
                          onSelect={() => {
                            updateParams("game", "");
                            setGameOpen(false);
                            setGameSearch("");
                          }}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                        >
                          <Gamepad2 className="size-4 text-gray-500" />
                          <span>{t("allGames") || "All Games"}</span>
                          {!currentGame && <Check className="size-4 ml-auto text-green-primary" />}
                        </CommandItem>
                        {filteredGames.map((game) => (
                          <CommandItem
                            key={game.id}
                            value={game.name}
                            onSelect={() => {
                              updateParams("game", game.id);
                              setGameOpen(false);
                              setGameSearch("");
                            }}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                          >
                            {game.logo?.light || game.logo?.dark ? (
                              <Image
                                src={getImgUrl(game.logo.light, "thumbnail") || getImgUrl(game.logo.dark, "thumbnail")}
                                alt={game.name}
                                width={20}
                                height={20}
                                className="rounded"
                              />
                            ) : (
                              <Gamepad2 className="size-4 text-gray-500" />
                            )}
                            <span className="truncate">{game.name}</span>
                            {currentGame === game.id && <Check className="size-4 ml-auto text-green-primary" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Country Filter - Searchable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("country") || "Country"}
              </label>
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-full h-10 px-3 justify-between rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#252a3d]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {selectedCountry ? (
                        <>
                          {selectedCountry.flag && (
                            <span className="text-base">{selectedCountry.flag}</span>
                          )}
                          <span className="truncate">{selectedCountry.label}</span>
                        </>
                      ) : (
                        <>
                          <Flag className="size-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">{t("allCountries") || "All Countries"}</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0 bg-white dark:bg-[#12141c] border border-gray-200 dark:border-white/10" align="start">
                  <Command className="bg-transparent">
                    <CommandInput
                      placeholder={t("searchCountries") || "Search countries..."}
                      value={countrySearch}
                      onValueChange={setCountrySearch}
                      className="text-gray-900 dark:text-white"
                    />
                    <CommandList>
                      <CommandEmpty className="text-gray-500 dark:text-gray-400 text-center py-4">
                        {t("noCountriesFound") || "No countries found"}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value=""
                          onSelect={() => {
                            updateParams("country", "");
                            setCountryOpen(false);
                            setCountrySearch("");
                          }}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                        >
                          <Flag className="size-4 text-gray-500" />
                          <span>{t("allCountries") || "All Countries"}</span>
                          {!currentCountry && <Check className="size-4 ml-auto text-green-primary" />}
                        </CommandItem>
                        {filteredCountries.map((country) => (
                          <CommandItem
                            key={country.value}
                            value={country.label}
                            onSelect={() => {
                              updateParams("country", country.value);
                              setCountryOpen(false);
                              setCountrySearch("");
                            }}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                          >
                            {country.flag && (
                              <span className="text-base">{country.flag}</span>
                            )}
                            <span className="truncate">{country.label}</span>
                            {currentCountry === country.value && <Check className="size-4 ml-auto text-green-primary" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Region Filter - Icon dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("region") || "Region"}
              </label>
              <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={regionOpen}
                    className="w-full h-10 px-3 justify-between rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#252a3d]"
                  >
                    <div className="flex items-center gap-2">
                      {selectedRegion.icon && (
                        <selectedRegion.icon className={`size-4 ${selectedRegion.color}`} />
                      )}
                      <span className={currentRegion ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}>
                        {t(selectedRegion.label) || selectedRegion.label}
                      </span>
                    </div>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-1 bg-white dark:bg-[#12141c] border border-gray-200 dark:border-white/10" align="start">
                  <div className="space-y-1">
                    {REGION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateParams("region", option.value);
                          setRegionOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentRegion === option.value
                            ? "bg-green-primary/10 text-green-primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                        }`}
                      >
                        <option.icon className={`size-4 ${option.color}`} />
                        <span>{t(option.label) || option.label}</span>
                        {currentRegion === option.value && (
                          <Check className="size-4 ml-auto text-green-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter - Icon dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("status") || "Status"}
              </label>
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={statusOpen}
                    className="w-full h-10 px-3 justify-between rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#252a3d]"
                  >
                    <div className="flex items-center gap-2">
                      {selectedStatus.icon && (
                        <selectedStatus.icon className={`size-4 ${selectedStatus.color}`} />
                      )}
                      <span className={currentStatus ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}>
                        {t(selectedStatus.label) || selectedStatus.label}
                      </span>
                    </div>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-1 bg-white dark:bg-[#12141c] border border-gray-200 dark:border-white/10" align="start">
                  <div className="space-y-1">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateParams("isActive", option.value);
                          setStatusOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentStatus === option.value
                            ? "bg-green-primary/10 text-green-primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                        }`}
                      >
                        <option.icon className={`size-4 ${option.color}`} />
                        <span>{t(option.label) || option.label}</span>
                        {currentStatus === option.value && (
                          <Check className="size-4 ml-auto text-green-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamsFilterRedesign;

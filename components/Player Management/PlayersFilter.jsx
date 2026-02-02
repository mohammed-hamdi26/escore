"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, Filter, X, ChevronDown, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

const FREE_AGENT_OPTIONS = [
  { value: "", label: "allPlayers" },
  { value: "true", label: "freeAgents" },
  { value: "false", label: "teamPlayers" },
];

function PlayersFilter({ games = [], teams = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("playerList");

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Get current filter values from URL
  const currentGame = searchParams.get("game") || "";
  const currentTeam = searchParams.get("team") || "";
  const currentCountry = searchParams.get("country") || "";
  const currentFreeAgent = searchParams.get("isFreeAgent") || "";

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
      // Reset to page 1 when filtering
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

  const handleSearch = (value) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get unique countries from teams (as a workaround since we don't have a countries API)
  const countries = [
    { code: "SA", name: "Saudi Arabia" },
    { code: "AE", name: "UAE" },
    { code: "EG", name: "Egypt" },
    { code: "US", name: "United States" },
    { code: "KR", name: "South Korea" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "GB", name: "United Kingdom" },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Players"}
          </h1>
          <p className="text-sm text-muted-foreground">
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
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("searchPlaceholder") || "Search players..."}
            className="w-full h-10 pl-10 rtl:pl-4 rtl:pr-10 pr-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-4 rounded-xl border-0 bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] transition-all ${
            activeFiltersCount > 0 ? "text-green-primary" : "text-foreground"
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
        <div className="glass rounded-xl p-4 border border-transparent dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Game Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t("game") || "Game"}
              </label>
              <select
                value={currentGame}
                onChange={(e) => updateParams("game", e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
              >
                <option value="">{t("allGames") || "All Games"}</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t("team") || "Team"}
              </label>
              <select
                value={currentTeam}
                onChange={(e) => updateParams("team", e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
              >
                <option value="">{t("allTeams") || "All Teams"}</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t("country") || "Country"}
              </label>
              <select
                value={currentCountry}
                onChange={(e) => updateParams("country", e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
              >
                <option value="">{t("allCountries") || "All Countries"}</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Free Agent Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t("status") || "Status"}
              </label>
              <select
                value={currentFreeAgent}
                onChange={(e) => updateParams("isFreeAgent", e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
              >
                {FREE_AGENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label) || option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayersFilter;

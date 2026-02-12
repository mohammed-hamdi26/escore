"use client";

import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ListFilter,
  CheckCircle2,
  XCircle,
  Check,
  Plus,
  Globe,
  MapPin,
  Building2,
  Flag,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslations } from "next-intl";
import {
  usePermissions,
  ENTITIES,
  ACTIONS,
} from "@/contexts/PermissionsContext";

const STATUS_OPTIONS = [
  { value: "", label: "allStatus", icon: ListFilter, color: "text-gray-500" },
  { value: "true", label: "active", icon: CheckCircle2, color: "text-green-500" },
  { value: "false", label: "inactive", icon: XCircle, color: "text-red-500" },
];

const REGION_OPTIONS = [
  { value: "", label: "allRegions", icon: Globe, color: "text-gray-500" },
  { value: "Middle East", label: "middleEast", icon: MapPin, color: "text-amber-500" },
  { value: "Europe", label: "europe", icon: Building2, color: "text-blue-500" },
  { value: "North America", label: "northAmerica", icon: Flag, color: "text-red-500" },
  { value: "South America", label: "southAmerica", icon: Flag, color: "text-green-500" },
  { value: "Asia", label: "asia", icon: Globe, color: "text-purple-500" },
  { value: "CIS", label: "cis", icon: Globe, color: "text-orange-500" },
  { value: "Oceania", label: "oceania", icon: Globe, color: "text-teal-500" },
];

function ClubsFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("ClubsFilter");
  const searchTimeoutRef = useRef(null);
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(ENTITIES.CLUB, ACTIONS.CREATE);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Popover states
  const [statusOpen, setStatusOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  // Get current filter values from URL
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("isActive") || "";
  const currentRegion = searchParams.get("region") || "";

  // Sync search term with URL
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Count active filters (status + region, not search)
  const activeFiltersCount = [currentStatus, currentRegion].filter(Boolean).length;

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

  // Get selected status
  const selectedStatus = useMemo(() => {
    return STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];
  }, [currentStatus]);

  // Get selected region
  const selectedRegion = useMemo(() => {
    return REGION_OPTIONS.find((r) => r.value === currentRegion) || REGION_OPTIONS[0];
  }, [currentRegion]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Clubs Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("subtitle") || "Manage all clubs in the system"}
          </p>
        </div>
        {canCreate && (
          <Link href="/dashboard/clubs-management/add">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-primary hover:bg-green-600 text-white font-medium text-sm transition-colors cursor-pointer">
              <Plus className="size-4" />
              {t("addClub") || "Add Club"}
            </button>
          </Link>
        )}
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
            placeholder={t("searchPlaceholder") || "Search clubs..."}
            className="w-full h-10 px-10 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <ChevronDown className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 shrink-0 text-gray-400" />
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
                                updateParams("isActive", option.value);
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

            {/* Region Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe className="size-4" />
                {t("region") || "Region"}
              </label>
              <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={regionOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const RegionIcon = selectedRegion.icon;
                        return (
                          <>
                            <RegionIcon className={`size-4 ${selectedRegion.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedRegion.label) || selectedRegion.label}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {REGION_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("region", option.value);
                                setRegionOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentRegion === option.value ? "opacity-100" : "opacity-0"
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

export default ClubsFilter;

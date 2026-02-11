"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  ListFilter,
  CheckCircle2,
  XCircle,
  Globe,
  MapPin,
  Building2,
  Flag,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import {
  usePermissions,
  ENTITIES,
  ACTIONS,
} from "@/contexts/PermissionsContext";

const STATUS_OPTIONS = [
  { value: "", label: "allClubs", icon: ListFilter, color: "text-gray-500" },
  {
    value: "true",
    label: "activeClubs",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    value: "false",
    label: "inactiveClubs",
    icon: XCircle,
    color: "text-red-500",
  },
];

const REGION_OPTIONS = [
  { value: "", label: "allRegions", icon: Globe, color: "text-gray-500" },
  { value: "Middle East", label: "Middle East", icon: MapPin, color: "text-amber-500" },
  { value: "Europe", label: "Europe", icon: Building2, color: "text-blue-500" },
  {
    value: "North America",
    label: "North America",
    icon: Flag,
    color: "text-red-500",
  },
  {
    value: "South America",
    label: "South America",
    icon: Flag,
    color: "text-green-500",
  },
  {
    value: "Asia",
    label: "Asia",
    icon: Globe,
    color: "text-purple-500",
  },
  { value: "Oceania", label: "Oceania", icon: Globe, color: "text-teal-500" },
];

function ClubsFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("clubList");
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(ENTITIES.CLUB, ACTIONS.CREATE);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const currentStatus = searchParams.get("isActive") || "";
  const currentRegion = searchParams.get("region") || "";

  const activeFilterCount = [
    searchParams.get("search"),
    searchParams.get("isActive"),
    searchParams.get("region"),
  ].filter(Boolean).length;

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchValue(value);
      const timeout = setTimeout(() => {
        updateParams("search", value);
      }, 300);
      return () => clearTimeout(timeout);
    },
    [updateParams]
  );

  const clearAllFilters = () => {
    setSearchValue("");
    router.push(pathname);
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Clubs Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle") || "Manage all clubs in the system"}
          </p>
        </div>
        {canCreate && (
          <Button
            className="bg-green-primary hover:bg-green-primary/80 gap-2"
            onClick={() => router.push("/dashboard/clubs-management/add")}
          >
            <Plus className="size-4" />
            {t("addClub") || "Add Club"}
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search clubs..."}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-10 pl-10 rtl:pl-4 rtl:pr-10 pr-4 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
          />
          {searchValue && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2"
            >
              <X className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-muted/50 dark:bg-[#1a1d2e] rounded-lg p-1">
          {STATUS_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => updateParams("isActive", option.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentStatus === option.value
                    ? "bg-green-primary/10 text-green-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {t(option.label) || option.label}
              </button>
            );
          })}
        </div>

        {/* Region Filter */}
        <select
          value={currentRegion}
          onChange={(e) => updateParams("region", e.target.value)}
          className="h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
        >
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label) || option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <X className="size-3.5" />
            {t("clearAll") || "Clear All"}
            <span className="bg-green-primary/20 text-green-primary text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ClubsFilter;

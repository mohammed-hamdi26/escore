"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import {
  Search,
  X,
  ListFilter,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Plus,
  CalendarDays,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";

const STATUS_OPTIONS = [
  { value: "", label: "allStatuses", icon: ListFilter, color: "text-gray-500" },
  { value: "upcoming", label: "upcoming", icon: Clock, color: "text-blue-500" },
  { value: "ongoing", label: "ongoing", icon: Play, color: "text-green-500" },
  {
    value: "completed",
    label: "completed",
    icon: CheckCircle2,
    color: "text-gray-400",
  },
  {
    value: "cancelled",
    label: "cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
];

function EventsFilter({ t }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(ENTITIES.EVENT, ACTIONS.CREATE);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

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

  const currentStatus = searchParams.get("status") || "";

  const activeFilterCount = [
    searchParams.get("search"),
    searchParams.get("status"),
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "Events Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("subtitle") || "Manage all events in the system"}
          </p>
        </div>
        {canCreate && (
          <Link href="/dashboard/events-management/add">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-primary hover:bg-green-600 text-white font-medium text-sm transition-colors cursor-pointer">
              <Plus className="size-4" />
              {t("addEvent") || "Add Event"}
            </button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("searchPlaceholder") || "Search events..."}
          className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50 placeholder:text-muted-foreground"
        />
        {searchValue && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X className="size-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentStatus === option.value;
          return (
            <button
              key={option.value}
              onClick={() => updateParams("status", option.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-green-primary/10 text-green-primary border border-green-primary/30"
                  : "bg-gray-100 dark:bg-white/5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "text-green-primary" : option.color}`} />
              {t(option.label) || option.label}
            </button>
          );
        })}

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
            {t("clearAll") || "Clear All"}
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-[10px]">
              {activeFilterCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default EventsFilter;

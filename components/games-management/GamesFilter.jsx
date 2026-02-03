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
  ListFilter,
  CheckCircle2,
  XCircle,
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
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslations } from "next-intl";

const ACTIVE_OPTIONS = [
  { value: "", label: "all", icon: ListFilter, color: "text-gray-500" },
  { value: "true", label: "active", icon: CheckCircle2, color: "text-green-500" },
  { value: "false", label: "inactive", icon: XCircle, color: "text-red-500" },
];

function GamesFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("GamesFilter");
  const searchTimeoutRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Popover states
  const [activeOpen, setActiveOpen] = useState(false);

  // Get current filter values from URL
  const currentSearch = searchParams.get("search") || "";
  const currentActive = searchParams.get("isActive") || "";

  // Sync search term with URL
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Count active filters
  const activeFiltersCount = [currentActive].filter(Boolean).length;

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
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

  // Get selected active status
  const selectedActive = useMemo(() => {
    return ACTIVE_OPTIONS.find((a) => a.value === currentActive) || ACTIVE_OPTIONS[0];
  }, [currentActive]);

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
            placeholder={t("searchPlaceholder") || "Search games..."}
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
            {/* Active Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ListFilter className="size-4" />
                {t("status") || "Status"}
              </label>
              <Popover open={activeOpen} onOpenChange={setActiveOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={activeOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const ActiveIcon = selectedActive.icon;
                        return (
                          <>
                            <ActiveIcon className={`size-4 ${selectedActive.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {t(selectedActive.label) || selectedActive.label}
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
                        {ACTIVE_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("isActive", option.value);
                                setActiveOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentActive === option.value ? "opacity-100" : "opacity-0"
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

export default GamesFilter;

"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
  UserCheck,
  UserX,
  Check,
} from "lucide-react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
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

const ROLE_OPTIONS = [
  { value: "", labelKey: "filters.allRoles", icon: Shield, color: "text-gray-500" },
  { value: "user", labelKey: "roles.user", icon: Shield, color: "text-gray-400" },
  { value: "admin", labelKey: "roles.admin", icon: Shield, color: "text-red-500" },
  { value: "content", labelKey: "roles.content", icon: Shield, color: "text-purple-500" },
  { value: "support", labelKey: "roles.support", icon: Shield, color: "text-cyan-500" },
];

const STATUS_OPTIONS = [
  { value: "", labelKey: "filters.allStatus", icon: UserCheck, color: "text-gray-500" },
  { value: "true", labelKey: "filters.verified", icon: UserCheck, color: "text-green-500" },
  { value: "false", labelKey: "filters.unverified", icon: UserX, color: "text-yellow-500" },
];

export default function UsersFilters({ currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("UsersManagement");
  const searchTimeoutRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");

  // Popover states
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Sync search term with URL
  useEffect(() => {
    setSearchTerm(currentFilters.search || "");
  }, [currentFilters.search]);

  // Count active filters
  const activeFiltersCount = [
    currentFilters.role,
    currentFilters.isVerified,
  ].filter(Boolean).length;

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
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

  // Get selected options
  const selectedRole = useMemo(() => {
    return ROLE_OPTIONS.find((r) => r.value === currentFilters.role) || ROLE_OPTIONS[0];
  }, [currentFilters.role]);

  const selectedStatus = useMemo(() => {
    return STATUS_OPTIONS.find((s) => s.value === currentFilters.isVerified) || STATUS_OPTIONS[0];
  }, [currentFilters.isVerified]);

  // Helper to get translation
  const getLabel = (labelKey) => t(labelKey) || labelKey;

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
            placeholder={t("filters.searchPlaceholder") || "Search users..."}
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
          {t("filters.filters") || "Filters"}
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
            {t("filters.clear") || "Clear All"}
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-[#0f1118] rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Shield className="size-4" />
                {t("filters.role") || "Role"}
              </label>
              <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={roleOpen}
                    className="w-full h-10 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {(() => {
                        const RoleIcon = selectedRole.icon;
                        return (
                          <>
                            <RoleIcon className={`size-4 ${selectedRole.color}`} />
                            <span className="text-gray-900 dark:text-white">
                              {getLabel(selectedRole.labelKey)}
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
                        {ROLE_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value || "all"}
                              onSelect={() => {
                                updateParams("role", option.value);
                                setRoleOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentFilters.role === option.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <OptionIcon className={`size-4 ${option.color}`} />
                              <span>{getLabel(option.labelKey)}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UserCheck className="size-4" />
                {t("filters.status") || "Verification Status"}
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
                              {getLabel(selectedStatus.labelKey)}
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
                                updateParams("isVerified", option.value);
                                setStatusOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  currentFilters.isVerified === option.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <OptionIcon className={`size-4 ${option.color}`} />
                              <span>{getLabel(option.labelKey)}</span>
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

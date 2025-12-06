"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Filter, X } from "lucide-react";
import { useState, useCallback } from "react";

export default function UsersFilters({ currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("UsersManagement");

  const [search, setSearch] = useState(currentFilters.search || "");

  const updateFilters = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset page when filters change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters("search", search);
  };

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentFilters.role ||
    currentFilters.isVerified ||
    currentFilters.search ||
    currentFilters.isDeleted === "true";

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("filters.search")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-green-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </form>

        {/* Role Filter */}
        <div className="min-w-[150px]">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("filters.role")}
          </label>
          <select
            value={currentFilters.role}
            onChange={(e) => updateFilters("role", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-green-primary"
          >
            <option value="">{t("filters.allRoles")}</option>
            <option value="user">{t("roles.user")}</option>
            <option value="admin">{t("roles.admin")}</option>
            <option value="content">{t("roles.content")}</option>
            <option value="support">{t("roles.support")}</option>
          </select>
        </div>

        {/* Verified Filter */}
        <div className="min-w-[150px]">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("filters.status")}
          </label>
          <select
            value={currentFilters.isVerified}
            onChange={(e) => updateFilters("isVerified", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-green-primary"
          >
            <option value="">{t("filters.allStatus")}</option>
            <option value="true">{t("filters.verified")}</option>
            <option value="false">{t("filters.unverified")}</option>
          </select>
        </div>

        {/* Deleted Filter */}
        <div className="min-w-[150px]">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("filters.showDeleted")}
          </label>
          <select
            value={currentFilters.isDeleted}
            onChange={(e) => updateFilters("isDeleted", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-green-primary"
          >
            <option value="false">{t("filters.activeOnly")}</option>
            <option value="true">{t("filters.deletedOnly")}</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}

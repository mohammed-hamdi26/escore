"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui app/Pagination";
import MatchCard from "./MatchCard";
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  RefreshCw,
  Swords,
} from "lucide-react";
import { deleteMatch } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "scheduledDate", label: "date" },
  { value: "createdAt", label: "dateAdded" },
];

function MatchesListRedesign({ matches = [], pagination = {}, games = [], tournaments = [] }) {
  const t = useTranslations("MatchesList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState("grid");

  const currentSort = searchParams.get("sortBy") || "scheduledDate";
  const currentOrder = searchParams.get("sortOrder") || "desc";

  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams);
    if (currentSort === field) {
      params.set("sortOrder", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "desc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (matchId) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await deleteMatch(matchId);
      toast.success(t("deleteSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("deleteError"));
    }
  };

  const numPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {t("showing")} <span className="font-medium text-gray-900 dark:text-white">{matches.length}</span>{" "}
          {t("of")} <span className="font-medium text-gray-900 dark:text-white">{total}</span> {t("matches")}
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Buttons */}
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleSort(option.value)}
              className={
                currentSort === option.value
                  ? "bg-green-primary hover:bg-green-primary/90 gap-1 text-white"
                  : "border-gray-200 dark:border-white/10 gap-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/10"
              }
            >
              {t(option.label)}
              {currentSort === option.value && (
                <ArrowUpDown
                  className={`size-3 ${currentOrder === "asc" ? "rotate-180" : ""}`}
                />
              )}
            </Button>
          ))}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
          </Button>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`rounded-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 ${viewMode === "grid" ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" : ""}`}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`rounded-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 ${viewMode === "list" ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" : ""}`}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Matches Grid/List */}
      {matches.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {matches.map((match) => (
            <MatchCard
              key={match.id || match._id}
              match={match}
              viewMode={viewMode}
              t={t}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
            <Swords className="size-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t("noMatches")}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t("noMatchesDescription")}</p>
        </div>
      )}

      {/* Pagination */}
      {numPages > 1 && <Pagination numPages={numPages} />}
    </div>
  );
}

export default MatchesListRedesign;

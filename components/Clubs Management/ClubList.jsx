"use client";
import { useTransition, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  Building2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "../ui/button";
import ClubCard from "./ClubCard";
import ClubsFilter from "./ClubsFilter";
import Pagination from "../ui app/Pagination";
import { deleteClub } from "@/app/[locale]/_Lib/actions";
import {
  usePermissions,
  ENTITIES,
  ACTIONS,
} from "@/contexts/PermissionsContext";

function ClubList({ clubs, pagination }) {
  const t = useTranslations("clubList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState("grid");
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(ENTITIES.CLUB, ACTIONS.CREATE);

  const currentSort = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("sortOrder") || "asc";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (id) => {
    if (
      confirm(
        t("confirmDelete") || "Are you sure you want to delete this club?"
      )
    ) {
      await deleteClub(id);
      handleRefresh();
    }
  };

  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams);
    if (currentSort === field) {
      params.set("sortOrder", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "asc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = (field) => {
    if (currentSort !== field) {
      return <ArrowUpDown className="size-3.5 opacity-50" />;
    }
    return currentOrder === "asc" ? (
      <ArrowUp className="size-3.5 text-green-primary" />
    ) : (
      <ArrowDown className="size-3.5 text-green-primary" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ClubsFilter />

      {/* Results Count & View Toggle & Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-gray-300 dark:border-0 bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] text-gray-700 dark:text-gray-300"
          >
            <RefreshCw
              className={`size-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            {t("showing") || "Showing"}{" "}
            <span className="font-medium text-foreground">{clubs.length}</span>{" "}
            {t("of") || "of"}{" "}
            <span className="font-medium text-foreground">
              {pagination?.total || 0}
            </span>{" "}
            {t("clubs") || "clubs"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Buttons */}
          <div className="flex items-center gap-1 bg-muted/50 dark:bg-[#1a1d2e] rounded-lg p-1">
            <button
              onClick={() => handleSort("name")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "name"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("name") || "Name"}
              {getSortIcon("name")}
            </button>
            <button
              onClick={() => handleSort("followersCount")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "followersCount"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("followers") || "Followers"}
              {getSortIcon("followersCount")}
            </button>
            <button
              onClick={() => handleSort("createdAt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "createdAt"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("dateAdded") || "Date Added"}
              {getSortIcon("createdAt")}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 dark:bg-[#1a1d2e] rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clubs List */}
      {clubs.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-transparent dark:border-white/5">
          <Building2 className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t("noClubs") || "No Clubs Found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("noClubsDescription") ||
              "Try adjusting your filters or add a new club"}
          </p>
          {canCreate && (
            <Button
              className="bg-green-primary hover:bg-green-primary/80"
              onClick={() => router.push("/dashboard/clubs-management/add")}
            >
              {t("addFirstClub") || "Add First Club"}
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              onDelete={handleDelete}
              t={t}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination numPages={pagination.totalPages} />
        </div>
      )}
    </div>
  );
}

export default ClubList;

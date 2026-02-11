"use client";

import { useTransition, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  CalendarDays,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  LayoutList,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import EventCard from "./EventCard";
import EventsFilter from "./EventsFilter";
import Pagination from "../ui app/Pagination";
import { deleteEvent } from "@/app/[locale]/_Lib/actions";
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";

function EventList({ events, pagination }) {
  const t = useTranslations("eventList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState("grid");
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(ENTITIES.EVENT, ACTIONS.CREATE);

  const currentSort = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("sortOrder") || "asc";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (id) => {
    if (confirm(t("confirmDelete") || "Are you sure you want to delete this event?")) {
      await deleteEvent(id);
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
      <EventsFilter t={t} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-white/10 text-green-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white dark:bg-white/10 text-green-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="size-4" />
            </button>
          </div>

          {/* Sort buttons */}
          <button
            onClick={() => handleSort("name")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {t("name") || "Name"}
            {getSortIcon("name")}
          </button>
          <button
            onClick={() => handleSort("startDate")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {t("dates") || "Date"}
            {getSortIcon("startDate")}
          </button>
          <button
            onClick={() => handleSort("prizePool")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {t("prizePool") || "Prize Pool"}
            {getSortIcon("prizePool")}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {t("showing") || "Showing"}{" "}
            <span className="font-semibold text-foreground">
              {events.length}
            </span>{" "}
            {t("of") || "of"}{" "}
            <span className="font-semibold text-foreground">
              {pagination.total}
            </span>{" "}
            {t("events") || "events"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="h-8 px-2"
          >
            <RefreshCw
              className={`size-3.5 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Events Grid/List */}
      {events.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              viewMode={viewMode}
              onDelete={handleDelete}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <CalendarDays className="size-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("noEvents") || "No events found"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("noEventsDescription") ||
              "Try adjusting your filters or add a new event"}
          </p>
          {canCreate && (
            <Link href="/dashboard/events-management/add">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-primary hover:bg-green-600 text-white font-medium text-sm transition-colors cursor-pointer">
                <Plus className="size-4" />
                {t("addFirstEvent") || "Add First Event"}
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && <Pagination pagination={pagination} />}
    </div>
  );
}

export default EventList;

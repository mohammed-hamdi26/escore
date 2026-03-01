"use client";

import { useTransition, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "../ui/button";
import TransferCard from "./TransferCard";
import TransfersFilter from "./TransfersFilter";
import Pagination from "../ui app/Pagination";
import { bulkDeleteTransfers } from "@/app/[locale]/_Lib/actions";
import { useSelection } from "@/hooks/useSelection";
import BulkActionBar from "../ui app/BulkActionBar";
import BulkDeleteDialog from "../ui app/BulkDeleteDialog";
import toast from "react-hot-toast";

export default function TransfersTable({ transfers, pagination, games = [], players = [], teams = [] }) {
  const t = useTranslations("TransfersManagement");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState("grid");

  const pageItemIds = transfers.map((t) => t.id);
  const selection = useSelection(pagination?.page);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const ids = Array.from(selection.selectedIds);
      const result = await bulkDeleteTransfers(ids);
      if (result.success) {
        toast.success(`${result.deletedCount} transfers deleted`);
        selection.deselectAll();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete transfers");
      }
    } catch {
      toast.error("Failed to delete transfers");
    } finally {
      setIsBulkDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const currentSort = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("sortOrder") || "desc";
  const numPages = pagination?.totalPages || 1;

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort === field) {
      params.set("sortOrder", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "desc");
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
      <TransfersFilter games={games} players={players} teams={teams} />

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
            <span className="font-medium text-foreground">{transfers.length}</span>{" "}
            {t("of") || "of"}{" "}
            <span className="font-medium text-foreground">{pagination?.total || 0}</span>{" "}
            {t("transfers") || "transfers"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Buttons */}
          <div className="flex items-center gap-1 bg-muted/50 dark:bg-[#1a1d2e] rounded-lg p-1">
            <button
              onClick={() => handleSort("fee")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "fee"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("sortByFee") || "Fee"}
              {getSortIcon("fee")}
            </button>
            <button
              onClick={() => handleSort("transferDate")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "transferDate"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("sortByDate") || "Date"}
              {getSortIcon("transferDate")}
            </button>
            <button
              onClick={() => handleSort("createdAt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "createdAt"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("dateAdded") || "Added"}
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

      {/* Transfers List */}
      {transfers.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-transparent dark:border-white/5">
          <Users className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t("noTransfers") || "No Transfers Found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("tryAdjusting") || "Try adjusting your filters or add a new transfer"}
          </p>
          <Link href="/dashboard/transfers-management/add">
            <Button className="bg-green-primary hover:bg-green-primary/80">
              {t("addFirstTransfer") || "Add First Transfer"}
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {transfers.map((transfer) => (
            <TransferCard
              key={transfer.id || transfer._id}
              transfer={transfer}
              t={t}
              viewMode={viewMode}
              onRefresh={handleRefresh}
              isSelected={selection.isSelected(transfer.id)}
              onToggleSelect={() => selection.toggle(transfer.id)}
              selectionMode={selection.selectionMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {numPages > 1 && (
        <div className="flex justify-center">
          <Pagination numPages={numPages} />
        </div>
      )}

      <BulkActionBar
        count={selection.count}
        onSelectAll={() => selection.selectAll(pageItemIds)}
        onDeselectAll={selection.deselectAll}
        onDelete={() => setShowDeleteDialog(true)}
        isLoading={isBulkDeleting}
      />

      <BulkDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        count={selection.count}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
      />
    </div>
  );
}

"use client";
import { useTransition, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  Newspaper,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "../ui/button";
import NewsCard from "./NewsCard";
import NewsFilter from "./NewsFilter";
import Pagination from "../ui app/Pagination";
import {
  toggleNewsFeatured,
  publishNews,
  unpublishNews,
} from "@/app/[locale]/_Lib/newsApi";
import { deleteNew } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function NewsListRedesign({ news, pagination, games = [], locale = "en" }) {
  const t = useTranslations("newsList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState("grid");

  const currentSort = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("sortOrder") || "desc";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (id, title) => {
    if (confirm(t("confirmDelete") || `Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteNew(id);
        toast.success(t("deleteSuccess") || "News deleted");
        handleRefresh();
      } catch (e) {
        toast.error(t("deleteError") || "Failed to delete");
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await toggleNewsFeatured(id);
      toast.success(t("featuredSuccess") || "Featured status updated");
      handleRefresh();
    } catch (e) {
      toast.error(t("featuredError") || "Failed to update");
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishNews(id);
      toast.success(t("publishSuccess") || "News published");
      handleRefresh();
    } catch (e) {
      toast.error(t("publishError") || "Failed to publish");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await unpublishNews(id);
      toast.success(t("unpublishSuccess") || "News unpublished");
      handleRefresh();
    } catch (e) {
      toast.error(t("unpublishError") || "Failed to unpublish");
    }
  };

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
      <NewsFilter games={games} />

      {/* Results Count & View Toggle & Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-0 bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d]"
          >
            <RefreshCw
              className={`size-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            {t("showing") || "Showing"}{" "}
            <span className="font-medium text-foreground">{news.length}</span>{" "}
            {t("of") || "of"}{" "}
            <span className="font-medium text-foreground">{pagination?.total || 0}</span>{" "}
            {t("news") || "news"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Buttons */}
          <div className="flex items-center gap-1 bg-muted/50 dark:bg-[#1a1d2e] rounded-lg p-1">
            <button
              onClick={() => handleSort("title")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "title"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("sortByTitle") || "Title"}
              {getSortIcon("title")}
            </button>
            <button
              onClick={() => handleSort("publishedAt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSort === "publishedAt"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("sortByDate") || "Date"}
              {getSortIcon("publishedAt")}
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

      {/* News List */}
      {news.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-transparent dark:border-white/5">
          <Newspaper className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t("noNews") || "No News Found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("noNewsDescription") || "Try adjusting your filters or add a new article"}
          </p>
          <Button
            className="bg-green-primary hover:bg-green-primary/80"
            onClick={() => router.push("/dashboard/news/add")}
          >
            {t("addFirstNews") || "Add First News"}
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {news.map((item) => (
            <NewsCard
              key={item.id || item._id}
              news={item}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
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

export default NewsListRedesign;

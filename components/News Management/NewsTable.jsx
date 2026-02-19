"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Pagination from "../ui app/Pagination";
import { Button } from "../ui/button";
import { format } from "date-fns";
import NewsFilter from "./NewsFilter";
import { useState } from "react";
import { deleteNew } from "@/app/[locale]/_Lib/actions";
import { toggleNewsFeatured, publishNews, unpublishNews } from "@/app/[locale]/_Lib/newsApi";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Newspaper,
  Calendar,
  Star,
  MoreHorizontal,
  Eye,
  StarOff,
  Loader2,
  User,
  FileText,
  EyeOff,
  Send,
} from "lucide-react";
import { getImgUrl } from "@/lib/utils";

// Status badge colors
const STATUS_COLORS = {
  published: "bg-green-500/10 text-green-500",
  draft: "bg-gray-500/10 text-gray-400",
};

function NewsTable({ news, pagination, games }) {
  const [loadingId, setLoadingId] = useState(null);
  const t = useTranslations("NewsTable");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const numPages = pagination?.totalPages || 1;
  const currentSort = searchParams.get("sortBy") || "createdAt";
  const currentOrder = searchParams.get("sortOrder") || "desc";

  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams);
    if (currentSort === field) {
      // Toggle order
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

  const handleDelete = async (id, title) => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setLoadingId(id);
      await deleteNew(id);
      toast.success(t("deleteSuccess") || "News deleted successfully");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete news");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <NewsFilter games={games} />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("showing") || "Showing"}{" "}
          <span className="font-medium text-foreground">{news.length}</span>{" "}
          {t("of") || "of"}{" "}
          <span className="font-medium text-foreground">{pagination?.total || 0}</span>{" "}
          {t("articles") || "articles"}
        </p>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
        {/* Table Header */}
        <div className="bg-muted/50 dark:bg-[#1a1d2e] border-b border-border">
          <div className="grid grid-cols-[2fr_1fr_1fr_0.7fr_0.7fr_0.7fr_auto] gap-4 px-6 py-4">
            <button
              onClick={() => handleSort("title")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-start"
            >
              {t("title") || "Title"}
              {getSortIcon("title")}
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              {t("author") || "Author"}
            </span>
            <button
              onClick={() => handleSort("publishedAt")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("date") || "Date"}
              {getSortIcon("publishedAt")}
            </button>
            <span className="text-sm font-medium text-muted-foreground text-center">
              {t("status") || "Status"}
            </span>
            <button
              onClick={() => handleSort("viewsCount")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors justify-center"
            >
              {t("views") || "Views"}
              {getSortIcon("viewsCount")}
            </button>
            <span className="text-sm font-medium text-muted-foreground text-center">
              {t("featured") || "Featured"}
            </span>
            <span className="text-sm font-medium text-muted-foreground text-end">
              {t("actions") || "Actions"}
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Newspaper className="size-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">{t("noNews") || "No news found"}</p>
              <p className="text-sm">{t("tryAdjusting") || "Try adjusting your filters"}</p>
            </div>
          ) : (
            news.map((article) => (
              <div
                key={article.id}
                onClick={() => router.push(`/dashboard/news-management/view/${article.id}`)}
                className="grid grid-cols-[2fr_1fr_1fr_0.7fr_0.7fr_0.7fr_auto] gap-4 px-6 py-4 items-center hover:bg-muted/30 dark:hover:bg-[#252a3d] transition-colors cursor-pointer"
              >
                {/* Title & Cover Image */}
                <div className="flex items-center gap-3 min-w-0">
                  {article?.coverImage?.light ? (
                    <img
                      src={getImgUrl(article.coverImage.light)}
                      alt={article.title}
                      className="size-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="size-12 rounded-lg bg-green-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="size-5 text-green-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{article.title}</p>
                    {article.game?.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {article.game.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {article.authorImage?.light ? (
                    <img
                      src={getImgUrl(article.authorImage.light)}
                      alt={article.authorName}
                      className="size-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm text-foreground truncate">
                    {article.authorName || "-"}
                  </span>
                </div>

                {/* Date */}
                <div className="text-sm">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {article.publishedAt
                      ? format(new Date(article.publishedAt), "MMM d, yyyy")
                      : article.createdAt
                      ? format(new Date(article.createdAt), "MMM d, yyyy")
                      : "-"}
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      article.isPublished ? STATUS_COLORS.published : STATUS_COLORS.draft
                    }`}
                  >
                    {article.isPublished ? (
                      <>
                        <Eye className="size-3 mr-1" />
                        {t("published") || "Published"}
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-3 mr-1" />
                        {t("draft") || "Draft"}
                      </>
                    )}
                  </span>
                </div>

                {/* Views */}
                <div className="text-sm text-center">
                  <span className="font-medium text-foreground">
                    {article.viewsCount?.toLocaleString() || 0}
                  </span>
                </div>

                {/* Featured */}
                <div className="flex items-center justify-center">
                  {article.isFeatured ? (
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>

                {/* Actions */}
                <ActionsDropdown
                  article={article}
                  loadingId={loadingId}
                  onDelete={handleDelete}
                  t={t}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {numPages > 1 && <Pagination numPages={numPages} />}
    </div>
  );
}

// Actions Dropdown Component
function ActionsDropdown({ article, loadingId, onDelete, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const router = useRouter();

  const isLoading = loadingId === article.id;

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/dashboard/news-management/edit/${article.id}`);
  };

  const handleView = () => {
    setIsOpen(false);
    router.push(`/dashboard/news-management/view/${article.id}`);
  };

  const handleToggleFeatured = async () => {
    try {
      setTogglingFeatured(true);
      await toggleNewsFeatured(article.id);
      toast.success(t("toggleFeaturedSuccess") || "Featured status updated");
      setIsOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(t("toggleFeaturedError") || "Failed to update featured status");
    } finally {
      setTogglingFeatured(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setTogglingPublish(true);
      if (article.isPublished) {
        await unpublishNews(article.id);
        toast.success(t("unpublishSuccess") || "Article unpublished");
      } else {
        await publishNews(article.id);
        toast.success(t("publishSuccess") || "Article published");
      }
      setIsOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(article.isPublished ? t("unpublishError") || "Failed to unpublish" : t("publishError") || "Failed to publish");
    } finally {
      setTogglingPublish(false);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(article.id, article.title);
  };

  return (
    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
      {/* More Actions Dropdown */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d]"
          >
            <MoreHorizontal className="size-4 text-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-52 p-1.5 bg-background dark:bg-[#12141c] border-border"
          align="end"
        >
          <div className="space-y-0.5">
            {/* View Details */}
            <button
              onClick={handleView}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right"
            >
              <Eye className="size-4 text-muted-foreground" />
              {t("viewDetails") || "View Details"}
            </button>

            {/* Edit */}
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right"
            >
              <Pencil className="size-4 text-muted-foreground" />
              {t("edit") || "Edit"}
            </button>

            {/* Divider */}
            <div className="h-px bg-border my-1" />

            {/* Toggle Publish */}
            <button
              onClick={handleTogglePublish}
              disabled={togglingPublish}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right disabled:opacity-50"
            >
              {togglingPublish ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("updating") || "Updating..."}
                </>
              ) : article.isPublished ? (
                <>
                  <EyeOff className="size-4 text-muted-foreground" />
                  {t("unpublish") || "Unpublish"}
                </>
              ) : (
                <>
                  <Send className="size-4 text-green-500" />
                  {t("publish") || "Publish"}
                </>
              )}
            </button>

            {/* Toggle Featured */}
            <button
              onClick={handleToggleFeatured}
              disabled={togglingFeatured}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted dark:hover:bg-[#1a1d2e] transition-colors text-left rtl:text-right disabled:opacity-50"
            >
              {togglingFeatured ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("updating") || "Updating..."}
                </>
              ) : article.isFeatured ? (
                <>
                  <StarOff className="size-4 text-muted-foreground" />
                  {t("removeFeatured") || "Remove Featured"}
                </>
              ) : (
                <>
                  <Star className="size-4 text-yellow-500" />
                  {t("makeFeatured") || "Make Featured"}
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-border my-1" />

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left rtl:text-right disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {isLoading ? t("deleting") || "Deleting..." : t("delete") || "Delete"}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default NewsTable;

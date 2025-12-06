"use client";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import NewsStats from "./NewsStats";
import NewsFilters from "./NewsFilters";
import NewsCard from "./NewsCard";
import Pagination from "../ui app/Pagination";
import {
  toggleNewsFeatured,
  toggleNewsPinned,
  publishNews,
  unpublishNews,
} from "@/app/[locale]/_Lib/newsApi";
import { deleteNew } from "@/app/[locale]/_Lib/actions";

function NewsListRedesign({
  news,
  pagination,
  stats,
  gamesOptions = [],
  locale = "en",
}) {
  const t = useTranslations("news");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (id) => {
    if (confirm(t("confirmDelete"))) {
      await deleteNew(id);
      handleRefresh();
    }
  };

  const handleToggleFeatured = async (id) => {
    await toggleNewsFeatured(id);
    handleRefresh();
  };

  const handleTogglePinned = async (id) => {
    await toggleNewsPinned(id);
    handleRefresh();
  };

  const handlePublish = async (id) => {
    await publishNews(id);
    handleRefresh();
  };

  const handleUnpublish = async (id) => {
    await unpublishNews(id);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-[#677185] mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-[#677185] text-[#677185] hover:text-white"
          >
            <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/dashboard/news/add">
            <Button className="bg-green-primary hover:bg-green-primary/80 text-white">
              <Plus className="size-4 mr-2" />
              {t("addNews")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <NewsStats stats={stats} t={t} />

      {/* Filters */}
      <NewsFilters gamesOptions={gamesOptions} t={t} locale={locale} />

      {/* News List */}
      <div className="space-y-4">
        {news.length === 0 ? (
          <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
            <span className="text-6xl block mb-4">📰</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t("noNews")}
            </h3>
            <p className="text-[#677185] mb-4">{t("noNewsDescription")}</p>
            <Link href="/dashboard/news/add">
              <Button className="bg-green-primary hover:bg-green-primary/80">
                <Plus className="size-4 mr-2" />
                {t("addFirstNews")}
              </Button>
            </Link>
          </div>
        ) : (
          news.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onTogglePinned={handleTogglePinned}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              t={t}
              locale={locale}
            />
          ))
        )}
      </div>

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

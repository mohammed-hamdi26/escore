"use client";

import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import NewsFilter from "./NewsFilter";
import Pagination from "../ui app/Pagination";
import { deleteNew } from "@/app/[locale]/_Lib/actions";
import {
  toggleNewsFeatured,
  publishNews,
  unpublishNews,
} from "@/app/[locale]/_Lib/newsApi";
import { useState } from "react";
import toast from "react-hot-toast";
import DropMenu from "../ui app/DropMenu";
import {
  EllipsisVertical,
  Eye,
  EyeOff,
  Star,
  Newspaper,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { getImgUrl } from "@/lib/utils";

const columns = [
  { id: "title", header: "Title" },
  { id: "author", header: "Author" },
  { id: "publishedAt", header: "Published" },
  { id: "status", header: "Status" },
  { id: "featured", header: "Featured" },
  { id: "actions", header: "Actions" },
];

function NewsTableNew({ news, pagination, games = [] }) {
  const t = useTranslations("NewsTable");
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const numPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || news.length;

  const handleDelete = async (id, title) => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      setIsLoading(true);
      await deleteNew(id);
      toast.success(t("deleteSuccess") || "News deleted successfully");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      setActionLoading(id);
      await toggleNewsFeatured(id);
      toast.success(t("toggleFeaturedSuccess") || "Featured status updated");
    } catch (e) {
      toast.error(t("toggleFeaturedError") || "Failed to update featured status");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePublish = async (id) => {
    try {
      setActionLoading(id);
      await publishNews(id);
      toast.success(t("publishSuccess") || "News published");
    } catch (e) {
      toast.error(t("publishError") || "Failed to publish");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id) => {
    try {
      setActionLoading(id);
      await unpublishNews(id);
      toast.success(t("unpublishSuccess") || "News unpublished");
    } catch (e) {
      toast.error(t("unpublishError") || "Failed to unpublish");
    } finally {
      setActionLoading(null);
    }
  };

  // Check if news is published
  const isPublished = (newsItem) => {
    if (!newsItem.publishedAt) return false;
    return new Date(newsItem.publishedAt) <= new Date();
  };

  return (
    <div className="space-y-8">
      <NewsFilter numOfSize={totalItems} games={games} />

      <Table
        grid_cols="grid-cols-[2fr_1fr_1fr_0.8fr_0.6fr_2fr]"
        columns={columns}
        t={t}
      >
        {news.map((newsItem) => {
          const published = isPublished(newsItem);
          const newsId = newsItem.id || newsItem._id;

          return (
            <Table.Row key={newsId} grid_cols="grid-cols-[2fr_1fr_1fr_0.8fr_0.6fr_2fr]">
              <Table.Cell className="flex gap-3 items-center">
                {newsItem?.coverImage?.light ? (
                  <img
                    src={getImgUrl(newsItem.coverImage.light, "thumbnail")}
                    alt={newsItem.title}
                    className="size-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
                    <Newspaper className="size-5 text-green-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-medium truncate block">{newsItem?.title}</span>
                  {newsItem?.category && (
                    <p className="text-xs text-muted-foreground capitalize">{newsItem.category}</p>
                  )}
                </div>
              </Table.Cell>

              <Table.Cell className="flex gap-2 items-center">
                {newsItem?.authorImage?.light ? (
                  <img
                    src={getImgUrl(newsItem.authorImage.light, "thumbnail")}
                    alt={newsItem.authorName}
                    className="size-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                    <User className="size-3 text-muted-foreground" />
                  </div>
                )}
                <span className="text-sm truncate">{newsItem?.authorName || "-"}</span>
              </Table.Cell>

              <Table.Cell>
                {newsItem.publishedAt
                  ? format(new Date(newsItem.publishedAt), "MMM d, yyyy")
                  : "-"}
              </Table.Cell>

              <Table.Cell>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    published
                      ? "bg-green-500/10 text-green-500"
                      : "bg-gray-500/10 text-gray-500"
                  }`}
                >
                  {published ? t("published") || "Published" : t("draft") || "Draft"}
                </span>
              </Table.Cell>

              <Table.Cell>
                {newsItem.isFeatured ? (
                  <Star className="size-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="size-5 text-gray-300" />
                )}
              </Table.Cell>

              <Table.Cell className="flex justify-end gap-4">
                <Link href={`/dashboard/news/edit/${newsId}`}>
                  <Button
                    disabled={isLoading}
                    className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                  >
                    {t("Edit") || "Edit"}
                  </Button>
                </Link>

                <Button
                  disabled={isLoading}
                  className="text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                  onClick={() => handleDelete(newsId, newsItem.title)}
                >
                  {t("Delete") || "Delete"}
                </Button>

                <DropMenu
                  menuTrigger={<EllipsisVertical />}
                  menuContent={[
                    {
                      id: "view",
                      menuItem: (
                        <Link
                          href={`/dashboard/news/view/${newsId}`}
                          className="flex items-center gap-2"
                        >
                          <Eye className="size-4" />
                          <span>{t("viewDetails") || "View Details"}</span>
                        </Link>
                      ),
                    },
                    {
                      id: "publish",
                      menuItem: (
                        <button
                          onClick={() => published ? handleUnpublish(newsId) : handlePublish(newsId)}
                          disabled={actionLoading === newsId}
                          className="flex items-center gap-2 w-full"
                        >
                          {published ? (
                            <>
                              <EyeOff className="size-4 text-gray-500" />
                              <span>{t("unpublish") || "Unpublish"}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="size-4 text-green-500" />
                              <span>{t("publish") || "Publish"}</span>
                            </>
                          )}
                        </button>
                      ),
                    },
                    {
                      id: "featured",
                      menuItem: (
                        <button
                          onClick={() => handleToggleFeatured(newsId)}
                          disabled={actionLoading === newsId}
                          className="flex items-center gap-2 w-full"
                        >
                          {newsItem.isFeatured ? (
                            <>
                              <Star className="size-4 text-gray-500" />
                              <span>{t("removeFeatured") || "Remove Featured"}</span>
                            </>
                          ) : (
                            <>
                              <Star className="size-4 text-yellow-500" />
                              <span>{t("makeFeatured") || "Make Featured"}</span>
                            </>
                          )}
                        </button>
                      ),
                    },
                  ]}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table>

      <Pagination numPages={numPages} />
    </div>
  );
}

export default NewsTableNew;

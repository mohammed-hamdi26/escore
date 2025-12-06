"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import {
  Star,
  Pin,
  Eye,
  Clock,
  Edit,
  Trash2,
  Send,
  SendHorizontal,
  MoreVertical,
  ExternalLink,
  User,
  EyeOff,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
  news: "bg-blue-500/20 text-blue-400",
  announcement: "bg-orange-500/20 text-orange-400",
  interview: "bg-purple-500/20 text-purple-400",
  analysis: "bg-cyan-500/20 text-cyan-400",
  guide: "bg-green-500/20 text-green-400",
  review: "bg-pink-500/20 text-pink-400",
  opinion: "bg-yellow-500/20 text-yellow-400",
};

const CATEGORY_LABELS = {
  news: { en: "News", ar: "أخبار" },
  announcement: { en: "Announcement", ar: "إعلان" },
  interview: { en: "Interview", ar: "مقابلة" },
  analysis: { en: "Analysis", ar: "تحليل" },
  guide: { en: "Guide", ar: "دليل" },
  review: { en: "Review", ar: "مراجعة" },
  opinion: { en: "Opinion", ar: "رأي" },
};

function NewsCard({
  news,
  onDelete,
  onToggleFeatured,
  onTogglePinned,
  onPublish,
  onUnpublish,
  t,
  locale = "en",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const isPublished = news.publishedAt && new Date(news.publishedAt) <= new Date();
  const coverImage = news.coverImage?.light || news.coverImage?.dark;

  const handleAction = async (action, actionName) => {
    setIsLoading(true);
    setLoadingAction(actionName);
    try {
      await action();
      toast.success(t(`${actionName}Success`));
    } catch (error) {
      toast.error(t(`${actionName}Error`));
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden hover:ring-1 hover:ring-green-primary/30 transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Cover Image */}
        <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={news.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#1a1f2e] flex items-center justify-center">
              <span className="text-4xl text-[#677185]">📰</span>
            </div>
          )}
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {news.isPinned && (
              <Badge className="bg-purple-600 text-white text-xs">
                <Pin className="size-3 mr-1" />
                {t("pinned")}
              </Badge>
            )}
            {news.isFeatured && (
              <Badge className="bg-yellow-600 text-white text-xs">
                <Star className="size-3 mr-1" />
                {t("featured")}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              {/* Category & Game */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  className={`${
                    CATEGORY_COLORS[news.category] || CATEGORY_COLORS.news
                  } text-xs`}
                >
                  {CATEGORY_LABELS[news.category]?.[locale] || news.category}
                </Badge>
                {news.game && (
                  <Badge variant="outline" className="text-xs border-[#677185] text-[#677185]">
                    {news.game.name}
                  </Badge>
                )}
                {!isPublished && (
                  <Badge className="bg-gray-600 text-white text-xs">
                    {t("draft")}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                {news.title}
              </h3>

              {/* Excerpt */}
              {news.excerpt && (
                <p className="text-sm text-[#677185] line-clamp-2 mb-3">
                  {news.excerpt}
                </p>
              )}
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#677185] hover:text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner className="size-4" />
                  ) : (
                    <MoreVertical className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href={`/dashboard/news/edit/${news.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2" />
                    {t("edit")}
                  </DropdownMenuItem>
                </Link>

                {news.urlExternal && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => window.open(news.urlExternal, "_blank")}
                  >
                    <ExternalLink className="size-4 mr-2" />
                    {t("viewSource")}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {isPublished ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleAction(() => onUnpublish(news.id), "unpublish")}
                    disabled={loadingAction === "unpublish"}
                  >
                    <EyeOff className="size-4 mr-2" />
                    {t("unpublish")}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleAction(() => onPublish(news.id), "publish")}
                    disabled={loadingAction === "publish"}
                  >
                    <Send className="size-4 mr-2" />
                    {t("publish")}
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleAction(() => onToggleFeatured(news.id), "toggleFeatured")}
                  disabled={loadingAction === "toggleFeatured"}
                >
                  <Star
                    className={`size-4 mr-2 ${
                      news.isFeatured ? "fill-yellow-500 text-yellow-500" : ""
                    }`}
                  />
                  {news.isFeatured ? t("removeFeatured") : t("makeFeatured")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleAction(() => onTogglePinned(news.id), "togglePinned")}
                  disabled={loadingAction === "togglePinned"}
                >
                  <Pin
                    className={`size-4 mr-2 ${
                      news.isPinned ? "fill-purple-500 text-purple-500" : ""
                    }`}
                  />
                  {news.isPinned ? t("unpin") : t("pin")}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => handleAction(() => onDelete(news.id), "delete")}
                  disabled={loadingAction === "delete"}
                >
                  <Trash2 className="size-4 mr-2" />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta Info */}
          <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-[#677185]">
            {/* Author */}
            <div className="flex items-center gap-1">
              <User className="size-3" />
              <span>{news.authorName || t("unknownAuthor")}</span>
            </div>

            {/* Read Time */}
            {news.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>
                  {news.readTime} {t("minRead")}
                </span>
              </div>
            )}

            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="size-3" />
              <span>{news.viewsCount?.toLocaleString() || 0}</span>
            </div>

            {/* Published Date */}
            {news.publishedAt && (
              <div className="flex items-center gap-1">
                <span>
                  {isPublished ? t("published") : t("scheduled")}:{" "}
                  {format(new Date(news.publishedAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {news.tags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-[#677185]/30 text-[#677185]"
                >
                  #{tag}
                </Badge>
              ))}
              {news.tags.length > 5 && (
                <Badge
                  variant="outline"
                  className="text-xs border-[#677185]/30 text-[#677185]"
                >
                  +{news.tags.length - 5}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsCard;

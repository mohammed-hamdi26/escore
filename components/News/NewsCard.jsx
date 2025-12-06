"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import {
  Star,
  Eye,
  Clock,
  Edit,
  Trash2,
  Send,
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

function NewsCard({
  news,
  onDelete,
  onToggleFeatured,
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
          {/* Featured Badge */}
          {news.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-600 text-white text-xs">
                <Star className="size-3 mr-1" />
                {t("featured")}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              {/* Game & Status */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
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
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {news.title}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/news/edit/${news.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                >
                  <Edit className="size-4 mr-1" />
                  {t("edit")}
                </Button>
              </Link>
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
        </div>
      </div>
    </div>
  );
}

export default NewsCard;

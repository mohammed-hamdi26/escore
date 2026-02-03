"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import {
  Star,
  Clock,
  Edit,
  Trash2,
  Send,
  MoreVertical,
  ExternalLink,
  User,
  EyeOff,
  Eye,
  Newspaper,
  Gamepad2,
  Calendar,
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
  viewMode = "grid",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();

  const isPublished =
    news.publishedAt && new Date(news.publishedAt) <= new Date();
  const coverImage = news.coverImage?.light || news.coverImage?.dark;
  const gameImage = news.game?.logo?.light || news.game?.logo?.dark;

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

  const handleCardClick = () => {
    router.push(`/dashboard/news/view/${news.id || news._id}`);
  };

  // Grid View Card
  if (viewMode === "grid") {
    return (
      <div
        onClick={handleCardClick}
        className="group glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer"
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1a1d2e] to-[#12141c]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper className="size-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Featured Badge Overlay */}
          {news.isFeatured && (
            <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
              <Badge className="bg-yellow-500 text-white border-0 gap-1">
                <Star className="size-3 fill-white" />
                {t("featured") || "Featured"}
              </Badge>
            </div>
          )}

          {/* Status Badge */}
          {!isPublished && (
            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
              <Badge className="bg-gray-600/90 text-white border-0">
                {t("draft") || "Draft"}
              </Badge>
            </div>
          )}

          {/* Actions Menu */}
          <div
            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            style={{ display: isPublished ? "none" : "block" }}
          >
            {isPublished && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white size-8"
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
                  <Link href={`/dashboard/news/view/${news.id || news._id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("viewDetails") || "View Details"}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/news/edit/${news.id || news._id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("edit") || "Edit"}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  {isPublished ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleAction(() => onUnpublish(news.id || news._id), "unpublish")}
                      disabled={loadingAction === "unpublish"}
                    >
                      <EyeOff className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("unpublish") || "Unpublish"}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleAction(() => onPublish(news.id || news._id), "publish")}
                      disabled={loadingAction === "publish"}
                    >
                      <Send className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("publish") || "Publish"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleAction(() => onToggleFeatured(news.id || news._id), "toggleFeatured")}
                    disabled={loadingAction === "toggleFeatured"}
                  >
                    <Star className={`size-4 mr-2 rtl:mr-0 rtl:ml-2 ${news.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    {news.isFeatured ? t("removeFeatured") || "Remove Featured" : t("makeFeatured") || "Make Featured"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => handleAction(() => onDelete(news.id || news._id, news.title), "delete")}
                    disabled={loadingAction === "delete"}
                  >
                    <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("delete") || "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Always show menu on grid */}
          <div
            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white size-8"
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
                <Link href={`/dashboard/news/view/${news.id || news._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewDetails") || "View Details"}
                  </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/news/edit/${news.id || news._id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("edit") || "Edit"}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                {news.urlExternal && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => window.open(news.urlExternal, "_blank")}
                    >
                      <ExternalLink className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("viewSource") || "View Source"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {isPublished ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleAction(() => onUnpublish(news.id || news._id), "unpublish")}
                    disabled={loadingAction === "unpublish"}
                  >
                    <EyeOff className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("unpublish") || "Unpublish"}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleAction(() => onPublish(news.id || news._id), "publish")}
                    disabled={loadingAction === "publish"}
                  >
                    <Send className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("publish") || "Publish"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleAction(() => onToggleFeatured(news.id || news._id), "toggleFeatured")}
                  disabled={loadingAction === "toggleFeatured"}
                >
                  <Star className={`size-4 mr-2 rtl:mr-0 rtl:ml-2 ${news.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  {news.isFeatured ? t("removeFeatured") || "Remove Featured" : t("makeFeatured") || "Make Featured"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => handleAction(() => onDelete(news.id || news._id, news.title), "delete")}
                  disabled={loadingAction === "delete"}
                >
                  <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("delete") || "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Game Badge */}
          {news.game && (
            <div className="flex items-center gap-1.5 mb-2">
              {gameImage ? (
                <img src={gameImage} alt={news.game.name} className="size-4 rounded" />
              ) : (
                <Gamepad2 className="size-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">{news.game.name}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-bold text-foreground line-clamp-2 mb-2">
            {news.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-1">
              <User className="size-3.5" />
              <span className="truncate">{news.authorName || t("unknownAuthor") || "Unknown"}</span>
            </div>

            {/* Published Date */}
            {news.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{format(new Date(news.publishedAt), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View Card
  return (
    <div
      onClick={handleCardClick}
      className="group glass rounded-xl overflow-hidden border border-transparent dark:border-white/5 hover:border-green-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Cover Image */}
        <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1d2e] to-[#12141c] flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper className="size-8 text-muted-foreground/30" />
            </div>
          )}
          {/* Featured indicator */}
          {news.isFeatured && (
            <div className="absolute top-1 left-1">
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-foreground truncate">
              {news.title}
            </h3>
            {!isPublished && (
              <Badge className="bg-gray-500/10 text-gray-500 text-xs border-0">
                {t("draft") || "Draft"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="size-3.5" />
              <span className="truncate">{news.authorName || t("unknownAuthor") || "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Game */}
        <div className="hidden sm:flex items-center gap-4">
          {news.game && (
            <Badge className="bg-muted/50 text-foreground border-0 gap-1.5">
              {gameImage ? (
                <img src={gameImage} alt={news.game.name} className="size-3.5 rounded" />
              ) : (
                <Gamepad2 className="size-3.5" />
              )}
              {news.game.name}
            </Badge>
          )}
        </div>

        {/* Date */}
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          {news.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="size-4" />
              <span>{format(new Date(news.publishedAt), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
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
              <Link href={`/dashboard/news/view/${news.id || news._id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("viewDetails") || "View Details"}
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/news/edit/${news.id || news._id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("edit") || "Edit"}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              {news.urlExternal && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => window.open(news.urlExternal, "_blank")}
                  >
                    <ExternalLink className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("viewSource") || "View Source"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {isPublished ? (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleAction(() => onUnpublish(news.id || news._id), "unpublish")}
                  disabled={loadingAction === "unpublish"}
                >
                  <EyeOff className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("unpublish") || "Unpublish"}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleAction(() => onPublish(news.id || news._id), "publish")}
                  disabled={loadingAction === "publish"}
                >
                  <Send className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("publish") || "Publish"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleAction(() => onToggleFeatured(news.id || news._id), "toggleFeatured")}
                disabled={loadingAction === "toggleFeatured"}
              >
                <Star className={`size-4 mr-2 rtl:mr-0 rtl:ml-2 ${news.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                {news.isFeatured ? t("removeFeatured") || "Remove Featured" : t("makeFeatured") || "Make Featured"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400"
                onClick={() => handleAction(() => onDelete(news.id || news._id, news.title), "delete")}
                disabled={loadingAction === "delete"}
              >
                <Trash2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("delete") || "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;

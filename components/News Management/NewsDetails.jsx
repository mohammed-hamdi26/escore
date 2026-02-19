"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteNew } from "@/app/[locale]/_Lib/actions";
import { toggleNewsFeatured, publishNews, unpublishNews } from "@/app/[locale]/_Lib/newsApi";
import { getImgUrl } from "@/lib/utils";
import {
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Pencil,
  ArrowLeft,
  Star,
  StarOff,
  FileText,
  Tag,
  Gamepad2,
  Trophy,
  Users,
  UserCircle,
  Link as LinkIcon,
  ExternalLink,
  Trash2,
  Send,
  EyeOff,
  Loader2,
} from "lucide-react";

function NewsDetails({ news }) {
  const t = useTranslations("NewsDetails");
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP 'at' p");
  };

  const calculateReadTime = (content) => {
    if (!content) return "1 min";
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete "${news.title}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteNew(news.id);
      toast.success(t("deleteSuccess") || "News deleted successfully");
      router.push("/dashboard/news-management");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete news");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      setTogglingFeatured(true);
      await toggleNewsFeatured(news.id);
      toast.success(t("toggleFeaturedSuccess") || "Featured status updated");
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
      if (news.isPublished) {
        await unpublishNews(news.id);
        toast.success(t("unpublishSuccess") || "Article unpublished");
      } else {
        await publishNews(news.id);
        toast.success(t("publishSuccess") || "Article published");
      }
      router.refresh();
    } catch (e) {
      toast.error(news.isPublished ? t("unpublishError") || "Failed to unpublish" : t("publishError") || "Failed to publish");
    } finally {
      setTogglingPublish(false);
    }
  };

  // Simple markdown to HTML renderer
  const renderContent = (content) => {
    if (!content) return "";
    let html = content;

    // Code blocks
    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>'
    );

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-foreground">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-foreground">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

    // Links and Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full my-4 rounded-lg" />'
    );
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-green-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">$1</code>'
    );

    // Blockquotes
    html = html.replace(
      /^> (.+)$/gim,
      '<blockquote class="border-l-4 border-green-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-lg italic text-muted-foreground">$1</blockquote>'
    );

    // Lists
    html = html.replace(/^[-*+] (.+)$/gim, '<li class="ml-4 list-disc text-foreground">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-4 list-decimal text-foreground">$1</li>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr class="my-6 border-border" />');

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/news-management">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "News Details"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/news-management/edit/${news.id || news._id}`}>
            <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
              <Pencil className="size-4" />
              {t("edit") || "Edit"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Image - 2:1 aspect ratio (newsCover) */}
          {news.coverImage?.light && (
            <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
              <div className="aspect-[2/1] w-full">
                <img
                  src={getImgUrl(news.coverImage.light)}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Header Card */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <div className="space-y-4">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  news.isPublished
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                }`}>
                  {news.isPublished ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  {news.isPublished ? t("published") || "Published" : t("draft") || "Draft"}
                </span>

                {/* Featured Badge */}
                {news.isFeatured && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    <Star className="size-4 fill-yellow-500" />
                    {t("featured") || "Featured"}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{news.title}</h2>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
                {/* Author */}
                {news.authorName && (
                  <div className="flex items-center gap-2">
                    {news.authorImage?.light ? (
                      <img
                        src={getImgUrl(news.authorImage.light)}
                        alt={news.authorName}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">{news.authorName}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  {formatDate(news.publishedAt || news.createdAt)}
                </div>

                {/* Read Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {calculateReadTime(news.content)}
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-5 text-green-primary" />
              {t("content") || "Content"}
            </h3>
            <div
              className="prose prose-sm max-w-none dark:prose-invert overflow-hidden break-words"
              dangerouslySetInnerHTML={{ __html: renderContent(news.content) }}
            />
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="size-5 text-green-primary" />
                {t("tags") || "Tags"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-green-primary/10 text-green-primary text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("quickActions") || "Quick Actions"}
            </h3>
            <div className="space-y-3">
              {/* Toggle Publish */}
              <Button
                variant="outline"
                onClick={handleTogglePublish}
                disabled={togglingPublish}
                className={`w-full gap-2 justify-start ${
                  news.isPublished
                    ? "border-gray-500/30 text-gray-500 hover:bg-gray-500/10"
                    : "border-green-500/30 text-green-500 hover:bg-green-500/10"
                }`}
              >
                {togglingPublish ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : news.isPublished ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
                {news.isPublished ? t("unpublish") || "Unpublish" : t("publish") || "Publish"}
              </Button>

              {/* Toggle Featured */}
              <Button
                variant="outline"
                onClick={handleToggleFeatured}
                disabled={togglingFeatured}
                className={`w-full gap-2 justify-start ${
                  news.isFeatured
                    ? "border-gray-500/30 text-gray-500 hover:bg-gray-500/10"
                    : "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                }`}
              >
                {togglingFeatured ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : news.isFeatured ? (
                  <StarOff className="size-4" />
                ) : (
                  <Star className="size-4" />
                )}
                {news.isFeatured ? t("removeFeatured") || "Remove Featured" : t("makeFeatured") || "Make Featured"}
              </Button>

              <div className="h-px bg-border my-2" />

              {/* Delete */}
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full gap-2 justify-start border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {isDeleting ? t("deleting") || "Deleting..." : t("delete") || "Delete"}
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="size-5 text-green-primary" />
              {t("statistics") || "Statistics"}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="size-4" />
                  {t("views") || "Views"}
                </div>
                <span className="font-bold text-foreground text-xl">
                  {news.viewsCount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="size-4" />
                  {t("likes") || "Likes"}
                </div>
                <span className="font-bold text-foreground text-xl">
                  {news.likesCount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="size-4" />
                  {t("comments") || "Comments"}
                </div>
                <span className="font-bold text-foreground text-xl">
                  {news.commentsCount?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Related Entities */}
          {(news.game || news.tournament || news.team || news.player) && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <LinkIcon className="size-5 text-green-primary" />
                {t("relatedTo") || "Related To"}
              </h3>
              <div className="space-y-3">
                {/* Game */}
                {news.game && (
                  <EntityCard
                    icon={<Gamepad2 className="size-4" />}
                    label={t("game") || "Game"}
                    entity={news.game}
                  />
                )}

                {/* Tournament */}
                {news.tournament && (
                  <EntityCard
                    icon={<Trophy className="size-4" />}
                    label={t("tournament") || "Tournament"}
                    entity={news.tournament}
                  />
                )}

                {/* Team */}
                {news.team && (
                  <EntityCard
                    icon={<Users className="size-4" />}
                    label={t("team") || "Team"}
                    entity={news.team}
                  />
                )}

                {/* Player */}
                {news.player && (
                  <EntityCard
                    icon={<UserCircle className="size-4" />}
                    label={t("player") || "Player"}
                    entity={news.player}
                  />
                )}
              </div>
            </div>
          )}

          {/* External URL */}
          {news.externalUrl && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ExternalLink className="size-5 text-green-primary" />
                {t("externalLink") || "External Link"}
              </h3>
              <a
                href={news.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors group"
              >
                <ExternalLink className="size-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-500 truncate flex-1">
                  {t("visitLink") || "Visit Link"}
                </span>
              </a>
            </div>
          )}

          {/* Timestamps */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="size-5 text-green-primary" />
              {t("timestamps") || "Timestamps"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("created") || "Created"}</span>
                <span className="font-medium text-foreground">
                  {formatDate(news.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("updated") || "Updated"}</span>
                <span className="font-medium text-foreground">
                  {formatDate(news.updatedAt)}
                </span>
              </div>
              {news.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("published") || "Published"}</span>
                  <span className="font-medium text-foreground">
                    {formatDate(news.publishedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Entity Card Component
function EntityCard({ icon, label, entity }) {
  const name = entity?.name || entity?.nickname || entity?.fullName || "Unknown";
  const logo = getImgUrl(entity?.logo?.light) || getImgUrl(entity?.logo?.dark) || getImgUrl(entity?.photo?.light);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e]">
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="size-10 rounded-lg object-cover"
        />
      ) : (
        <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground truncate">{name}</p>
      </div>
    </div>
  );
}

export default NewsDetails;

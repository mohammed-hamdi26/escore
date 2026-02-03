"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { deleteNew } from "@/app/[locale]/_Lib/actions";
import {
  toggleNewsFeatured,
  publishNews,
  unpublishNews,
} from "@/app/[locale]/_Lib/newsApi";
import toast from "react-hot-toast";
import {
  Calendar,
  Pencil,
  ArrowLeft,
  FileText,
  Eye,
  EyeOff,
  Clock,
  Star,
  ExternalLink,
  User,
  Gamepad2,
  Trophy,
  Users,
  Swords,
  Tag,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

function NewsDetails({ news }) {
  const t = useTranslations("NewsDetails");
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(null);

  const newsId = news.id || news._id;

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP 'at' p");
  };

  const formatDateShort = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP");
  };

  // Check if news is published
  const isPublished = () => {
    if (!news.publishedAt) return false;
    return new Date(news.publishedAt) <= new Date();
  };

  // Action handlers
  const handleToggleFeatured = async () => {
    try {
      setActionLoading("featured");
      await toggleNewsFeatured(newsId);
      toast.success(t("toggleFeaturedSuccess") || "Featured status updated");
      router.refresh();
    } catch (e) {
      toast.error(t("toggleFeaturedError") || "Failed to update featured status");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePublish = async () => {
    try {
      setActionLoading("publish");
      await publishNews(newsId);
      toast.success(t("publishSuccess") || "News published successfully");
      router.refresh();
    } catch (e) {
      toast.error(t("publishError") || "Failed to publish news");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async () => {
    try {
      setActionLoading("unpublish");
      await unpublishNews(newsId);
      toast.success(t("unpublishSuccess") || "News unpublished successfully");
      router.refresh();
    } catch (e) {
      toast.error(t("unpublishError") || "Failed to unpublish news");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this news?")) {
      return;
    }
    try {
      setActionLoading("delete");
      await deleteNew(newsId);
      toast.success(t("deleteSuccess") || "News deleted successfully");
      router.push("/dashboard/news");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete news");
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/news">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "News Details"}</h1>
        </div>
        <Link href={`/dashboard/news/edit/${newsId}`}>
          <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
            <Pencil className="size-4" />
            {t("edit") || "Edit News"}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* News Header Card */}
          <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
            {/* Cover Image */}
            {news.coverImage?.light && (
              <div className="relative h-64 w-full">
                <img
                  src={news.coverImage.light}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="p-6">
              {/* Title */}
              <h2 className="text-2xl font-bold text-foreground mb-4">{news.title}</h2>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Status */}
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  isPublished()
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                }`}>
                  {isPublished() ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  {isPublished() ? t("published") || "Published" : t("draft") || "Draft"}
                </span>

                {/* Featured */}
                {news.isFeatured && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    <Star className="size-4 fill-yellow-500" />
                    {t("featured") || "Featured"}
                  </span>
                )}
              </div>

              {/* Slug */}
              {news.slug && (
                <p className="text-muted-foreground text-sm">/{news.slug}</p>
              )}
            </div>
          </div>

          {/* Meta Info Card */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="size-5 text-green-primary" />
              {t("authorInfo") || "Author & Meta"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                {news.authorImage?.light ? (
                  <img
                    src={news.authorImage.light}
                    alt={news.authorName}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">{t("author") || "Author"}</p>
                  <p className="font-medium text-foreground">{news.authorName || "-"}</p>
                </div>
              </div>

              {/* Published Date */}
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("publishedAt") || "Published"}</p>
                  <p className="font-medium text-foreground text-sm">
                    {news.publishedAt ? formatDateShort(news.publishedAt) : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-5 text-green-primary" />
              {t("content") || "Content"}
            </h3>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: news.content || "<p>No content</p>" }}
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
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External URL */}
          {news.urlExternal && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ExternalLink className="size-5 text-green-primary" />
                {t("externalUrl") || "External URL"}
              </h3>
              <a
                href={news.urlExternal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-primary hover:underline flex items-center gap-2"
              >
                {news.urlExternal}
                <ExternalLink className="size-4" />
              </a>
            </div>
          )}

          {/* Cover Images */}
          {(news.coverImage?.light || news.coverImage?.dark) && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="size-5 text-green-primary" />
                {t("coverImages") || "Cover Images"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.coverImage?.light && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                    <img
                      src={news.coverImage.light}
                      alt="Cover Light"
                      className="w-full h-40 object-cover rounded-xl ring-1 ring-gray-200"
                    />
                  </div>
                )}
                {news.coverImage?.dark && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                    <img
                      src={news.coverImage.dark}
                      alt="Cover Dark"
                      className="w-full h-40 object-cover rounded-xl ring-1 ring-white/10"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Related Game */}
          {news.game && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Gamepad2 className="size-5 text-green-primary" />
                {t("relatedGame") || "Related Game"}
              </h3>
              <div className="flex items-center gap-3">
                {news.game.logo?.light ? (
                  <img
                    src={news.game.logo.light}
                    alt={news.game.name}
                    className="size-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-xl bg-green-primary/10 flex items-center justify-center">
                    <Gamepad2 className="size-6 text-green-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{news.game.name}</p>
                  {news.game.slug && (
                    <p className="text-sm text-muted-foreground">/{news.game.slug}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Tournament */}
          {news.tournament && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="size-5 text-green-primary" />
                {t("relatedTournament") || "Related Tournament"}
              </h3>
              <div className="flex items-center gap-3">
                {news.tournament.logo?.light ? (
                  <img
                    src={news.tournament.logo.light}
                    alt={news.tournament.name}
                    className="size-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Trophy className="size-6 text-yellow-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{news.tournament.name}</p>
                  {news.tournament.slug && (
                    <p className="text-sm text-muted-foreground">/{news.tournament.slug}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Team */}
          {news.team && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="size-5 text-green-primary" />
                {t("relatedTeam") || "Related Team"}
              </h3>
              <div className="flex items-center gap-3">
                {news.team.logo?.light ? (
                  <img
                    src={news.team.logo.light}
                    alt={news.team.name}
                    className="size-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="size-6 text-blue-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{news.team.name}</p>
                  {news.team.slug && (
                    <p className="text-sm text-muted-foreground">/{news.team.slug}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Player */}
          {news.player && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="size-5 text-green-primary" />
                {t("relatedPlayer") || "Related Player"}
              </h3>
              <div className="flex items-center gap-3">
                {news.player.image?.light ? (
                  <img
                    src={news.player.image.light}
                    alt={news.player.nickname}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <User className="size-6 text-purple-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{news.player.nickname}</p>
                  {news.player.name && (
                    <p className="text-sm text-muted-foreground">{news.player.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Match */}
          {news.match && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Swords className="size-5 text-green-primary" />
                {t("relatedMatch") || "Related Match"}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  {news.match.team1?.logo?.light ? (
                    <img
                      src={news.match.team1.logo.light}
                      alt={news.match.team1.name}
                      className="size-10 rounded-lg object-cover mx-auto mb-1"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-1">
                      <Users className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs text-foreground">{news.match.team1?.name || "TBD"}</p>
                </div>
                <span className="text-lg font-bold text-muted-foreground">vs</span>
                <div className="text-center">
                  {news.match.team2?.logo?.light ? (
                    <img
                      src={news.match.team2.logo.light}
                      alt={news.match.team2.name}
                      className="size-10 rounded-lg object-cover mx-auto mb-1"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-1">
                      <Users className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs text-foreground">{news.match.team2?.name || "TBD"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-5 text-green-primary" />
              {t("actions") || "Actions"}
            </h3>
            <div className="space-y-3">
              {/* Publish/Unpublish */}
              <Button
                onClick={isPublished() ? handleUnpublish : handlePublish}
                disabled={actionLoading === "publish" || actionLoading === "unpublish"}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                {actionLoading === "publish" || actionLoading === "unpublish" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("updating") || "Updating..."}
                  </>
                ) : isPublished() ? (
                  <>
                    <EyeOff className="size-4" />
                    {t("unpublish") || "Unpublish"}
                  </>
                ) : (
                  <>
                    <Eye className="size-4" />
                    {t("publish") || "Publish"}
                  </>
                )}
              </Button>

              {/* Toggle Featured */}
              <Button
                onClick={handleToggleFeatured}
                disabled={actionLoading === "featured"}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                {actionLoading === "featured" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("updating") || "Updating..."}
                  </>
                ) : news.isFeatured ? (
                  <>
                    <Star className="size-4" />
                    {t("removeFeatured") || "Remove Featured"}
                  </>
                ) : (
                  <>
                    <Star className="size-4 text-yellow-500" />
                    {t("makeFeatured") || "Make Featured"}
                  </>
                )}
              </Button>

              {/* Delete */}
              <Button
                onClick={handleDelete}
                disabled={actionLoading === "delete"}
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                variant="outline"
              >
                {actionLoading === "delete" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("deleting") || "Deleting..."}
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    {t("delete") || "Delete"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="size-5 text-green-primary" />
              {t("metadata") || "Metadata"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("createdAt") || "Created"}</span>
                <span className="font-medium text-foreground text-sm">
                  {news.createdAt ? formatDateShort(news.createdAt) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("updatedAt") || "Updated"}</span>
                <span className="font-medium text-foreground text-sm">
                  {news.updatedAt ? formatDateShort(news.updatedAt) : "-"}
                </span>
              </div>
              {news.originalLanguage && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("originalLanguage") || "Language"}</span>
                  <span className="font-medium text-foreground text-sm uppercase">
                    {news.originalLanguage}
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

export default NewsDetails;

"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import {
  Gamepad2,
  Calendar,
  Pencil,
  ArrowLeft,
  FileText,
  Eye,
  Power,
  Users,
  Trophy,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

function GamesDetails({ game }) {
  const t = useTranslations("GamesDetails");

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/games-management">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "Game Details"}</h1>
        </div>
        <Link href={`/dashboard/games-management/edit/${game.id || game._id}`}>
          <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
            <Pencil className="size-4" />
            {t("edit") || "Edit Game"}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Header Card */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                {game.logo?.light ? (
                  <img
                    src={game.logo.light}
                    alt={game.name}
                    className="size-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="size-24 rounded-2xl bg-green-primary/10 flex items-center justify-center ring-2 ring-green-primary/20">
                    <Gamepad2 className="size-10 text-green-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground truncate">{game.name}</h2>
                </div>

                {game.slug && (
                  <p className="text-muted-foreground mb-3 text-sm">/{game.slug}</p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {/* Active Status */}
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    game.isActive !== false
                      ? "bg-green-500/10 text-green-500 border-green-500/30"
                      : "bg-red-500/10 text-red-500 border-red-500/30"
                  }`}>
                    <Power className="size-4" />
                    {game.isActive !== false ? t("active") || "Active" : t("inactive") || "Inactive"}
                  </span>

                  {/* Release Date Badge */}
                  {game.releaseDate && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-blue-500/10 text-blue-500 border-blue-500/30">
                      <Calendar className="size-4" />
                      {formatDate(game.releaseDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {game.description && (
            <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-5 text-green-primary" />
                {t("description") || "Description"}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{game.description}</p>
            </div>
          )}

          {/* Images */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-green-primary" />
              {t("images") || "Images"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">{t("logo") || "Logo"}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {game.logo?.light && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                      <img
                        src={game.logo.light}
                        alt="Logo Light"
                        className="w-full h-24 object-contain rounded-xl bg-white p-2 ring-1 ring-gray-200"
                      />
                    </div>
                  )}
                  {game.logo?.dark && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                      <img
                        src={game.logo.dark}
                        alt="Logo Dark"
                        className="w-full h-24 object-contain rounded-xl bg-[#1a1d2e] p-2 ring-1 ring-white/10"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image Section */}
              {(game.coverImage?.light || game.coverImage?.dark) && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">{t("coverImage") || "Cover Image"}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {game.coverImage?.light && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{t("lightMode") || "Light Mode"}</p>
                        <img
                          src={game.coverImage.light}
                          alt="Cover Light"
                          className="w-full h-24 object-cover rounded-xl ring-1 ring-gray-200"
                        />
                      </div>
                    )}
                    {game.coverImage?.dark && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{t("darkMode") || "Dark Mode"}</p>
                        <img
                          src={game.coverImage.dark}
                          alt="Cover Dark"
                          className="w-full h-24 object-cover rounded-xl ring-1 ring-white/10"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="size-5 text-green-primary" />
              {t("stats") || "Statistics"}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="size-4" />
                  {t("views") || "Views"}
                </div>
                <span className="font-medium text-foreground">{game.viewsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" />
                  {t("followers") || "Followers"}
                </div>
                <span className="font-medium text-foreground">{game.followersCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Related Counts */}
          <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="size-5 text-green-primary" />
              {t("related") || "Related Content"}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="size-4" />
                  {t("tournaments") || "Tournaments"}
                </div>
                <span className="font-medium text-foreground">{game.tournamentsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" />
                  {t("teams") || "Teams"}
                </div>
                <span className="font-medium text-foreground">{game.teamsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" />
                  {t("players") || "Players"}
                </div>
                <span className="font-medium text-foreground">{game.playersCount || 0}</span>
              </div>
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
                  {game.createdAt ? formatDate(game.createdAt) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("updatedAt") || "Updated"}</span>
                <span className="font-medium text-foreground text-sm">
                  {game.updatedAt ? formatDate(game.updatedAt) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesDetails;

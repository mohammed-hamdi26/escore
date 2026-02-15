"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Zap,
  Newspaper,
  ArrowRightLeft,
  Trophy,
  Megaphone,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";

const NOTIFICATION_TYPES = [
  "match_start",
  "match_end",
  "match_reminder",
  "score_update",
  "news",
  "transfer",
  "tournament_new",
  "tournament_phase",
  "announcement",
  "topic",
];

const STATUS_OPTIONS = ["pending", "sent", "failed", "clicked"];

const typeIcons = {
  match_start: Zap,
  match_end: Trophy,
  match_reminder: Clock,
  score_update: Zap,
  news: Newspaper,
  transfer: ArrowRightLeft,
  tournament_new: Trophy,
  tournament_phase: Trophy,
  announcement: Megaphone,
  topic: Bell,
};

const typeColors = {
  match_start: "text-red-500 bg-red-500/10",
  match_end: "text-yellow-500 bg-yellow-500/10",
  match_reminder: "text-blue-500 bg-blue-500/10",
  score_update: "text-orange-500 bg-orange-500/10",
  news: "text-purple-500 bg-purple-500/10",
  transfer: "text-cyan-500 bg-cyan-500/10",
  tournament_new: "text-emerald-500 bg-emerald-500/10",
  tournament_phase: "text-emerald-500 bg-emerald-500/10",
  announcement: "text-pink-500 bg-pink-500/10",
  topic: "text-gray-500 bg-gray-500/10",
};

const statusColors = {
  pending: "text-yellow-600 bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400",
  sent: "text-green-600 bg-green-100 dark:bg-green-500/10 dark:text-green-400",
  failed: "text-red-600 bg-red-100 dark:bg-red-500/10 dark:text-red-400",
  clicked: "text-blue-600 bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400",
};

export default function NotificationHistory({
  notifications,
  pagination,
  error,
  currentFilters,
}) {
  const t = useTranslations("Notifications.historyPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedNotification, setSelectedNotification] = useState(null);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("?");
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const hasFilters =
    currentFilters.type ||
    currentFilters.status ||
    currentFilters.search ||
    currentFilters.dateFrom ||
    currentFilters.dateTo;

  if (error) {
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-8 text-center">
        <AlertCircle className="size-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="size-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("filters")}
          </span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="size-3" />
              {t("clearFilters")}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("search")}
              defaultValue={currentFilters.search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilters({ search: e.target.value });
                }
              }}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary/20 focus:border-green-primary outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={currentFilters.type}
            onChange={(e) => updateFilters({ type: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none"
          >
            <option value="">{t("allTypes")}</option>
            {NOTIFICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={currentFilters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none"
          >
            <option value="">{t("allStatuses")}</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>

          {/* Date From */}
          <input
            type="date"
            value={currentFilters.dateFrom}
            onChange={(e) => updateFilters({ dateFrom: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t("noNotifications")}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {t("noNotificationsDesc")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const colorClass = typeColors[notif.type] || "text-gray-500 bg-gray-500/10";

              return (
                <div
                  key={notif.id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#1a1d2e] transition-colors cursor-pointer"
                  onClick={() => setSelectedNotification(notif)}
                >
                  <div className={`p-2.5 rounded-xl ${colorClass} shrink-0`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400 uppercase">
                        {notif.type.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[notif.status] || ""
                        }`}
                      >
                        {t(notif.status)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {notif.body}
                    </p>
                    {notif.user && (
                      <p className="text-xs text-gray-400 mt-1">
                        {notif.user.email}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 shrink-0">
                    <Eye className="size-4 text-gray-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 px-4 py-3">
            <span className="text-xs text-gray-500">
              {t("showing", {
                from: (pagination.page - 1) * pagination.limit + 1,
                to: Math.min(pagination.page * pagination.limit, pagination.total),
                total: pagination.total,
              })}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => goToPage(pagination.page - 1)}
                className="p-2 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-[#1a1d2e]"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => goToPage(pagination.page + 1)}
                className="p-2 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-[#1a1d2e]"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("details")}
              </h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <X className="size-4 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Type & Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeColors[selectedNotification.type] || ""
                  }`}
                >
                  {selectedNotification.type.replace(/_/g, " ")}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[selectedNotification.status] || ""
                  }`}
                >
                  {t(selectedNotification.status)}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">
                  {t("title")}
                </label>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {selectedNotification.title}
                </p>
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">
                  {t("body")}
                </label>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedNotification.body}
                </p>
              </div>

              {/* Image */}
              {selectedNotification.imageUrl && (
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">
                    {t("image")}
                  </label>
                  <img
                    src={selectedNotification.imageUrl}
                    alt=""
                    className="rounded-xl max-h-40 object-cover"
                  />
                </div>
              )}

              {/* Recipient */}
              {selectedNotification.user && (
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">
                    {t("recipient")}
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedNotification.user.email}
                    {selectedNotification.user.username && (
                      <span className="text-gray-400 ml-2">
                        (@{selectedNotification.user.username})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Entity */}
              {selectedNotification.entityType && (
                <div className="flex gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">
                      {t("entityType")}
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedNotification.entityType}
                    </p>
                  </div>
                  {selectedNotification.entityId && (
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1 block">
                        {t("entityId")}
                      </label>
                      <p className="text-xs text-gray-500 font-mono">
                        {selectedNotification.entityId}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamps */}
              <div className="flex gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">
                    {t("sentAt")}
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedNotification.clickedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">
                      {t("clickedAt")}
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(selectedNotification.clickedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Raw Data */}
              {selectedNotification.data &&
                Object.keys(selectedNotification.data).length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">
                      {t("rawData")}
                    </label>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1d2e] rounded-xl p-3 overflow-x-auto">
                      {JSON.stringify(selectedNotification.data, null, 2)}
                    </pre>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

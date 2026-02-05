"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Smartphone,
  Apple,
  Globe,
  MonitorSmartphone,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  User,
  Clock,
  Cpu,
  AlertCircle,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const deviceIcons = {
  android: MonitorSmartphone,
  ios: Apple,
  web: Globe,
};

const deviceColors = {
  android: {
    text: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    gradient: "from-green-500/5 to-transparent",
    glow: "group-hover:shadow-green-500/10",
  },
  ios: {
    text: "text-gray-600 dark:text-gray-300",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    gradient: "from-gray-500/5 to-transparent",
    glow: "group-hover:shadow-gray-500/10",
  },
  web: {
    text: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    gradient: "from-blue-500/5 to-transparent",
    glow: "group-hover:shadow-blue-500/10",
  },
};

export default function DevicesTable({ devices = [], pagination, error, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Notifications");

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("?");
  };

  const hasActiveFilters = currentFilters.deviceType || currentFilters.isActive;

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in duration-300">
        <div className="p-3 rounded-xl bg-red-500/20 ring-1 ring-red-500/30">
          <AlertCircle className="size-6 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-red-500">{t("devicesPage.error") || "Error"}</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Filter className="size-4 text-indigo-500" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{t("devicesPage.filters") || "Filters"}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={currentFilters.deviceType || ""}
                onChange={(e) => handleFilterChange("deviceType", e.target.value)}
                className="h-11 pl-4 pr-10 bg-gray-50 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/50 transition-all cursor-pointer appearance-none hover:border-gray-300 dark:hover:border-white/20"
              >
                <option value="">{t("devicesPage.allPlatforms") || "All Platforms"}</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
                <option value="web">Web</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={currentFilters.isActive ?? ""}
                onChange={(e) => handleFilterChange("isActive", e.target.value)}
                className="h-11 pl-4 pr-10 bg-gray-50 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/50 transition-all cursor-pointer appearance-none hover:border-gray-300 dark:hover:border-white/20"
              >
                <option value="">{t("devicesPage.allStatus") || "All Status"}</option>
                <option value="true">{t("devicesPage.active") || "Active"}</option>
                <option value="false">{t("devicesPage.inactive") || "Inactive"}</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-11 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all"
              >
                <X className="size-4 mr-2" />
                {t("devicesPage.clearFilters") || "Clear Filters"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {devices.length === 0 ? (
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-16 text-center">
          <div className="size-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a1d2e] dark:to-[#252a3d] flex items-center justify-center mx-auto mb-5 ring-1 ring-gray-200 dark:ring-white/10">
            <Search className="size-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t("devicesPage.noDevicesTitle") || "No devices found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {t("devicesPage.noDevices") || "Try adjusting your filters to find devices"}
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="mt-5 h-11 px-5 rounded-xl text-green-primary hover:text-green-primary hover:bg-green-primary/10 border border-green-primary/20"
            >
              <X className="size-4 mr-2" />
              {t("devicesPage.clearFilters") || "Clear Filters"}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {devices.map((device, index) => {
            const Icon = deviceIcons[device.deviceType] || Smartphone;
            const colors = deviceColors[device.deviceType] || deviceColors.android;

            return (
              <div
                key={device.id}
                className={`group relative bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-5 hover:border-green-primary/30 transition-all duration-300 overflow-hidden hover:shadow-lg ${colors.glow}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Sparkle effect */}
                <Sparkles className="absolute top-3 right-3 size-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />

                {/* Header */}
                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-12 rounded-xl ${colors.bg} flex items-center justify-center ring-1 ${colors.border} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`size-6 ${colors.text}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {device.deviceType}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {device.deviceName || t("devicesPage.unknownDevice") || "Unknown Device"}
                      </p>
                    </div>
                  </div>
                  {device.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 ring-1 ring-green-500/20">
                      <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                      {t("devicesPage.active") || "Active"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {t("devicesPage.inactive") || "Inactive"}
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-[#1a1d2e] dark:to-[#1a1d2e]/50 rounded-xl p-4 mb-4 ring-1 ring-gray-100 dark:ring-white/5">
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-2">
                    <User className="size-3.5" />
                    <span className="text-xs uppercase tracking-wider font-medium">{t("devicesPage.user") || "User"}</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold truncate">
                    {device.user?.email || t("devicesPage.unknown") || "Unknown"}
                  </p>
                  {device.user?.username && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">@{device.user.username}</p>
                  )}
                </div>

                {/* Details */}
                <div className="relative space-y-3 text-sm">
                  {device.osVersion && (
                    <div className="flex items-center justify-between group/item">
                      <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Cpu className="size-3.5" />
                        {t("devicesPage.osVersion") || "OS Version"}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1a1d2e]">
                        {device.osVersion}
                      </span>
                    </div>
                  )}
                  {device.appVersion && (
                    <div className="flex items-center justify-between group/item">
                      <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Smartphone className="size-3.5" />
                        {t("devicesPage.appVersion") || "App Version"}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1a1d2e]">
                        {device.appVersion}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="size-3.5" />
                      {t("devicesPage.lastActive") || "Last Active"}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {device.lastActiveAt
                        ? format(new Date(device.lastActiveAt), "MMM dd, HH:mm")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] flex items-center justify-center">
                <Smartphone className="size-4 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("devicesPage.showing", {
                  from: (pagination.page - 1) * pagination.limit + 1,
                  to: Math.min(pagination.page * pagination.limit, pagination.total),
                  total: pagination.total,
                }) || (
                  <>
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> devices
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="size-10 rounded-xl border-gray-200 dark:border-white/10 hover:border-green-primary/30 hover:bg-green-primary/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-gray-200 dark:disabled:hover:border-white/10 transition-all"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-[#1a1d2e] rounded-xl">
                <span className="text-green-primary font-bold">{pagination.page}</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">{pagination.totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="size-10 rounded-xl border-gray-200 dark:border-white/10 hover:border-green-primary/30 hover:bg-green-primary/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-gray-200 dark:disabled:hover:border-white/10 transition-all"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

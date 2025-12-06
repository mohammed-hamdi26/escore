"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const deviceIcons = {
  android: MonitorSmartphone,
  ios: Apple,
  web: Globe,
};

const deviceColors = {
  android: "text-green-500",
  ios: "text-gray-300",
  web: "text-blue-400",
};

export default function DevicesTable({ devices = [], pagination, error, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to first page on filter change
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
        <p className="text-red-500 dark:text-red-400">Error loading devices: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />

        <select
          value={currentFilters.deviceType}
          onChange={(e) => handleFilterChange("deviceType", e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-green-primary"
        >
          <option value="">All Platforms</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="web">Web</option>
        </select>

        <select
          value={currentFilters.isActive ?? ""}
          onChange={(e) => handleFilterChange("isActive", e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-green-primary"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {(currentFilters.deviceType || currentFilters.isActive) && (
          <Button
            variant="ghost"
            onClick={() => router.push("?")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-transparent">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">Platform</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">Device</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">App Version</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">Last Active</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No devices found
                  </td>
                </tr>
              ) : (
                devices.map((device) => {
                  const Icon = deviceIcons[device.deviceType] || Smartphone;
                  const color = deviceColors[device.deviceType] || "text-gray-400";

                  return (
                    <tr key={device.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">{device.user?.email || "Unknown"}</p>
                          {device.user?.username && (
                            <p className="text-gray-500 text-sm">@{device.user.username}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${color}`} />
                          <span className="text-gray-700 dark:text-gray-300 capitalize">{device.deviceType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-white">{device.deviceName || "-"}</p>
                          {device.osVersion && (
                            <p className="text-gray-500 text-sm">{device.osVersion}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {device.appVersion || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {device.lastActiveAt
                          ? format(new Date(device.lastActiveAt), "yyyy-MM-dd HH:mm")
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {device.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 dark:text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 dark:text-red-400">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} devices
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-gray-700 dark:text-gray-300 px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

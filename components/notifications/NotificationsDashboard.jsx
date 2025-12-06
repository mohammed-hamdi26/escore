"use client";

import {
  Send,
  CheckCircle,
  MousePointer,
  Percent,
  Target,
  Smartphone,
  Activity,
  Apple,
  MonitorSmartphone,
  Globe
} from "lucide-react";

function StatCard({ title, value, icon: Icon, color = "text-green-primary", subtext }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gray-700/50 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ platform, count, icon: Icon }) {
  const colors = {
    android: "text-green-500",
    ios: "text-gray-300",
    web: "text-blue-400",
  };

  return (
    <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-4">
      <Icon className={`w-8 h-8 ${colors[platform] || "text-gray-400"}`} />
      <div>
        <p className="text-white font-semibold">{count}</p>
        <p className="text-gray-400 text-sm capitalize">{platform}</p>
      </div>
    </div>
  );
}

export default function NotificationsDashboard({ stats, error }) {
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
        <p className="text-red-400">Error loading statistics: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <p className="text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  const platformIcons = {
    android: MonitorSmartphone,
    ios: Apple,
    web: Globe,
  };

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Notification Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            title="Total Sent"
            value={stats.totalSent?.toLocaleString() || 0}
            icon={Send}
            color="text-blue-400"
          />
          <StatCard
            title="Total Delivered"
            value={stats.totalDelivered?.toLocaleString() || 0}
            icon={CheckCircle}
            color="text-green-400"
          />
          <StatCard
            title="Total Clicked"
            value={stats.totalClicked?.toLocaleString() || 0}
            icon={MousePointer}
            color="text-purple-400"
          />
          <StatCard
            title="Delivery Rate"
            value={`${stats.deliveryRate?.toFixed(1) || 0}%`}
            icon={Percent}
            color="text-cyan-400"
          />
          <StatCard
            title="Click Rate"
            value={`${stats.clickRate?.toFixed(1) || 0}%`}
            icon={Target}
            color="text-orange-400"
          />
        </div>
      </div>

      {/* Device Stats */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Device Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Devices"
            value={stats.devices?.total?.toLocaleString() || 0}
            icon={Smartphone}
            color="text-indigo-400"
          />
          <StatCard
            title="Active Devices"
            value={stats.devices?.active?.toLocaleString() || 0}
            icon={Activity}
            color="text-green-400"
            subtext={`${stats.devices?.total > 0 ? ((stats.devices?.active / stats.devices?.total) * 100).toFixed(1) : 0}% active`}
          />
        </div>
      </div>

      {/* Platform Breakdown */}
      {stats.devices?.byPlatform && Object.keys(stats.devices.byPlatform).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Devices by Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.devices.byPlatform).map(([platform, count]) => (
              <PlatformCard
                key={platform}
                platform={platform}
                count={count}
                icon={platformIcons[platform] || Smartphone}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notifications by Type */}
      {stats.byType && Object.keys(stats.byType).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Notifications by Type</h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="text-center">
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-gray-400 text-sm capitalize">{type.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Period Info */}
      {stats.period && (
        <div className="text-gray-500 text-sm">
          <p>
            Statistics from {new Date(stats.period.start).toLocaleDateString()} to{" "}
            {new Date(stats.period.end).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

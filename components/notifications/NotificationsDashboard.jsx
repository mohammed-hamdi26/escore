"use client";

import { useState, useMemo, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Send,
  CheckCircle,
  MousePointer,
  Target,
  Smartphone,
  Activity,
  Apple,
  MonitorSmartphone,
  Globe,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Zap,
  BarChart3,
  PieChart,
  Loader2,
} from "lucide-react";
import { fetchNotificationTimelineAction } from "@/app/[locale]/_Lib/actions";

function StatCard({ title, value, icon: Icon, color, bgColor, gradientFrom, gradientTo, subtext, delay = 0 }) {
  return (
    <div
      className="group relative bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-5 hover:border-green-primary/30 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom || 'from-transparent'} ${gradientTo || 'to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-3xl font-bold ${color} transition-transform duration-300 group-hover:scale-105`}>
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-green-500">{subtext}</span>
            </p>
          )}
        </div>
        <div className={`relative p-3 rounded-xl ${bgColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
          <Icon className={`size-6 ${color}`} />
          <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ platform, count, icon: Icon, total }) {
  const platformConfig = {
    android: { color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "hover:border-green-500/30", gradientFrom: "from-green-500/5", gradientTo: "to-transparent", label: "Android", barColor: "bg-green-500" },
    ios: { color: "text-gray-600 dark:text-gray-300", bgColor: "bg-gray-500/10", borderColor: "hover:border-gray-500/30", gradientFrom: "from-gray-500/5", gradientTo: "to-transparent", label: "iOS", barColor: "bg-gray-500" },
    web: { color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "hover:border-blue-500/30", gradientFrom: "from-blue-500/5", gradientTo: "to-transparent", label: "Web", barColor: "bg-blue-500" },
  };
  const config = platformConfig[platform] || platformConfig.android;
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

  return (
    <div className={`group relative flex flex-col gap-4 bg-white dark:bg-[#0f1118] rounded-2xl p-5 border border-gray-200 dark:border-white/5 ${config.borderColor} transition-all duration-300 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex items-center gap-4">
        <div className={`p-3 rounded-xl ${config.bgColor} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`size-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{config.label}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${config.color}`}>{percentage}%</p>
        </div>
      </div>
      <div className="relative h-2 bg-gray-100 dark:bg-[#1a1d2e] rounded-full overflow-hidden">
        <div className={`absolute left-0 top-0 h-full ${config.barColor} rounded-full transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 flex items-center justify-center border border-green-primary/20">
          <Icon className="size-5 text-green-primary" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {action && action}
    </div>
  );
}

function TypeBadge({ type, count }) {
  const typeConfig = {
    match: { color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
    news: { color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
    transfer: { color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20" },
    tournament: { color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/20" },
    team: { color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/20" },
    player: { color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20" },
    general: { color: "text-gray-500", bgColor: "bg-gray-500/10", borderColor: "border-gray-500/20" },
  };
  const config = typeConfig[type.toLowerCase()] || typeConfig.general;

  return (
    <div className={`group flex flex-col items-center justify-center p-5 rounded-2xl ${config.bgColor} border ${config.borderColor} hover:scale-105 transition-all duration-300 cursor-default`}>
      <p className={`text-3xl font-bold ${config.color}`}>{count.toLocaleString()}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1.5 font-medium">{type.replace(/_/g, " ")}</p>
    </div>
  );
}

// SVG-based line chart
function TimelineChart({ data, t }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxSent = Math.max(...data.map((d) => d.sent || 0), 1);
    const maxClicked = Math.max(...data.map((d) => d.clicked || 0), 1);
    const maxFailed = Math.max(...data.map((d) => d.failed || 0), 1);
    const maxVal = Math.max(maxSent, maxClicked, maxFailed, 1);

    const width = 800;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

    const toPoint = (val, i) => {
      const x = padding.left + (data.length > 1 ? i * xStep : chartWidth / 2);
      const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
      return { x, y };
    };

    const toPath = (key) => {
      const points = data.map((d, i) => toPoint(d[key] || 0, i));
      if (points.length === 1) return "";
      return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    };

    const toArea = (key) => {
      const points = data.map((d, i) => toPoint(d[key] || 0, i));
      if (points.length === 1) return "";
      const line = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
      const lastX = points[points.length - 1].x;
      const firstX = points[0].x;
      const baseY = padding.top + chartHeight;
      return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
    };

    // Y-axis gridlines
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
      y: padding.top + chartHeight - pct * chartHeight,
      label: Math.round(pct * maxVal),
    }));

    // X-axis labels (show a subset)
    const labelStep = Math.max(1, Math.floor(data.length / 7));
    const xLabels = data
      .filter((_, i) => i % labelStep === 0 || i === data.length - 1)
      .map((d, _, arr) => {
        const idx = data.indexOf(d);
        const x = padding.left + (data.length > 1 ? idx * xStep : chartWidth / 2);
        const dateStr = d.date || "";
        const short = dateStr.length >= 10 ? dateStr.slice(5) : dateStr; // MM-DD
        return { x, label: short };
      });

    return { width, height, padding, chartWidth, chartHeight, maxVal, toPath, toArea, gridLines, xLabels, toPoint, data };
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        {t("stats.noTimelineData") || "No timeline data available"}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-auto min-w-[500px]">
        {/* Grid lines */}
        {chartData.gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={chartData.padding.left}
              y1={line.y}
              x2={chartData.padding.left + chartData.chartWidth}
              y2={line.y}
              stroke="currentColor"
              className="text-gray-100 dark:text-white/5"
              strokeDasharray="4 4"
            />
            <text
              x={chartData.padding.left - 8}
              y={line.y + 4}
              textAnchor="end"
              className="fill-gray-400 dark:fill-gray-500"
              fontSize="10"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* Area fills */}
        <path d={chartData.toArea("sent")} fill="rgb(59, 130, 246)" opacity="0.08" />
        <path d={chartData.toArea("clicked")} fill="rgb(168, 85, 247)" opacity="0.08" />

        {/* Lines */}
        <path d={chartData.toPath("sent")} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={chartData.toPath("clicked")} fill="none" stroke="rgb(168, 85, 247)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={chartData.toPath("failed")} fill="none" stroke="rgb(239, 68, 68)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />

        {/* Data points */}
        {chartData.data.map((d, i) => {
          const sent = chartData.toPoint(d.sent || 0, i);
          const clicked = chartData.toPoint(d.clicked || 0, i);
          return (
            <g key={i}>
              <circle cx={sent.x} cy={sent.y} r="3" fill="rgb(59, 130, 246)" />
              <circle cx={clicked.x} cy={clicked.y} r="3" fill="rgb(168, 85, 247)" />
            </g>
          );
        })}

        {/* X-axis labels */}
        {chartData.xLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={chartData.height - 5}
            textAnchor="middle"
            className="fill-gray-400 dark:fill-gray-500"
            fontSize="10"
          >
            {label.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500 rounded" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("stats.sent") || "Sent"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-purple-500 rounded" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("stats.clicked") || "Clicked"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500 rounded border-dashed" style={{ borderTop: "1.5px dashed rgb(239, 68, 68)", height: 0 }} />
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("stats.failed") || "Failed"}</span>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsDashboard({ stats, initialTimeline, error }) {
  const t = useTranslations("Notifications");
  const [period, setPeriod] = useState("30d");
  const [timeline, setTimeline] = useState(initialTimeline);
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const groupBy = newPeriod === "7d" ? "day" : newPeriod === "90d" ? "week" : "day";
    startTransition(async () => {
      const data = await fetchNotificationTimelineAction(newPeriod, groupBy);
      setTimeline(data);
    });
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-red-500/20">
          <AlertCircle className="size-6 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-red-500">{t("error") || "Error"}</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-12 flex flex-col items-center justify-center">
        <div className="size-12 rounded-full border-4 border-green-primary/30 border-t-green-primary animate-spin mb-4" />
        <span className="text-gray-500 dark:text-gray-400">{t("loading") || "Loading statistics..."}</span>
      </div>
    );
  }

  const platformIcons = {
    android: MonitorSmartphone,
    ios: Apple,
    web: Globe,
  };

  const totalDevices = stats.devices?.total || 0;
  const periods = [
    { id: "7d", label: t("stats.7days") || "7 Days" },
    { id: "30d", label: t("stats.30days") || "30 Days" },
    { id: "90d", label: t("stats.90days") || "90 Days" },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title={t("stats.totalSent") || "Total Sent"}
          value={stats.totalSent?.toLocaleString() || 0}
          icon={Send}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
          gradientFrom="from-blue-500/5"
          gradientTo="to-transparent"
          delay={0}
        />
        <StatCard
          title={t("stats.totalDelivered") || "Total Delivered"}
          value={stats.totalDelivered?.toLocaleString() || 0}
          icon={CheckCircle}
          color="text-green-500"
          bgColor="bg-green-500/10"
          gradientFrom="from-green-500/5"
          gradientTo="to-transparent"
          delay={50}
        />
        <StatCard
          title={t("stats.totalClicked") || "Total Clicked"}
          value={stats.totalClicked?.toLocaleString() || 0}
          icon={MousePointer}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
          gradientFrom="from-purple-500/5"
          gradientTo="to-transparent"
          delay={100}
        />
        <StatCard
          title={t("stats.deliveryRate") || "Delivery Rate"}
          value={`${stats.deliveryRate?.toFixed(1) || 0}%`}
          icon={Zap}
          color="text-cyan-500"
          bgColor="bg-cyan-500/10"
          gradientFrom="from-cyan-500/5"
          gradientTo="to-transparent"
          delay={150}
        />
        <StatCard
          title={t("stats.clickRate") || "Click Rate"}
          value={`${stats.clickRate?.toFixed(1) || 0}%`}
          icon={Target}
          color="text-orange-500"
          bgColor="bg-orange-500/10"
          gradientFrom="from-orange-500/5"
          gradientTo="to-transparent"
          delay={200}
        />
      </div>

      {/* Timeline Chart */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 flex items-center justify-center border border-green-primary/20">
                <TrendingUp className="size-5 text-green-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("stats.timeline") || "Notification Timeline"}
              </h2>
              {isPending && <Loader2 className="size-4 text-gray-400 animate-spin" />}
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a1d2e] rounded-lg p-1">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p.id
                      ? "bg-white dark:bg-[#252a3d] text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <TimelineChart data={timeline?.timeline || []} t={t} />
        </div>
      </div>

      {/* Device Statistics Section */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent">
          <SectionHeader title={t("stats.deviceStats") || "Device Statistics"} icon={Smartphone} />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatCard
              title={t("stats.totalDevices") || "Total Devices"}
              value={stats.devices?.total?.toLocaleString() || 0}
              icon={Smartphone}
              color="text-indigo-500"
              bgColor="bg-indigo-500/10"
              gradientFrom="from-indigo-500/5"
              gradientTo="to-transparent"
            />
            <StatCard
              title={t("stats.activeDevices") || "Active Devices"}
              value={stats.devices?.active?.toLocaleString() || 0}
              icon={Activity}
              color="text-green-500"
              bgColor="bg-green-500/10"
              gradientFrom="from-green-500/5"
              gradientTo="to-transparent"
              subtext={`${stats.devices?.total > 0 ? ((stats.devices?.active / stats.devices?.total) * 100).toFixed(1) : 0}% ${t("stats.active") || "active"}`}
            />
          </div>

          {/* Platform Breakdown */}
          {stats.devices?.byPlatform && Object.keys(stats.devices.byPlatform).length > 0 && (
            <div className="pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="size-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("stats.devicesByPlatform") || "Devices by Platform"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats.devices.byPlatform).map(([platform, count]) => (
                  <PlatformCard
                    key={platform}
                    platform={platform}
                    count={count}
                    icon={platformIcons[platform] || Smartphone}
                    total={totalDevices}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications by Type */}
      {stats.byType && Object.keys(stats.byType).length > 0 && (
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent">
            <SectionHeader title={t("stats.notificationsByType") || "Notifications by Type"} icon={BarChart3} />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <TypeBadge key={type} type={type} count={count} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Period Info — only show when there are notifications */}
      {stats.period && stats.totalSent > 0 && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#1a1d2e] rounded-xl p-4 border border-gray-200 dark:border-white/5">
          <div className="size-8 rounded-lg bg-gray-200 dark:bg-[#252a3d] flex items-center justify-center">
            <BarChart3 className="size-4 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {t("stats.period") || "Statistics from"}{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {new Date(stats.period.start).toLocaleDateString()}
            </span>{" "}
            {t("stats.to") || "to"}{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {new Date(stats.period.end).toLocaleDateString()}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

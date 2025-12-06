"use client";
import { Newspaper, Star, Pin, Eye } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-4 flex items-center gap-4">
      <div
        className={`p-3 rounded-lg ${color}`}
      >
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-[#677185]">{label}</p>
      </div>
    </div>
  );
}

function NewsStats({ stats, t }) {
  const statItems = [
    {
      icon: Newspaper,
      label: t("totalNews"),
      value: stats.total || 0,
      color: "bg-blue-600",
    },
    {
      icon: Star,
      label: t("featured"),
      value: stats.featured || 0,
      color: "bg-yellow-600",
    },
    {
      icon: Pin,
      label: t("pinned"),
      value: stats.pinned || 0,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statItems.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}

export default NewsStats;

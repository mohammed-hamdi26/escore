"use client";

import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

function StatCard({ title, value, icon: Icon, gradient, iconBg }) {
  return (
    <div className="bg-white dark:bg-[#0f1118] rounded-xl p-4 border border-gray-200 dark:border-white/5 hover:border-green-primary/30 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className={`size-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`size-6 ${gradient}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function SupportStatsCards({ stats }) {
  const t = useTranslations("SupportCenter");

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#0f1118] rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: t("Total Tickets"),
      value: stats.total || 0,
      icon: Ticket,
      gradient: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      title: t("Open"),
      value: stats.open || 0,
      icon: AlertCircle,
      gradient: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
    },
    {
      title: t("In Progress"),
      value: stats.inProgress || 0,
      icon: Clock,
      gradient: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
    {
      title: t("Waiting Reply"),
      value: stats.waitingReply || 0,
      icon: MessageSquare,
      gradient: "text-cyan-500",
      iconBg: "bg-cyan-500/10",
    },
    {
      title: t("Resolved"),
      value: stats.resolved || 0,
      icon: CheckCircle,
      gradient: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      title: t("Closed"),
      value: stats.closed || 0,
      icon: XCircle,
      gradient: "text-gray-500",
      iconBg: "bg-gray-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

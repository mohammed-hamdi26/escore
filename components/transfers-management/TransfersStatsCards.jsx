"use client";
import {
  ArrowRightLeft,
  CheckCircle,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

function StatCard({ title, value, icon: Icon, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-4 flex items-center gap-4`}>
      <div className="p-3 rounded-full bg-white/20">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function TransfersStatsCards({ stats }) {
  const t = useTranslations("TransfersManagement");

  if (!stats) return null;

  const cards = [
    {
      title: t("Total Transfers"),
      value: stats.total || 0,
      icon: ArrowRightLeft,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: t("Confirmed"),
      value: stats.confirmed || 0,
      icon: CheckCircle,
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: t("Pending"),
      value: stats.pending || 0,
      icon: Clock,
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    {
      title: t("Rumors"),
      value: stats.rumor || 0,
      icon: HelpCircle,
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: t("Cancelled"),
      value: stats.cancelled || 0,
      icon: XCircle,
      bgColor: "bg-gradient-to-r from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

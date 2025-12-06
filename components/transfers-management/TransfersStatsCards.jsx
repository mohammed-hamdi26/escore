"use client";
import { ArrowRightLeft } from "lucide-react";
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

  return (
    <div className="mb-6">
      <StatCard
        title={t("Total Transfers")}
        value={stats.total || 0}
        icon={ArrowRightLeft}
        bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
      />
    </div>
  );
}

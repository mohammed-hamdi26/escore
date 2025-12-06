"use client";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  XCircle
} from "lucide-react";

function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-4 flex items-center gap-4`}>
      <div className={`${color} p-3 rounded-full bg-white/20`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function SupportStatsCards({ stats, t }) {
  if (!stats) return null;

  const cards = [
    {
      title: t("Total Tickets"),
      value: stats.total || 0,
      icon: Ticket,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: t("Open"),
      value: stats.open || 0,
      icon: AlertCircle,
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    {
      title: t("In Progress"),
      value: stats.inProgress || 0,
      icon: Clock,
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: t("Waiting Reply"),
      value: stats.waitingReply || 0,
      icon: MessageSquare,
      bgColor: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    },
    {
      title: t("Resolved"),
      value: stats.resolved || 0,
      icon: CheckCircle,
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: t("Closed"),
      value: stats.closed || 0,
      icon: XCircle,
      bgColor: "bg-gradient-to-r from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

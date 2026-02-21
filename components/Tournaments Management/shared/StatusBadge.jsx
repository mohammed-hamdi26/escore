"use client";

import { useTranslations } from "next-intl";

const DEFAULT_STATUS_MAP = {
  // Bracket statuses
  not_generated: { color: "bg-gray-500/10 text-gray-500" },
  generated: { color: "bg-blue-500/10 text-blue-500" },
  in_progress: { color: "bg-green-500/10 text-green-500" },
  completed: { color: "bg-purple-500/10 text-purple-500" },
  // Match statuses
  scheduled: { color: "bg-blue-500/10 text-blue-500" },
  live: { color: "bg-red-500/10 text-red-500 animate-pulse" },
  cancelled: { color: "bg-gray-500/10 text-gray-500" },
  // Stage statuses
  pending: { color: "bg-gray-500/10 text-gray-500" },
  active: { color: "bg-blue-500/10 text-blue-500" },
};

function StatusBadge({ status, statusMap, className = "" }) {
  const t = useTranslations("TournamentDetails");

  const map = { ...DEFAULT_STATUS_MAP, ...statusMap };
  const config = map[status] || { color: "bg-gray-500/10 text-gray-500" };

  const label = t(status) || status;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
      role="status"
      aria-label={`${t("status") || "Status"}: ${label}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;

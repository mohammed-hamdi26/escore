"use client";
import {
  ArrowRightLeft,
  Clock,
  UserMinus,
  UserPlus,
  RotateCcw,
  LogOut,
  CheckCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";

// Status Badge Component
export function StatusBadge({ status, t }) {
  const statusConfig = {
    rumor: {
      label: t("Rumor"),
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      icon: HelpCircle,
    },
    pending: {
      label: t("Pending"),
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    confirmed: {
      label: t("Confirmed"),
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    cancelled: {
      label: t("Cancelled"),
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.rumor;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Type Badge Component
export function TypeBadge({ type, t }) {
  const typeConfig = {
    transfer: {
      label: t("Transfer"),
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      icon: ArrowRightLeft,
    },
    loan: {
      label: t("Loan"),
      className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
      icon: Clock,
    },
    free_agent: {
      label: t("Free Agent"),
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: UserPlus,
    },
    retirement: {
      label: t("Retirement"),
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      icon: LogOut,
    },
    return_from_loan: {
      label: t("Return from Loan"),
      className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      icon: RotateCcw,
    },
  };

  const config = typeConfig[type] || typeConfig.transfer;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Featured Badge
export function FeaturedBadge({ t }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
      {t("Featured")}
    </span>
  );
}

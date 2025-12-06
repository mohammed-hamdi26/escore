"use client";

// Status Badge
export function StatusBadge({ status, t }) {
  const statusConfig = {
    open: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-300",
      label: "Open",
    },
    in_progress: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-800 dark:text-purple-300",
      label: "In Progress",
    },
    waiting_reply: {
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
      text: "text-cyan-800 dark:text-cyan-300",
      label: "Waiting Reply",
    },
    resolved: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      label: "Resolved",
    },
    closed: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-300",
      label: "Closed",
    },
  };

  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {t ? t(config.label) : config.label}
    </span>
  );
}

// Priority Badge
export function PriorityBadge({ priority, t }) {
  const priorityConfig = {
    low: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-300",
      label: "Low",
    },
    medium: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-300",
      label: "Medium",
    },
    high: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-800 dark:text-orange-300",
      label: "High",
    },
    urgent: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-300",
      label: "Urgent",
    },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {t ? t(config.label) : config.label}
    </span>
  );
}

// Category Badge
export function CategoryBadge({ category, t }) {
  const categoryConfig = {
    bug: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-300",
      label: "Bug",
    },
    feature: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      text: "text-indigo-800 dark:text-indigo-300",
      label: "Feature",
    },
    question: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-300",
      label: "Question",
    },
    complaint: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-800 dark:text-amber-300",
      label: "Complaint",
    },
    other: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-300",
      label: "Other",
    },
  };

  const config = categoryConfig[category] || categoryConfig.other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {t ? t(config.label) : config.label}
    </span>
  );
}

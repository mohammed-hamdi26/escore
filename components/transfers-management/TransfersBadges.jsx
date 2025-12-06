"use client";

// Featured Badge
export function FeaturedBadge({ t }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
      {t("Featured")}
    </span>
  );
}

"use client";

import { Trash2, X, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function BulkActionBar({
  count,
  onSelectAll,
  onDeselectAll,
  onDelete,
  canDelete = true,
  isLoading = false,
}) {
  const t = useTranslations("bulk");

  if (count === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-3 px-5 py-3 rounded-xl",
        "bg-background/80 backdrop-blur-xl border shadow-2xl",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
    >
      <span className="text-sm font-medium whitespace-nowrap">
        {t("itemsSelected", { count })}
      </span>

      <div className="h-5 w-px bg-border" />

      {onSelectAll && (
        <Button variant="ghost" size="sm" onClick={onSelectAll}>
          <CheckSquare className="size-4 mr-1.5" />
          {t("selectAll")}
        </Button>
      )}

      <Button variant="ghost" size="sm" onClick={onDeselectAll}>
        <X className="size-4 mr-1.5" />
        {t("deselectAll")}
      </Button>

      {canDelete && (
        <>
          <div className="h-5 w-px bg-border" />
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
          >
            <Trash2 className="size-4 mr-1.5" />
            {t("deleteSelected")}
          </Button>
        </>
      )}
    </div>
  );
}

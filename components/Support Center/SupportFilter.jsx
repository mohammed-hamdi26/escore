"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import InputApp from "../ui app/InputApp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_reply", label: "Waiting Reply" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const CATEGORY_OPTIONS = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature Request" },
  { value: "question", label: "Question" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function SupportFilter({ t }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setSearchTerm("");
  };

  const hasFilters = searchParams.get("status") || searchParams.get("category") ||
    searchParams.get("priority") || searchParams.get("search");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <InputApp
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set("search", e.target.value);
              } else {
                params.delete("search");
              }
              params.delete("page");
              router.push(`${pathname}?${params.toString()}`);
            }}
            placeholder={t("Search tickets...")}
            className="w-full"
            flexGrow="flex-0"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectValue placeholder={t("Status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Status")}</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <SelectTrigger className="w-[160px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectValue placeholder={t("Category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Categories")}</SelectItem>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={searchParams.get("priority") || "all"}
          onValueChange={(value) => updateFilter("priority", value)}
        >
          <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectValue placeholder={t("Priority")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Priority")}</SelectItem>
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
          >
            <X className="w-4 h-4" />
            {t("Clear")}
          </Button>
        )}
      </div>
    </div>
  );
}

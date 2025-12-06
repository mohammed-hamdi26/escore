"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories", labelAr: "جميع التصنيفات" },
  { value: "news", label: "News", labelAr: "أخبار" },
  { value: "announcement", label: "Announcement", labelAr: "إعلان" },
  { value: "interview", label: "Interview", labelAr: "مقابلة" },
  { value: "analysis", label: "Analysis", labelAr: "تحليل" },
  { value: "guide", label: "Guide", labelAr: "دليل" },
  { value: "review", label: "Review", labelAr: "مراجعة" },
  { value: "opinion", label: "Opinion", labelAr: "رأي" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status", labelAr: "جميع الحالات" },
  { value: "featured", label: "Featured", labelAr: "مميز" },
  { value: "pinned", label: "Pinned", labelAr: "مثبت" },
];

function NewsFilters({ gamesOptions = [], t, locale = "en" }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      updateParams("search", value);
    }, 500);
  };

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("category") ||
    searchParams.get("game") ||
    searchParams.get("isFeatured") ||
    searchParams.get("isPinned");

  return (
    <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#677185]" />
          <Input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder={t("searchPlaceholder")}
            className="pl-10 bg-[#1a1f2e] dark:bg-[#1a1f2e] border-0 text-white placeholder:text-[#677185]"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(value) => updateParams("category", value)}
        >
          <SelectTrigger className="w-full lg:w-[180px] bg-[#1a1f2e] border-0 text-white">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {locale === "ar" ? option.labelAr : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Game Filter */}
        <Select
          value={searchParams.get("game") || "all"}
          onValueChange={(value) => updateParams("game", value)}
        >
          <SelectTrigger className="w-full lg:w-[180px] bg-[#1a1f2e] border-0 text-white">
            <SelectValue placeholder={t("game")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allGames")}</SelectItem>
            {gamesOptions.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={
            searchParams.get("isFeatured") === "true"
              ? "featured"
              : searchParams.get("isPinned") === "true"
              ? "pinned"
              : "all"
          }
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.delete("isFeatured");
            params.delete("isPinned");
            params.delete("page");
            if (value === "featured") {
              params.set("isFeatured", "true");
            } else if (value === "pinned") {
              params.set("isPinned", "true");
            }
            router.push(`${pathname}?${params.toString()}`);
          }}
        >
          <SelectTrigger className="w-full lg:w-[150px] bg-[#1a1f2e] border-0 text-white">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {locale === "ar" ? option.labelAr : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <X className="size-4 mr-2" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default NewsFilters;

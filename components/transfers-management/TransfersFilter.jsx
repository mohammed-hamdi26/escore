"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
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

export default function TransfersFilter({ games = [] }) {
  const t = useTranslations("TransfersManagement");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

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

  const hasFilters = searchParams.get("game") || searchParams.get("search");

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
            placeholder={t("searchTransfers")}
            className="w-full"
            flexGrow="flex-0"
          />
        </div>

        {/* Game Filter */}
        {games.length > 0 && (
          <Select
            value={searchParams.get("game") || "all"}
            onValueChange={(value) => updateFilter("game", value)}
          >
            <SelectTrigger className="w-[150px] text-black dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder={t("Game")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Games")}</SelectItem>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

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

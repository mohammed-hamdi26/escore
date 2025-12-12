"use client";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, RefreshCw, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import PlayerCard from "./PlayerCard";
import Pagination from "../ui app/Pagination";
import { deletePlayer } from "@/app/[locale]/_Lib/actions";

function PlayerListRedesign({ players, pagination }) {
  const t = useTranslations("playerList");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  console.log("pagination", pagination);
  console.table(players);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (id) => {
    if (confirm(t("confirmDelete"))) {
      await deletePlayer(id);
      handleRefresh();
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-[#677185] mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-[#677185] text-[#677185] hover:text-white"
          >
            <RefreshCw
              className={`size-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            className="bg-green-primary hover:bg-green-primary/80 text-white"
            onClick={() => router.push("/dashboard/player-management/add")}
          >
            <Plus className="size-4 mr-2" />
            {t("addPlayer")}
          </Button>
        </div>
      </div>

      {/* Simple Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#677185]" />
        <Input
          placeholder={t("searchPlaceholder")}
          defaultValue={searchParams.get("search") || ""}
          onChange={handleSearch}
          className="pl-10 bg-dashboard-box dark:bg-[#0F1017] border-0 text-white placeholder:text-[#677185]"
        />
      </div>

      {/* Players List */}
      <div className="space-y-4">
        {players.length === 0 ? (
          <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
            <User className="size-16 mx-auto mb-4 text-[#677185]" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {t("noPlayers")}
            </h3>
            <p className="text-[#677185] mb-4">{t("noPlayersDescription")}</p>
            <Button
              className="bg-green-primary hover:bg-green-primary/80"
              onClick={() => router.push("/dashboard/player-management/add")}
            >
              <Plus className="size-4 mr-2" />
              {t("addFirstPlayer")}
            </Button>
          </div>
        ) : (
          players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onDelete={handleDelete}
              t={t}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination numPages={pagination.totalPages} />
      )}
    </div>
  );
}

export default PlayerListRedesign;

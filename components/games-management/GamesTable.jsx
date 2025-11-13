"use client";
import { deleteGame } from "@/app/[locale]/_Lib/actions";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import GamesFilter from "./GamesFilter";
import Pagination from "../ui app/Pagination";

function GamesTable({ games, columns }) {
  const t = useTranslations("GamesTable");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-8">
      <GamesFilter />
      <Table
        t={t}
        grid_cols="grid-cols-[0.5fr_0.5fr_2fr]"
        data={games}
        columns={[...columns]}
      >
        {games.map((game) => (
          <Table.Row key={game.id} grid_cols="grid-cols-[0.5fr_0.5fr_2fr]">
            <Table.Cell className="flex items-center gap-2">
              <Image
                src={
                  "https://db8f573bab41.ngrok-free.app/api/files/download/15a9e280-3225-4ec1-83c1-6204c48364a0uiux.png"
                }
                width={20}
                height={20}
                alt=""
              />
              {game.name}
            </Table.Cell>
            <Table.Cell> {game.description}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/games-management/edit/${game.id}`}>
                  <Button
                    disabled={isLoading}
                    className={
                      "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                    }
                  >
                    {t("Edit")}
                  </Button>
                </Link>
                <Button
                  disabled={isLoading}
                  className={
                    "text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                  }
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await deleteGame(game.id);
                      toast.success("The Game is Deleted");
                    } catch (e) {
                      toast.error("error in Delete");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {t("Delete")}
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination />
    </div>
  );
}

export default GamesTable;

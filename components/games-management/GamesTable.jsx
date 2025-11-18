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
import imageLogo from "@/public/images/a-flat-vector-lettermark-logo-design-sho_M1U1HI8tTvOIgjZLmcU6eg_gSbp1v7WSyql-yuko9RTsQ-removebg-preview.png";
import { useSearchParams } from "next/navigation";
import { getFirst10Words, getNumPages } from "@/app/[locale]/_Lib/helps";

function GamesTable({ games, columns, numOfGames }) {
  const t = useTranslations("GamesTable");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  console.log(numOfGames);
  const numPages = getNumPages(numOfGames, Number(searchParams.get("size")));

  return (
    <div className="space-y-8">
      <GamesFilter numOfSize={numOfGames} />
      <Table
        t={t}
        grid_cols="grid-cols-[1fr_0.5fr_2fr]"
        data={games}
        columns={[...columns]}
      >
        {games.map((game) => (
          <Table.Row key={game.id} grid_cols="grid-cols-[1fr_0.5fr_2fr]">
            <Table.Cell className="flex items-center gap-2">
              {game?.icon && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${game?.icon}`}
                  width={40}
                  height={40}
                  alt=""
                />
              )}
              {game.name}
            </Table.Cell>
            <Table.Cell> {getFirst10Words(game.description)}</Table.Cell>
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
      <Pagination numPages={numPages} />
    </div>
  );
}

export default GamesTable;

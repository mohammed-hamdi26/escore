"use client";
import { Link } from "@/i18n/navigation";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import FilterPlayers from "./FilterPlayers";
import { useState } from "react";
import Pagination from "../ui app/Pagination";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { deletePlayer } from "@/app/[locale]/_Lib/actions";
import DropMenu from "../ui app/DropMenu";
import { Award, EllipsisVertical, Heart, Link2 } from "lucide-react";
import { calculateAge } from "@/app/[locale]/_Lib/helps";

function PlayersTable({ players, columns, pagination }) {
  const t = useTranslations("PlayersTable");
  const [isLoading, setIsLoading] = useState(false);
  const numPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || players.length;

  return (
    <div className="space-y-8">
      <FilterPlayers numOfPlayers={totalItems} />

      <Table
        t={t}
        columns={columns}
        grid_cols={"grid-cols-[1fr_0.5fr_0.5fr_0.5fr_2fr]"}
        data={players}
      >
        {players.map((player) => (
          <Table.Row
            x
            grid_cols={"grid-cols-[1fr_0.5fr_0.5fr_0.5fr_2fr]"}
            key={player.id}
          >
            <Table.Cell className="flex items-center gap-2">
              {(player?.photo?.light || player?.photo?.dark) && (
                <img
                  src={`${player?.photo?.light || player?.photo?.dark}`}
                  className="rounded-full overflow-hidden size-10"
                  alt=""
                />
              )}{" "}
              {player.nickname}
            </Table.Cell>
            <Table.Cell>
              {(player?.team?.logo?.light || player?.team?.logo?.dark) && (
                <img
                  className="rounded-full overflow-hidden size-10"
                  src={`${
                    player?.team?.logo?.light || player?.team?.logo?.dark
                  }`}
                  alt=""
                />
              )}
            </Table.Cell>
            <Table.Cell>{calculateAge(player.dateOfBirth)}</Table.Cell>
            <Table.Cell>{player.country.name}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/player-management/edit/${player.id}`}>
                  <Button
                    className={
                      "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                    }
                  >
                    {t("Edit")}
                  </Button>
                </Link>
                <Button
                  disabled={isLoading}
                  className={
                    "text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                  }
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await deletePlayer(player.id);
                      toast.success("The Player is Deleted");
                    } catch (e) {
                      toast.error("error in Delete");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {t("Delete")}
                </Button>
                <DropMenu
                  menuTrigger={<EllipsisVertical />}
                  menuContent={[
                    {
                      id: "links",
                      menuItem: (
                        <Link
                          href={`/dashboard/player-management/links/${player.id}`}
                          className="flex items-center gap-2"
                        >
                          <Link2 />
                          <span>{t("Links")}</span>
                        </Link>
                      ),
                    },
                    {
                      id: "favorites characters",
                      menuItem: (
                        <Link
                          href={`/dashboard/player-management/favorites-characters/${player.id}`}
                          className="flex  items-center gap-2 flex-1"
                        >
                          <Heart />
                          <span>{t("Favorites characters")}</span>
                        </Link>
                      ),
                    },
                    {
                      id: "awards",
                      menuItem: (
                        <Link
                          href={`/dashboard/player-management/awards/${player.id}`}
                          className="flex items-center gap-2"
                        >
                          <Award />
                          <span>{t("Awards")}</span>
                        </Link>
                      ),
                    },
                  ]}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>

      <Pagination numPages={numPages} />
    </div>
  );
}

export default PlayersTable;

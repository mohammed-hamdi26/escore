"use client";
import { Link } from "@/i18n/navigation";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import FilterPlayers from "./FilterPlayers";
import { Suspense, lazy, useState } from "react";
import Pagination from "../ui app/Pagination";
import { useTranslations } from "next-intl";
import Image from "next/image";
import imageIcon from "@/public/images/a-flat-vector-lettermark-logo-design-sho_M1U1HI8tTvOIgjZLmcU6eg_gSbp1v7WSyql-yuko9RTsQ-removebg-preview.png";
import toast from "react-hot-toast";
import { deletePlayer } from "@/app/[locale]/_Lib/actions";
import DropMenu from "../ui app/DropMenu";
import { EllipsisVertical, Heart, Link2 } from "lucide-react";

function PlayersTable({ players, columns, search }) {
  const t = useTranslations("PlayersTable");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="space-y-8">
      <FilterPlayers search={search} />
      <Suspense
        name="Players Table"
        fallback={<div>Loading players table...</div>}
      >
        <Table
          columns={columns}
          grid_cols={"grid-cols-[1fr_0.5fr_0.5fr_0.5fr_2fr]"}
          data={players}
        >
          {players.map((player) => (
            <Table.Row
              grid_cols={"grid-cols-[1fr_0.5fr_0.5fr_0.5fr_2fr]"}
              key={player.id}
            >
              <Table.Cell>
                {player.firstName} {player.lastName}
              </Table.Cell>
              <Table.Cell>
                <Image src={imageIcon} width={40} height={40} />
              </Table.Cell>
              <Table.Cell>{player.birthDate}</Table.Cell>
              <Table.Cell>{player.nationality}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-4">
                  <Link href={`/dashboard/player-management/edit/${player.id}`}>
                    <Button
                      className={
                        "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                      }
                    >
                      Edit
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
                            <span>Links</span>
                          </Link>
                        ),
                      },
                      {
                        id: "favorites characters",
                        menuItem: (
                          <Link
                            href={`/dashboard/player-management/favorites-characters/${player.id}`}
                            className="flex items-center gap-2"
                          >
                            <Heart />
                            <span>Favorites characters</span>
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
      </Suspense>

      <Pagination />
    </div>
  );
}

export default PlayersTable;

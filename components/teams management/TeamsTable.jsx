"use client";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import TeamsFilter from "./TeamsFilter";
import Pagination from "../ui app/Pagination";
import { deleteTeam } from "@/app/[locale]/_Lib/actions";
import { useState } from "react";
import toast from "react-hot-toast";
import DropMenu from "../ui app/DropMenu";
import { EllipsisVertical, Link2 } from "lucide-react";
export default function TeamsTable({ teams, columns }) {
  const t = useTranslations("TeamsTable");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="space-y-8">
      <TeamsFilter />
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
        t={t}
      >
        {teams.map((team) => (
          <Table.Row
            key={team.id}
            grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
          >
            <Table.Cell>{team?.name}</Table.Cell>
            <Table.Cell>{team?.region}</Table.Cell>
            <Table.Cell>{team?.description}</Table.Cell>
            <Table.Cell className="flex justify-end gap-4">
              <Link href={`/dashboard/teams-management/edit/${team.id}`}>
                <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
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
                    await deleteTeam(team.id);
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
              <DropMenu
                menuTrigger={<EllipsisVertical />}
                menuContent={[
                  {
                    id: "links",
                    menuItem: (
                      <Link
                        href={`/dashboard/teams-management/links/${team.id}`}
                        className="flex items-center gap-2"
                      >
                        <Link2 />
                        <span>Links</span>
                      </Link>
                    ),
                  },
                ]}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination />
    </div>
  );
}

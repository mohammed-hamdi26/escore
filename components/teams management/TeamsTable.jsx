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
import { Award, EllipsisVertical, Link2 } from "lucide-react";
import { getFirst10Words } from "@/app/[locale]/_Lib/helps";

export default function TeamsTable({ teams, columns, pagination }) {
  const t = useTranslations("TeamsTable");
  const [isLoading, setIsLoading] = useState(false);
  const numPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || teams.length;
  return (
    <div className="space-y-8">
      <TeamsFilter numOfSize={totalItems} />
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_1fr_2fr]"
        columns={[...columns]}
        t={t}
      >
        {teams.map((team) => (
          <Table.Row key={team.id} grid_cols="grid-cols-[0.5fr_0.5fr_1fr_2fr]">
            <Table.Cell className="flex gap-2 items-center">
              {team?.logo && <img width={30} src={team?.logo} alt="" />}{" "}
              {team?.name}
            </Table.Cell>
            <Table.Cell>{team?.region}</Table.Cell>
            <Table.Cell>{getFirst10Words(team?.description)}</Table.Cell>
            <Table.Cell className="flex justify-end gap-4">
              <Link
                disabled={isLoading}
                href={`/dashboard/teams-management/edit/${team.id}`}
              >
                <Button
                  disabled={isLoading}
                  className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
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
                  {
                    id: "awards",
                    menuItem: (
                      <Link
                        href={`/dashboard/teams-management/awards/${team.id}`}
                        className="flex items-center gap-2"
                      >
                        <Award />
                        <span>Awards</span>
                      </Link>
                    ),
                  },
                ]}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination numPages={numPages} />
    </div>
  );
}

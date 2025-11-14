"use client";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import TeamsFilter from "./TeamsFilter";
import Pagination from "../ui app/Pagination";
export default function TeamsTable({ teams, columns }) {
  const t = useTranslations("TeamsTable");
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
            <Table.Cell>
              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/teams-management/edit/${team.id}`}>
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    Edit
                  </Button>
                </Link>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination />
    </div>
  );
}

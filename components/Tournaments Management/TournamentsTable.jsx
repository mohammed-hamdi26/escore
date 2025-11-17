"use client";
import { Link } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import { format } from "date-fns";
import TournamentsFilter from "./TournamentsFilter";
import { useState } from "react";
import { deleteTournament } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getNumPages } from "@/app/[locale]/_Lib/helps";

const columns = [
  {
    id: "name",
    header: "name",
  },
  {
    id: "organizer",
    header: "Organizer",
  },
  {
    id: "description",
    header: "Desc",
  },
  {
    id: "startDate",
    header: "Start Date",
  },
  {
    id: "endDate",
    header: "End Date",
  },
];

function TournamentsTable({ tournaments, numOfTournaments }) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("TournamentsTable");
  const searchParams = useSearchParams();
  const numPages = getNumPages(
    numOfTournaments,
    Number(searchParams.get("size"))
  );

  return (
    <div className="space-y-8">
      <TournamentsFilter numOfSize={numOfTournaments} />

      <Table
        t={t}
        grid_cols="grid-cols-[1fr_0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        columns={columns}
        data={tournaments}
      >
        {tournaments.map((tournament) => (
          <Table.Row
            key={tournament.id}
            grid_cols="grid-cols-[1fr_0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
          >
            <Table.Cell>{tournament?.name}</Table.Cell>
            <Table.Cell>{tournament?.organizer}</Table.Cell>
            <Table.Cell>{tournament?.description}</Table.Cell>
            <Table.Cell>
              {format(tournament?.startDate, "yyyy-MM-dd")}
            </Table.Cell>
            <Table.Cell>{format(tournament?.endDate, "yyyy-MM-dd")}</Table.Cell>

            <Table.Cell className="flex justify-end gap-4">
              <Link
                href={`/dashboard/tournaments-management/edit/${tournament.id}`}
              >
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
                    await deleteTournament(tournament.id);
                    toast.success("The Tournament is Deleted");
                  } catch (e) {
                    toast.error("error in Delete");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {t("Delete")}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination numPages={numPages} numItems={tournaments.length} />
    </div>
  );
}

export default TournamentsTable;

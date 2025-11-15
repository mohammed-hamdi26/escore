"use client";
import { Link } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import FilterMatches from "./FilterMatches";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteMatch } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function MatchesTable({ matches, columns }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="space-y-8">
      <FilterMatches />
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
      >
        {matches?.map((match) => (
          <Table.Row
            grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
            key={match.id}
          >
            <Table.Cell>{match?.teams[0]?.name}</Table.Cell>
            <Table.Cell>{match?.teams[1]?.name}</Table.Cell>
            <Table.Cell>{match.matchTime}</Table.Cell>
            <Table.Cell>{match.matchDate}</Table.Cell>
            <Table.Cell className="flex gap-4 justify-end">
              <Link href={`/dashboard/matches-management/edit/${match.id}`}>
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
                    await deleteMatch(match.id);
                    toast.success("The Match is Deleted");
                  } catch (e) {
                    toast.error("error in Delete");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {"Delete"}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination />
    </div>
  );
}

export default MatchesTable;

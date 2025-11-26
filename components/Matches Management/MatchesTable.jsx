"use client";
import { Link } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import FilterMatches from "./FilterMatches";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteMatch } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { getNumPages } from "@/app/[locale]/_Lib/helps";
import { useTranslations } from "next-intl";
import DropMenu from "../ui app/DropMenu";
import { EllipsisVertical, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import TeamLineup from "./TeamLineup";

function MatchesTable({ matches, columns, numOfMatches, players }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const numPages = getNumPages(numOfMatches, Number(searchParams.get("size")));
  const t = useTranslations("MatchesTable");

  return (
    <div className="space-y-8">
      <FilterMatches numOfSize={numOfMatches} />
      <Table
        t={t}
        grid_cols="grid-cols-[1fr_1fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
      >
        {matches?.map((match) => (
          <Table.Row
            grid_cols={"grid-cols-[1fr_1fr_0.5fr_0.5fr_2fr]"}
            key={match.id}
          >
            <Table.Cell className="flex gap-2 items-center">
              {match?.teams[0]?.logo && (
                <img width={30} src={match?.teams[0]?.logo} alt="" />
              )}{" "}
              {match?.teams[0]?.name}
            </Table.Cell>
            <Table.Cell className="flex gap-2 items-center">
              {match?.teams[1]?.logo && (
                <img width={30} src={match?.teams[1]?.logo} alt="" />
              )}{" "}
              {match?.teams[1]?.name}
            </Table.Cell>
            <Table.Cell>{match.stage}</Table.Cell>
            <Table.Cell>{match.matchDate}</Table.Cell>
            <Table.Cell className="flex gap-4 justify-end">
              <Dialog open={open} onOpenChange={setOpen}>
                <Link href={`/dashboard/matches-management/edit/${match.id}`}>
                  <Button
                    className={
                      "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                    }
                  >
                    {t("Edit")}{" "}
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
                      await deleteMatch(match.id);
                      toast.success(t("The Match is Deleted"));
                    } catch (e) {
                      toast.error(t("error in Delete"));
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
                      id: "1",
                      menuItem: (
                        <DialogTrigger onClick={() => setOpen(true)} asChild>
                          <button dir="rtl">
                            {`${t("Add Lineup For")} ${match?.teams[0]?.name}`}
                          </button>
                        </DialogTrigger>
                      ),
                    },
                    {
                      id: "2",
                      menuItem: (
                        <DialogTrigger onClick={() => setOpen(true)} asChild>
                          <button dir="rtl">
                            {`${t("Add Lineup For")} ${match?.teams[1]?.name}`}
                          </button>
                        </DialogTrigger>
                      ),
                    },
                  ]}
                />
                <DialogContent>
                  <TeamLineup
                    players={players}
                    t={t}
                    title={`${t("Add Lineup For")} ${match?.teams[0]?.name}`}
                    match={match}
                    setOpen={setOpen}
                  />
                </DialogContent>
              </Dialog>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination numPages={numPages} />
    </div>
  );
}

export default MatchesTable;

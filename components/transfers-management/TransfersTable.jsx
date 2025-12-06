"use client";
import { Link } from "@/i18n/navigation";

import { Button } from "../ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import { deleteTransfer } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import TransfersFilter from "./TransfersFilter";

const columns = [
  {
    id: "player",
    header: "player",
  },
  {
    id: "from",
    header: "From",
  },
  {
    id: "to",
    header: "To",
  },
  {
    id: "fee",
    header: "fee",
  },
];

export default function TransfersTable({ transfers, pagination }) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("TransfersTable");
  const numPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || transfers.length;

  return (
    <div className="space-y-8">
      <TransfersFilter numOfSize={totalItems} />

      <Table
        t={t}
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        columns={columns}
      >
        {transfers.map((transfer) => (
          <Table.Row
            key={transfer.id}
            grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
          >
            <Table.Cell className="flex gap-2 items-center">
              {transfer?.player.nickname}
            </Table.Cell>
            <Table.Cell>{transfer?.fromTeam?.name}</Table.Cell>
            <Table.Cell>{transfer?.toTeam?.name}</Table.Cell>
            <Table.Cell>{transfer?.fee}</Table.Cell>

            <Table.Cell className="flex justify-end gap-4">
              <Link
                href={`/dashboard/transfers-management/edit/${transfer.id}`}
              >
                <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
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
                    await deleteTransfer(transfer.id);
                    toast.success("The Transfer is Deleted");
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
      <Pagination numPages={numPages} />
    </div>
  );
}

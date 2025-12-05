"use client";
import { useState } from "react";
import EditDialog from "../Links/EditDialog";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import AwardsForm from "./AwardsForm";
import { useTranslations } from "next-intl";
import { deleteAward } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function AwardsTable({ awards, games, awardsType, idUser }) {
  const t = useTranslations("Awards");
  const columns = [{ id: "name", header: t("Name") }];
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Table columns={columns} grid_cols={"grid-cols-[0.5fr_2fr]"}>
        {awards.map((award) => (
          <Table.Row grid_cols={"grid-cols-[0.5fr_2fr]"} key={award.id}>
            <Table.Cell>{award.name}</Table.Cell>
            {/* <Table.Cell>{award.description}</Table.Cell> */}
            <Table.Cell className="flex gap-4 justify-end">
              <EditDialog
                idUser={idUser}
                title={t("Edit Award")}
                t={t}
                trigger={
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    {t("Edit")}
                  </Button>
                }
                contentDialog={
                  <AwardsForm
                    id={idUser}
                    t={t}
                    award={award}
                    games={games}
                    awardsType={awardsType}
                  />
                }
              />
              <Button
                disabled={isLoading}
                className={
                  "text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                }
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await deleteAward(awardsType, idUser, award.id);
                    toast.success(t("Award deleted successfully"));
                  } catch (e) {
                    toast.error(t("Error deleting award"));
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
    </div>
  );
}

export default AwardsTable;

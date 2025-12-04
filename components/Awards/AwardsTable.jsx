"use client";
import { useState } from "react";
import EditDialog from "../Links/EditDialog";
import LinksForm from "../Links/LinksForm";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import AwardsForm from "./AwardsForm";
import { useTranslations } from "next-intl";

const columns = [{ id: "name", header: "Name" }];
function AwardsTable({ awards, games, awardsType, idUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("AwardsTable");
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
                    await deleteLink(linksType, idUser, link.id);
                    toast.success(t("The Link is Deleted"));
                  } catch (e) {
                    toast.error(t("error in Delete"));
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

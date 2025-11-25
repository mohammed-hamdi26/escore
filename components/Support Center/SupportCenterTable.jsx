"use client";
import { format } from "date-fns";
import AnswerBox from "../ui app/AnswerBox";
import Model from "../ui app/Model";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import imagePerson from "../../public/images/dashboard/avatar.jpg";
import Image from "next/image";
import { useTranslations } from "next-intl";

function SupportCenterTable({ tickets }) {
  const t = useTranslations("SupportCenter");
  return (
    <div>
      <Table
        columns={[
          { id: "date", header: t("Date") },
          { id: "email", header: t("Email") },
          { id: "description", header: t("Description") },
          { id: "status", header: t("Status") },
        ]}
        // showHeader={false}
        grid_cols="grid-cols-[0.5fr_0.9fr_0.7fr_0.5fr_2fr]"
      >
        {tickets.map((ticket) => (
          <Table.Row
            key={ticket.id}
            grid_cols="grid-cols-[0.5fr_0.5fr_0.7fr_0.5fr_2fr]"
          >
            <Table.Cell>{format(ticket.createdAt, "yyyy-MM-dd")}</Table.Cell>

            <Table.Cell className="flex gap-2 items-center">
              {/* <Image
                src={imagePerson}
                width={30}
                height={30}
                alt=""
                className="rounded-full"
              />{" "} */}
              {ticket?.email}
            </Table.Cell>
            <Table.Cell>{ticket.description}</Table.Cell>
            <Table.Cell>{ticket.status}</Table.Cell>
            <Table.Cell className="flex gap-4 justify-end">
              <Model>
                <Model.Open name={"answer"}>
                  <Button
                    className={
                      "bg-green-primary text-white rounded-full min-w-[100px] cursor-pointer hover:bg-green-primary/70"
                    }
                  >
                    {t("Answer")}
                  </Button>
                </Model.Open>
                <Model.Window openName={"answer"}>
                  <AnswerBox t={t} ticket={ticket} />
                </Model.Window>
              </Model>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}

export default SupportCenterTable;

"use client";
import { Link } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import { format } from "date-fns";

import { useState } from "react";
import { deleteLink, deleteTournament } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getNumPages } from "@/app/[locale]/_Lib/helps";
import Image from "next/image";
import LinksForm from "./LinksForm";
import EditDialog from "./EditDialog";

const columns = [
  {
    id: "name",
    header: "name",
  },
  {
    id: "url",
    header: "URL",
  },
];

function LinksTable({ links, numOfLinks, idUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("LinksTable");
  const searchParams = useSearchParams();
  const numPages = getNumPages(numOfLinks, Number(searchParams.get("size")));

  return (
    <div className="space-y-8">
      {/* <LinksFilter numOfSize={numOfLinks} /> */}

      <Table
        t={t}
        grid_cols="grid-cols-[0.5fr_0.5fr_2fr]"
        columns={columns}
        // data={tournaments}
      >
        {links.map((link) => (
          <Table.Row key={link.id} grid_cols="grid-cols-[0.5fr_0.5fr_2fr]">
            <Table.Cell className="flex gap-2 items-center text-lg">
              {link?.icon && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${link?.icon}`}
                  width={40}
                  height={40}
                  alt=""
                  className="rounded-full"
                />
              )}
              {link?.name}
            </Table.Cell>
            <Table.Cell>
              <a href={link?.url}>{link?.url}</a>
            </Table.Cell>

            <Table.Cell className="flex gap-4 justify-end">
              <EditDialog
                link={link}
                idUser={idUser}
                t={t}
                trigger={
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    {t("Edit")}
                  </Button>
                }
                contentDialog={
                  <LinksForm id={idUser} link={link} idUser={idUser} t={t} />
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
                    await deleteLink(link.id, idUser);
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
      <Pagination numPages={numPages} numItems={links.length} />
    </div>
  );
}
export default LinksTable;

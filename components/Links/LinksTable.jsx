"use client";
import { Link } from "@/i18n/navigation";
import Pagination from "../ui app/Pagination";
import Table from "../ui app/Table";
import { Button } from "../ui/button";
import { format } from "date-fns";

import { useState } from "react";
import { deleteLink, deleteTournament } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
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

function LinksTable({ links, numOfLinks, idUser, linksType = "players" }) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("LinksTable");
  const searchParams = useSearchParams();
  const numPages = getNumPages(numOfLinks, Number(searchParams.get("size")));
  const locale = useLocale();
  console.log("links", links);
  return (
    <div className="space-y-8">
      {/* <LinksFilter numOfSize={numOfLinks} /> */}

      <Table
        t={t}
        grid_cols="grid-cols-[0.7fr_0.7fr_2fr]"
        columns={columns}
        // data={tournaments}
      >
        {links.map((link) => (
          <Table.Row key={link.id} grid_cols="grid-cols-[0.7fr_0.7fr_2fr]">
            <Table.Cell className="flex gap-4 items-center text-lg">
              {link?.image?.light && (
                <img
                  src={`${link?.image?.light}`}
                  alt=""
                  className="rounded-full size-10"
                />
              )}
              {link?.name}
            </Table.Cell>
            <Table.Cell>
              <a className="text-[#3A469D] hover:underline" href={link?.url}>
                {link?.url}
              </a>
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
                  <LinksForm
                    linksType={linksType}
                    id={idUser}
                    link={link}
                    idUser={idUser}
                    t={t}
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
      <Pagination numPages={numPages} numItems={links.length} />
    </div>
  );
}
export default LinksTable;

"use client";
import Table from "@/components/ui app/Table";
import { useTranslations } from "next-intl";

import DialogLinks from "./DialogLinks";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteAppSocialLink } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function LinksContainer({ links }) {
  const t = useTranslations("LinksApp");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className=" space-y-6 ">
      <DialogLinks
        trigger={
          <Button
            className={
              "text-white text-center w-fit min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-colors duration-300"
            }
          >
            {t("Add New Link")}
          </Button>
        }
        dialogTitle={t("Add New Link")}
        t={t}
      />
      <Table
        t={t}
        grid_cols="grid-cols-[0.5fr_0.5fr_1fr]"
        columns={[
          { id: "name", header: "name" },
          { id: "link", header: "Link" },
        ]}
      >
        {links.map((link) => (
          <Table.Row key={link.id} grid_cols="grid-cols-[0.5fr_0.5fr_1fr]">
            <Table.Cell className="flex gap-2 items-center">
              {link.lightImage && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${link.lightImage}`}
                  width={40}
                  height={40}
                  alt={""}
                />
              )}{" "}
              {link.name}
            </Table.Cell>
            <Table.Cell>{link.url}</Table.Cell>
            <Table.Cell className="flex gap-2 items-center justify-end">
              <DialogLinks
                t={t}
                link={link}
                trigger={
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer hover:bg-green-primary/80">
                    {t("Edit")}
                  </Button>
                }
                dialogTitle={t("Edit Link")}
              />
              <Button
                disabled={isLoading}
                className={
                  "text-white bg-[#3A469D] hover:bg-[#3A469D]/80 rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                }
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await deleteAppSocialLink(link.id);
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

export default LinksContainer;

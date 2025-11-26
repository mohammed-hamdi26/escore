"use client";
import Table from "@/components/ui app/Table";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";

import LinkForm from "./LinkForm";
import DialogLinks from "./DialogLinks";

function LinksContainer() {
  const t = useTranslations("LinksApp");

  return (
    <div className=" space-y-6 ">
      <DialogLinks t={t} />
      <Table
        t={t}
        grid_cols="grid-cols-[1fr_1fr]"
        columns={[
          { id: "link", header: "Link" },
          { id: "description", header: "Description" },
        ]}
      >
        <Table.Row grid_cols="grid-cols-[1fr_1fr]"></Table.Row>
      </Table>
    </div>
  );
}

export default LinksContainer;

"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LinksContainer from "./LinksContainer";
import LinksForm from "./LinksForm";
import LinksTable from "./LinksTable";
import { useState } from "react";

function LinksPageContainer({
  players,
  teams,
  id,
  links,
  linkType = "players",
}) {
  const t = useTranslations("Links");
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={
              "bg-green-primary text-white cursor-pointer hover:bg-green-primary/70"
            }
          >
            {t("Add new link")}
          </Button>
        </DialogTrigger>
        <DialogContent dir="rtl">
          <DialogTitle>{t("Add new link")}</DialogTitle>
          <LinksForm
            setOpen={setOpen}
            t={t}
            id={id}
            teams={teams}
            players={players}
            linksType={linkType}
          />
        </DialogContent>
      </Dialog>
      <LinksTable
        linksType={linkType}
        links={links}
        numOfLinks={links.length}
        idUser={id}
      />
    </div>
  );
}

export default LinksPageContainer;

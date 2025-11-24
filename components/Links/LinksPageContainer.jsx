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

function LinksPageContainer({
  players,
  teams,
  id,
  links,
  linkType = "player",
}) {
  const t = useTranslations("Links");
  return (
    <div className="space-y-8">
      <Dialog>
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
            t={t}
            id={id}
            teams={teams}
            players={players}
            linksType={linkType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LinksPageContainer;

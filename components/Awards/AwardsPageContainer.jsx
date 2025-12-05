"use client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import AwardsForm from "./AwardsForm";
import { useTranslations } from "next-intl";
import AwardsTable from "./AwardsTable";
import { useState } from "react";

function AwardsPageContainer({
  awardsType = "players",
  players,
  teams,
  tournaments,
  games,
  id,
  awards,
}) {
  const t = useTranslations("Awards");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-8   ">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={
              "bg-green-primary text-white cursor-pointer hover:bg-green-primary/70"
            }
          >
            {t("Add new Award")}
          </Button>
        </DialogTrigger>
        <DialogContent className={" max-h-[80vh] overflow-y-auto"}>
          <DialogTitle>{t("Add new Award")}</DialogTitle>
          <AwardsForm
            id={id}
            tournaments={tournaments}
            teams={teams}
            games={games}
            players={players}
            awardsType={awardsType}
            t={t}
            setOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
      <AwardsTable
        awards={awards}
        awardsType={awardsType}
        games={games}
        idUser={id}
        t={t}
      />
    </div>
  );
}

export default AwardsPageContainer;

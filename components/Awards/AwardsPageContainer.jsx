"use client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import AwardsForm from "./AwardsForm";
import { useTranslations } from "next-intl";

function AwardsPageContainer({
  awardsType = "player",
  players,
  teams,
  tournaments,
  games,
  id,
}) {
  const t = useTranslations("Awards");
  return (
    <div className="space-y-8   ">
      <Dialog>
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AwardsPageContainer;

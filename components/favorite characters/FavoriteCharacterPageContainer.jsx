"use client";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import FavoriteCharacterForm from "./FavoriteCharacterForm";
import { useTranslations } from "next-intl";

function FavoriteCharacterPageContainer({
  id,
  players,
  games,
  linkType = "player",
}) {
  const t = useTranslations("FavoriteCharacter");
  return (
    <div className="space-y-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={
              "bg-green-primary text-white cursor-pointer hover:bg-green-primary/70"
            }
          >
            {t("Add new Favorite Character")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{t("Add new Favorite Character")}</DialogTitle>
          <FavoriteCharacterForm
            t={t}
            games={games}
            id={id}
            players={players}
            linksType={linkType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FavoriteCharacterPageContainer;

"use client";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import FavoriteCharacterForm from "./FavoriteCharacterForm";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FavoriteCharacterTable from "./FavoriteCharacterTable";

function FavoriteCharacterPageContainer({
  id,
  players,
  games,
  favoriteCharacterFor = "players",
  characters,
}) {
  const t = useTranslations("FavoriteCharacter");
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
            favoriteCharacterFor={favoriteCharacterFor}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
      <FavoriteCharacterTable
        t={t}
        favoriteCharacterFor={favoriteCharacterFor}
        characters={characters}
        games={games}
        idUser={id}
      />
    </div>
  );
}

export default FavoriteCharacterPageContainer;

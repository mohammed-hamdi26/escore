"use client";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import FavoriteCharacterForm from "./FavoriteCharacterForm";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FavoriteCharacterTable from "./FavoriteCharacterTable";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Plus, Star, User } from "lucide-react";

function FavoriteCharacterPageContainer({
  id,
  players,
  games,
  favoriteCharacterFor = "players",
  characters,
  playerName,
}) {
  const t = useTranslations("FavoriteCharacter");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-[#677185] dark:hover:text-white"
          >
            <ArrowLeft className="rtl:rotate-180 size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="size-5 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t("title") || "Favorite Characters"}
              </h1>
              {playerName && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="size-3" />
                  {playerName}
                </p>
              )}
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-primary text-white cursor-pointer hover:bg-green-primary/70">
              <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("Add new Favorite Character")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle className="flex items-center gap-2">
              <Star className="size-5 text-yellow-500" />
              {t("Add new Favorite Character")}
            </DialogTitle>
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
      </div>

      {/* Characters Grid */}
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

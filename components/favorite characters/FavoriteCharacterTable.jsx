"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import FavoriteCharacterForm from "./FavoriteCharacterForm";
import { Button } from "../ui/button";
import { deleteFavoriteCharacter } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import {
  Edit,
  Gamepad2,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import { getImgUrl } from "@/lib/utils";
import Image from "next/image";

function FavoriteCharacterTable({
  favoriteCharacterFor,
  characters,
  games,
  idUser,
}) {
  const t = useTranslations("FavoriteCharacter");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editCharacter, setEditCharacter] = useState(null);

  const handleDelete = async (characterId) => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this character?")) {
      return;
    }

    try {
      setIsLoading(true);
      setLoadingId(characterId);
      await deleteFavoriteCharacter(favoriteCharacterFor, idUser, characterId);
      toast.success(t("Character deleted successfully"));
    } catch (e) {
      toast.error(t("Error deleting character"));
    } finally {
      setIsLoading(false);
      setLoadingId(null);
    }
  };

  const handleEdit = (character) => {
    setEditCharacter(character);
    setEditOpen(true);
  };

  if (!characters || characters.length === 0) {
    return (
      <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
        <Star className="size-16 mx-auto mb-4 text-[#677185]" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t("noCharacters") || "No Favorite Characters"}
        </h3>
        <p className="text-muted-foreground">
          {t("noCharactersDescription") || "Add favorite characters to display them here."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Characters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {characters.map((character) => {
          const characterImage = getImgUrl(character.image?.light, "thumbnail") || getImgUrl(character.image?.dark, "thumbnail") || getImgUrl(character.icon, "thumbnail");
          const gameImage = getImgUrl(character.game?.logo?.light, "thumbnail") || getImgUrl(character.game?.logo?.dark, "thumbnail");

          return (
            <div
              key={character.id}
              className="group bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden hover:ring-1 hover:ring-green-primary/30 transition-all"
            >
              {/* Character Image */}
              <div className="relative aspect-square bg-gradient-to-br from-[#1a1f2e] to-[#0F1017]">
                {characterImage ? (
                  <Image
                    src={characterImage}
                    alt={character.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="size-16 text-[#677185]" />
                  </div>
                )}

                {/* Game Badge */}
                {character.game && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                      {gameImage ? (
                        <Image
                          src={gameImage}
                          alt={character.game.name}
                          width={16}
                          height={16}
                          className="size-4 rounded object-cover"
                        />
                      ) : (
                        <Gamepad2 className="size-4 text-white" />
                      )}
                      <span className="text-xs text-white font-medium">
                        {character.game.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white size-8"
                        disabled={isLoading && loadingId === character.id}
                      >
                        {isLoading && loadingId === character.id ? (
                          <Spinner className="size-4" />
                        ) : (
                          <MoreVertical className="size-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleEdit(character)}
                      >
                        <Edit className="size-4 mr-2" />
                        {t("Edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-400 focus:text-red-400"
                        onClick={() => handleDelete(character.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="size-4 mr-2" />
                        {t("Delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Character Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-lg truncate">
                  {character.name}
                </h3>
                {character.game && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Gamepad2 className="size-3" />
                    {character.game.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="flex items-center gap-2">
            <Edit className="size-5 text-green-primary" />
            {t("Edit Favorite Character")}
          </DialogTitle>
          {editCharacter && (
            <FavoriteCharacterForm
              character={editCharacter}
              id={idUser}
              t={t}
              setOpen={setEditOpen}
              favoriteCharacterFor={favoriteCharacterFor}
              games={games}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FavoriteCharacterTable;

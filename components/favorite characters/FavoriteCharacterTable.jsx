import { useState } from "react";
import Table from "../ui app/Table";
import { useTranslations } from "next-intl";
import EditDialog from "../Links/EditDialog";
import FavoriteCharacterForm from "./FavoriteCharacterForm";
import { Button } from "../ui/button";
import { deleteFavoriteCharacter } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function FavoriteCharacterTable({
  favoriteCharacterFor,
  characters,
  games,
  idUser,
  setOpen,
}) {
  const t = useTranslations("FavoriteCharacter");
  const columns = [
    { id: "name", header: t("Name") },
    // { id: "character", header: t("Character") },
  ];
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Table columns={columns} grid_cols={"grid-cols-[0.5fr_2fr]"}>
        {characters.map((character) => (
          <Table.Row grid_cols={"grid-cols-[0.5fr_2fr]"} key={character.id}>
            <Table.Cell>{character.name}</Table.Cell>
            {/* <Table.Cell>{award.description}</Table.Cell> */}
            <Table.Cell className="flex gap-4 justify-end">
              <EditDialog
                idUser={idUser}
                title={t("Edit Favorite Character")}
                t={t}
                trigger={
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    {t("Edit")}
                  </Button>
                }
                contentDialog={
                  <FavoriteCharacterForm
                    character={character}
                    id={idUser}
                    t={t}
                    setOpen={setOpen}
                    favoriteCharacterFor={favoriteCharacterFor}
                    games={games}
                  />
                }
              />
              <Button
                disabled={isLoading}
                className={
                  "text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                }
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await deleteFavoriteCharacter(
                      favoriteCharacterFor,
                      idUser,
                      character.id
                    );
                    toast.success(t("Character deleted successfully"));
                  } catch (e) {
                    toast.error(t("Error deleting character"));
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

export default FavoriteCharacterTable;

import { updateGame } from "@/app/[locale]/_Lib/actions";
import { getGame } from "@/app/[locale]/_Lib/gamesApi";
import GamesForm from "@/components/games-management/GamesForm";

async function EditGamePage({ params }) {
  const { id } = await params;
  const game = await getGame(id);

  return (
    <GamesForm
      data={game}
      typeForm="edit"
      submitFunction={updateGame}
    />
  );
}

export default EditGamePage;

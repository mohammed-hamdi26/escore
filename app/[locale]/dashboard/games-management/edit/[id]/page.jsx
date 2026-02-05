import { updateGame } from "@/app/[locale]/_Lib/actions";
import { getGame } from "@/app/[locale]/_Lib/gamesApi";
import GamesForm from "@/components/games-management/GamesForm";
import { GameEditWrapper } from "@/components/games-management/GameFormWrapper";

async function EditGamePage({ params }) {
  const { id } = await params;
  const game = await getGame(id);

  return (
    <GameEditWrapper>
      <GamesForm
        data={game}
        typeForm="edit"
        submitFunction={updateGame}
      />
    </GameEditWrapper>
  );
}

export default EditGamePage;

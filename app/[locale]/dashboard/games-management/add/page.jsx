import { addGame } from "@/app/[locale]/_Lib/actions";
import GamesForm from "@/components/games-management/GamesForm";
import { GameAddWrapper } from "@/components/games-management/GameFormWrapper";

function AddGamePage() {
  return (
    <GameAddWrapper>
      <GamesForm submitFunction={addGame} typeForm="add" />
    </GameAddWrapper>
  );
}

export default AddGamePage;

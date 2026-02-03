import { addGame } from "@/app/[locale]/_Lib/actions";
import GamesForm from "@/components/games-management/GamesForm";

function AddGamePage() {
  return <GamesForm submitFunction={addGame} typeForm="add" />;
}

export default AddGamePage;

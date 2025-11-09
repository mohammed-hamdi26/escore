import { addGame } from "@/app/[locale]/_Lib/actions";
import GamesForm from "@/components/games-management/GamesForm";

function page() {
  return <GamesForm submitFunction={addGame} />;
}

export default page;

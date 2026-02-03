import { getGame } from "@/app/[locale]/_Lib/gamesApi";
import GamesDetails from "@/components/games-management/GamesDetails";

async function GameViewPage({ params }) {
  const { id } = await params;
  const game = await getGame(id);

  return <GamesDetails game={game} />;
}

export default GameViewPage;

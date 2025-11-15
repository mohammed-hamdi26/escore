import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import FavoriteCharacterPageContainer from "@/components/favorite characters/FavoriteCharacterPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players, games] = await Promise.all([getPlayers(), getGames()]);
  return (
    <FavoriteCharacterPageContainer games={games} id={id} players={players} />
  );
}

export default page;

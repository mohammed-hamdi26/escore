import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import {
  getPlayers,
  getPlayersFavoriteCharacters,
} from "@/app/[locale]/_Lib/palyerApi";
import FavoriteCharacterPageContainer from "@/components/favorite characters/FavoriteCharacterPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players, games, characters] = await Promise.all([
    getPlayers(),
    getGames(),
    getPlayersFavoriteCharacters(id),
  ]);
  return (
    <FavoriteCharacterPageContainer
      favoriteCharacterFor="players"
      games={games}
      id={id}
      players={players}
      characters={characters}
    />
  );
}

export default page;

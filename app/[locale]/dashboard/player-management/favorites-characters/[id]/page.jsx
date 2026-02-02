import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import {
  getPlayer,
  getPlayers,
  getPlayersFavoriteCharacters,
} from "@/app/[locale]/_Lib/palyerApi";
import FavoriteCharacterPageContainer from "@/components/favorite characters/FavoriteCharacterPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [player, players, games, characters] = await Promise.all([
    getPlayer(id),
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
      playerName={player?.nickname || player?.firstName}
    />
  );
}

export default page;

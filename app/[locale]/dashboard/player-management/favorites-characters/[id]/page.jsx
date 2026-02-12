import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import {
  getPlayer,
  getPlayers,
  getPlayersFavoriteCharacters,
} from "@/app/[locale]/_Lib/palyerApi";
import FavoriteCharacterPageContainer from "@/components/favorite characters/FavoriteCharacterPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [player, playersResult, gamesResult, characters] = await Promise.all([
    getPlayer(id),
    getPlayers(),
    getGames({ limit: 100 }),
    getPlayersFavoriteCharacters(id),
  ]);
  return (
    <FavoriteCharacterPageContainer
      favoriteCharacterFor="players"
      games={gamesResult?.data || []}
      id={id}
      players={playersResult?.data || []}
      characters={characters}
      playerName={player?.nickname || player?.firstName}
    />
  );
}

export default page;

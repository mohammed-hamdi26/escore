import { addNews } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getMatches } from "@/app/[locale]/_Lib/matchesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import NewsForm from "@/components/News/NewsForm";

async function page() {
  const [
    playersOptions,
    teamsOptions,
    { data: tournamentsOptions },
    gamesOptions,
    matchesOptions,
  ] = await Promise.all([
    getPlayers(),
    getTeams(),
    getTournaments(),
    getGames(),
    getMatches(),
  ]);

  return (
    <NewsForm
      options={{
        playersOptions,
        teamsOptions,
        tournamentsOptions,
        gamesOptions,
        matchesOptions,
      }}
      submit={addNews}
    />
  );
}

export default page;

import { addNews } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import NewsForm from "@/components/News/NewsForm";

async function page() {
  const [playersOptions, teamsOptions, tournamentsOptions, gamesOptions] =
    await Promise.all([getPlayers(), getTeams(), getTournaments(), getGames()]);

  return (
    <NewsForm
      options={{
        playersOptions,
        teamsOptions,
        tournamentsOptions,
        gamesOptions,
      }}
      submit={addNews}
    />
  );
}

export default page;

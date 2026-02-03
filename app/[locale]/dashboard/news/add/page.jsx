import { addNews } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getMatches } from "@/app/[locale]/_Lib/matchesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import NewsFormRedesign from "@/components/News/NewsFormRedesign";
import { getLocale } from "next-intl/server";

async function page() {
  const locale = await getLocale();

  const [
    { data: playersOptions },
    { data: teamsOptions },
    { data: tournamentsOptions },
    { data: gamesOptions },
    { data: matchesOptions },
  ] = await Promise.all([
    getPlayers(),
    getTeams(),
    getTournaments(),
    getGames(),
    getMatches(),
  ]);

  return (
    <NewsFormRedesign
      options={{
        playersOptions,
        teamsOptions,
        tournamentsOptions,
        gamesOptions,
        matchesOptions,
      }}
      submit={addNews}
      locale={locale}
    />
  );
}

export default page;

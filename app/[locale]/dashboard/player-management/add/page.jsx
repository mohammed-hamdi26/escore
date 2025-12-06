import { addPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
// import { getPlayer } from "@/app/_Lib/palyerApi";
import PlayerFrom from "@/components/Player Management/PlayerFrom";

async function page() {
  const [
    countries,
    { data: newsOptions },
    { data: teamsOptions },
    gamesOptions,
    { data: tournamentsOptions },
  ] = await Promise.all([
    getCountries(),
    getNews(),
    getTeams(),
    getGames(),
    getTournaments(),
  ]);

  // console.log(countries.countries);
  return (
    <PlayerFrom
      OptionsData={{
        newsOptions,
        teamsOptions,
        gamesOptions,
        tournamentsOptions,
      }}
      submit={addPlayer}
      countries={countries.countries || []}
      successMessage="Player added"
    />
  );
}

export default page;

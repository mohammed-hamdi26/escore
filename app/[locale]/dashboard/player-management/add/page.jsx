import { addPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
// import { getPlayer } from "@/app/_Lib/palyerApi";
import PlayerFrom from "@/components/Player Management/PlayerFrom";

async function page() {
  const [countries, newsOptions, teamsOptions, gamesOptions] =
    await Promise.all([getCountries(), getNews(), getTeams(), getGames()]);

  return (
    <PlayerFrom
      OptionsData={{ newsOptions, teamsOptions, gamesOptions }}
      submit={addPlayer}
      countries={countries}
      successMessage="Player added"
    />
  );
}

export default page;

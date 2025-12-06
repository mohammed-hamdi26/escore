import { editPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getPlayer } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import PlayerFrom from "@/components/Player Management/PlayerFrom";

async function page({ params }) {
  const id = await params.id;
  const [
    countries,
    player,
    { data: newsOptions },
    { data: teamsOptions },
    gamesOptions,
    { data: tournamentsOptions },
  ] = await Promise.all([
    getCountries(),
    getPlayer(id),
    getNews(),
    getTeams(),
    getGames(),
    getTournaments(),
  ]);

  return (
    <PlayerFrom
      OptionsData={{
        newsOptions,
        teamsOptions,
        gamesOptions,
        tournamentsOptions,
      }}
      submit={editPlayer}
      countries={countries.countries}
      player={player}
      formType="edit"
      successMessage="Player updated"
    />
  );
}

export default page;

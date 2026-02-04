import { addPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import PlayerFormRedesign from "@/components/Player Management/PlayerFormRedesign";

async function page() {
  const [
    countries,
    { data: teamsOptions },
    { data: gamesOptions },
    { data: tournamentsOptions },
  ] = await Promise.all([
    getCountries(),
    getTeams(),
    getGames(),
    getTournaments({ size: 100 }),
  ]);

  return (
    <PlayerFormRedesign
      OptionsData={{
        teamsOptions: teamsOptions || [],
        gamesOptions: gamesOptions || [],
        tournamentsOptions: tournamentsOptions || [],
      }}
      submit={addPlayer}
      countries={countries.countries || []}
      formType="add"
    />
  );
}

export default page;

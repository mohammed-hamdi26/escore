import { addPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import PlayerFormRedesign from "@/components/Player Management/PlayerFormRedesign";

async function page() {
  const [
    countries,
    { data: teamsOptions },
    gamesOptions,
  ] = await Promise.all([
    getCountries(),
    getTeams(),
    getGames(),
  ]);

  return (
    <PlayerFormRedesign
      OptionsData={{
        teamsOptions: teamsOptions || [],
        gamesOptions: gamesOptions || [],
      }}
      submit={addPlayer}
      countries={countries.countries || []}
      formType="add"
    />
  );
}

export default page;

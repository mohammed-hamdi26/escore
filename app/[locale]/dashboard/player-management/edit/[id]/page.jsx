import { editPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayer } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import PlayerFormRedesign from "@/components/Player Management/PlayerFormRedesign";

async function page({ params }) {
  const id = await params.id;
  const [
    countries,
    player,
    { data: teamsOptions },
    gamesOptions,
  ] = await Promise.all([
    getCountries(),
    getPlayer(id),
    getTeams(),
    getGames(),
  ]);

  return (
    <PlayerFormRedesign
      OptionsData={{
        teamsOptions: teamsOptions || [],
        gamesOptions: gamesOptions || [],
      }}
      submit={editPlayer}
      countries={countries.countries || []}
      player={player}
      formType="edit"
    />
  );
}

export default page;

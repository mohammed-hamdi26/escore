import { editPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayer } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import PlayerFormRedesign from "@/components/Player Management/PlayerFormRedesign";

async function page({ params }) {
  const { id } = await params;
  const [countries, player, { data: teamsOptions }, { data: gamesOptions }, { data: tournamentsOptions }] =
    await Promise.all([
      getCountries(),
      getPlayer(id),
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
      submit={editPlayer}
      countries={countries.countries || []}
      player={player}
      formType="edit"
    />
  );
}

export default page;

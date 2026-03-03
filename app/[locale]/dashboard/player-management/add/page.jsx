import { addPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getClubs } from "@/app/[locale]/_Lib/clubsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import PlayerFormRedesign from "@/components/Player Management/PlayerFormRedesign";
import { PlayerAddWrapper } from "@/components/Player Management/PlayerFormWrapper";

async function page() {
  const [
    countries,
    { data: clubsOptions },
    { data: gamesOptions },
    { data: tournamentsOptions },
  ] = await Promise.all([
    getCountries(),
    getClubs(),
    getGames({ limit: 100 }),
    getTournaments({ size: 100 }),
  ]);

  return (
    <PlayerAddWrapper>
      <PlayerFormRedesign
        OptionsData={{
          clubsOptions: clubsOptions || [],
          gamesOptions: gamesOptions || [],
          tournamentsOptions: tournamentsOptions || [],
        }}
        submit={addPlayer}
        countries={countries.countries || []}
        formType="add"
      />
    </PlayerAddWrapper>
  );
}

export default page;

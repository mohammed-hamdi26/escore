import { addTeam } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TeamForm from "@/components/teams management/TeamForm";

async function page() {
  const [countries, newsOptions, playersOptions, gamesOptions] =
    await Promise.all([getCountries(), getNews(), getPlayers(), getGames()]);
  return (
    <TeamForm
      submit={addTeam}
      countries={countries}
      OptionsData={{
        newsOptions,
        playersOptions,
        gamesOptions,
      }}
      successMessage="Team added successfully"
    />
  );
}

export default page;

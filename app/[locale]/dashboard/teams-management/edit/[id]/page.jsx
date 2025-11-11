import { updateTeam } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeam } from "@/app/[locale]/_Lib/teamsApi";
import TeamForm from "@/components/teams management/TeamForm";

export default async function page({ params }) {
  const { id } = await params;

  const [countries, newsOptions, playersOptions, gamesOptions, team] =
    await Promise.all([
      getCountries(),
      getNews(),
      getPlayers(),
      getGames(),
      getTeam(id),
    ]);
  return (
    <TeamForm
      submit={updateTeam}
      countries={countries}
      team={team}
      OptionsData={{ newsOptions, playersOptions, gamesOptions }}
      successMessage="Team updated"
      formType="edit"
    />
  );
}

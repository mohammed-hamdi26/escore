import { updateMatch } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getMatch } from "@/app/[locale]/_Lib/matchesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import MatchesFrom from "@/components/Matches Management/MatchesFrom";

async function page({ params }) {
  const { id } = await params;
  const [match, teamsOptions, gamesOptions, tournamentsOptions] =
    await Promise.all([getMatch(id), getTeams(), getGames(), getTournaments()]);

  console.log(match);
  return (
    <MatchesFrom
      gamesOptions={gamesOptions}
      teamsOptions={teamsOptions}
      match={match}
      formType="edit"
      tournamentsOptions={tournamentsOptions}
      submit={updateMatch}
    />
  );
}

export default page;

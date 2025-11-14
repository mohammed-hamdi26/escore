import { addMatch, addTournament } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import MatchesFrom from "@/components/Matches Management/MatchesFrom";

async function page() {
  const [teamsOptions, gamesOptions, tournamentsOptions] = await Promise.all([
    getTeams(),
    getGames(),
    getTournaments(),
  ]);
  return (
    <MatchesFrom
      submit={addMatch}
      gamesOptions={gamesOptions}
      teamsOptions={teamsOptions}
      tournamentsOptions={tournamentsOptions}
    />
  );
}

export default page;

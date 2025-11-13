import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import MatchesFrom from "@/components/Matches Management/MatchesFrom";

async function page() {
  const [teamsOptions, gamesOptions] = await Promise.all([
    getTeams(),
    getGames(),
  ]);
  return (
    <MatchesFrom gamesOptions={gamesOptions} teamsOptions={teamsOptions} />
  );
}

export default page;

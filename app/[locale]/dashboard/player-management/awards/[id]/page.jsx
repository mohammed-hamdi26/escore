import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import AwardsPageContainer from "@/components/Awards/AwardsPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players, teams, games, tournaments] = await Promise.all([
    getPlayers(),
    getTeams(),
    getGames(),
    getTournaments(),
  ]);
  return (
    <AwardsPageContainer
      teams={teams}
      tournaments={tournaments}
      games={games}
      players={players}
      id={id}
    />
  );
}

export default page;

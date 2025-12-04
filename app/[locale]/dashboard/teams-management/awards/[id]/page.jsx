import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getAwardsTeam, getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import AwardsPageContainer from "@/components/Awards/AwardsPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [teams, games, tournaments, players, awards] = await Promise.all([
    getTeams(),
    getGames(),
    getTournaments(),
    getPlayers(),
    getAwardsTeam(id),
  ]);

  return (
    <AwardsPageContainer
      awardsType="team"
      games={games}
      id={id}
      teams={teams}
      tournaments={tournaments}
      players={players}
      awards={awards}
    />
  );
}

export default page;

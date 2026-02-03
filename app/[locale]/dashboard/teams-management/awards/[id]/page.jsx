import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getAwardsTeam, getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import AwardsPageContainer from "@/components/Awards/AwardsPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [teamsResult, gamesResult, tournamentsResult, playersResult, awards] = await Promise.all([
    getTeams(),
    getGames(),
    getTournaments(),
    getPlayers(),
    getAwardsTeam(id),
  ]);

  // Extract data arrays from API responses
  const teams = teamsResult?.data || [];
  const games = gamesResult?.data || [];
  const tournaments = tournamentsResult?.data || [];
  const players = playersResult?.data || [];

  return (
    <AwardsPageContainer
      awardsType="teams"
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

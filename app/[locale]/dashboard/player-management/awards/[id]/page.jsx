import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayer, getPlayersAwards } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import AwardsPageContainer from "@/components/Awards/AwardsPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [player, teamsResult, gamesResult, tournamentsResult, awards] = await Promise.all([
    getPlayer(id),
    getTeams(),
    getGames({ limit: 100 }),
    getTournaments(),
    getPlayersAwards(id),
  ]);

  // Extract data arrays from API responses
  const teams = teamsResult?.data || [];
  const games = gamesResult?.data || [];
  const tournaments = tournamentsResult?.data || [];

  // Get player name for header
  const playerName = player?.nickname || player?.firstName
    ? `${player?.firstName || ""} ${player?.lastName || ""}`.trim() || player?.nickname
    : null;

  return (
    <AwardsPageContainer
      awards={awards}
      teams={teams}
      tournaments={tournaments}
      games={games}
      id={id}
      playerName={playerName}
    />
  );
}

export default page;

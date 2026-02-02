import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import PlayerListRedesign from "@/components/Player Management/PlayerListRedesign";

async function PlayersPage({ searchParams }) {
  const { size, page, search, game, team, country, isFreeAgent, sortBy, sortOrder } = await searchParams;

  // Fetch players, games, and teams in parallel
  const [playersResult, games, teamsResult] = await Promise.all([
    getPlayers({
      size,
      page,
      search,
      game,
      team,
      country,
      isFreeAgent,
      sortBy,
      sortOrder,
    }),
    getGames({ limit: 100 }),
    getTeams({ limit: 100 }),
  ]);

  const { data: players, pagination } = playersResult;
  const teams = teamsResult?.data || teamsResult || [];

  return (
    <PlayerListRedesign
      players={players || []}
      pagination={pagination}
      games={games || []}
      teams={teams}
    />
  );
}

export default PlayersPage;

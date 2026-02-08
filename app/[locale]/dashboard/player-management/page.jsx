import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import PlayerListRedesign from "@/components/Player Management/PlayerListRedesign";
import { PlayerListWrapper } from "@/components/Player Management/PlayerFormWrapper";

async function PlayersPage({ searchParams }) {
  const { size, page, search, game, team, country, isFreeAgent, sortBy, sortOrder } = await searchParams;

  // Fetch players, games, and teams in parallel
  const [playersResult, gamesResult, teamsResult] = await Promise.all([
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
    getTeams({ limit: 100 }).catch(() => ({ data: [], pagination: {} })),
  ]);

  const { data: players, pagination } = playersResult;
  const games = Array.isArray(gamesResult?.data) ? gamesResult.data : Array.isArray(gamesResult) ? gamesResult : [];
  const teams = Array.isArray(teamsResult?.data) ? teamsResult.data : Array.isArray(teamsResult) ? teamsResult : [];

  return (
    <PlayerListWrapper>
      <PlayerListRedesign
        players={players || []}
        pagination={pagination}
        games={games || []}
        teams={teams}
      />
    </PlayerListWrapper>
  );
}

export default PlayersPage;

import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import GamesListRedesign from "@/components/games-management/GamesListRedesign";
import { GameListWrapper } from "@/components/games-management/GameFormWrapper";

async function GamesPage({ searchParams }) {
  const params = await searchParams;

  const { data: games, pagination } = await getGames({
    size: params.size,
    page: params.page,
    search: params.search,
    isActive: params.isActive,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return (
    <GameListWrapper>
      <GamesListRedesign
        games={games || []}
        pagination={pagination}
      />
    </GameListWrapper>
  );
}

export default GamesPage;

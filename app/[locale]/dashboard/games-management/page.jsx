import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import GamesListRedesign from "@/components/games-management/GamesListRedesign";

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
    <GamesListRedesign
      games={games || []}
      pagination={pagination}
    />
  );
}

export default GamesPage;

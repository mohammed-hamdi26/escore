import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import GamesTable from "@/components/games-management/GamesTable";

async function GamesPage({ searchParams }) {
  const { size, page, search, isActive, sortBy, sortOrder } = await searchParams;

  const { data: games, pagination } = await getGames({
    size,
    page,
    search,
    isActive,
    sortBy,
    sortOrder,
  });

  return (
    <GamesTable
      games={games || []}
      pagination={pagination}
    />
  );
}

export default GamesPage;

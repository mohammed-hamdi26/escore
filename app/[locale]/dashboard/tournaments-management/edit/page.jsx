import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import TournamentsTable from "@/components/Tournaments Management/TournamentsTable";

async function TournamentsEditPage({ searchParams }) {
  const { size, page, search, game, status, tier, isFeatured, sortBy, sortOrder } = await searchParams;

  // Fetch tournaments and games in parallel
  const [tournamentsResult, games] = await Promise.all([
    getTournaments({
      size,
      page,
      search,
      game,
      status,
      tier,
      isFeatured,
      sortBy,
      sortOrder,
    }),
    getGames({ limit: 100 }),
  ]);

  const { data: tournaments, pagination } = tournamentsResult;

  return (
    <TournamentsTable
      tournaments={tournaments || []}
      pagination={pagination}
      games={games || []}
    />
  );
}

export default TournamentsEditPage;

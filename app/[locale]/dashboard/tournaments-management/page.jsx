import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import TournamentsTable from "@/components/Tournaments Management/TournamentsTable";
import { TournamentListWrapper } from "@/components/tournaments/TournamentFormWrapper";

async function TournamentsPage({ searchParams }) {
  const { size, page, search, game, status, tier, competitionType, isFeatured, sortBy, sortOrder } = await searchParams;

  // Fetch tournaments and games in parallel
  const [tournamentsResult, gamesResult] = await Promise.all([
    getTournaments({
      size,
      page,
      search,
      game,
      status,
      tier,
      competitionType,
      isFeatured,
      sortBy,
      sortOrder,
    }),
    getGames({ limit: 100 }),
  ]);

  const { data: tournaments, pagination } = tournamentsResult;

  return (
    <TournamentListWrapper>
      <TournamentsTable
        tournaments={tournaments || []}
        pagination={pagination}
        games={gamesResult?.data || []}
      />
    </TournamentListWrapper>
  );
}

export default TournamentsPage;

import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import TeamsListRedesign from "@/components/teams management/TeamsListRedesign";

async function TeamsPage({ searchParams }) {
  const { size, page, search, game, country, region, isActive, sortBy, sortOrder } = await searchParams;

  // Fetch teams, games, and countries in parallel
  const [teamsResult, games, countriesResult] = await Promise.all([
    getTeams({
      size,
      page,
      search,
      game,
      country,
      region,
      isActive,
      sortBy,
      sortOrder,
    }),
    getGames({ limit: 100 }),
    getCountries(),
  ]);

  const { data: teams, pagination } = teamsResult;
  const countries = countriesResult?.countries || [];

  return (
    <TeamsListRedesign
      teams={teams || []}
      pagination={pagination}
      games={games || []}
      countries={countries}
    />
  );
}

export default TeamsPage;

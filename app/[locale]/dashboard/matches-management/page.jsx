import { getMatches } from "@/app/[locale]/_Lib/matchesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import MatchesListRedesign from "@/components/Matches Management/MatchesListRedesign";
import MatchesFilterRedesign from "@/components/Matches Management/MatchesFilterRedesign";
import MatchesHeader from "@/components/Matches Management/MatchesHeader";
import { getTranslations } from "next-intl/server";

export default async function MatchesPage({ searchParams }) {
  const {
    size = "12",
    page = "1",
    search,
    game,
    tournament,
    team,
    status,
    isFeatured,
    isOnline,
    date,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  } = await searchParams;

  const t = await getTranslations("MatchesList");

  const [matchesResult, gamesResult, tournamentsResult, teamsResult] = await Promise.all([
    getMatches({
      size,
      page,
      search,
      game,
      tournament,
      team,
      status,
      isFeatured,
      isOnline,
      date,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    }),
    getGames({ limit: 100 }),
    getTournaments({ size: 100 }),
    getTeams({ size: 100 }),
  ]);

  const matches = matchesResult?.data || [];
  const pagination = matchesResult?.pagination || { totalPages: 1, total: 0 };
  // getGames returns array directly, not { data: [...] }
  const games = Array.isArray(gamesResult) ? gamesResult : (gamesResult?.data || []);
  const tournaments = tournamentsResult?.data || [];
  const teams = teamsResult?.data || [];

  return (
    <div className="space-y-6">
      <MatchesHeader matchesCount={pagination.total} />
      <MatchesFilterRedesign games={games} tournaments={tournaments} teams={teams} />
      <MatchesListRedesign
        matches={matches}
        pagination={pagination}
        games={games}
        tournaments={tournaments}
      />
    </div>
  );
}

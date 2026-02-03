import { getMatch } from "@/app/[locale]/_Lib/matchesApi";
import { getTournamentStandings, getGroupedStandings } from "@/app/[locale]/_Lib/standingsApi";
import MatchDetails from "@/components/Matches Management/MatchDetails";
import BackPage from "@/components/ui app/BackPage";
import { getTranslations } from "next-intl/server";

export default async function MatchViewPage({ params }) {
  const { id } = await params;
  const t = await getTranslations("MatchDetails");

  const match = await getMatch(id);

  // Fetch standings for the match's tournament if it exists
  let standings = [];
  let groupedStandings = {};

  if (match?.tournament?.id || match?.tournament?._id) {
    const tournamentId = match.tournament.id || match.tournament._id;
    [standings, groupedStandings] = await Promise.all([
      getTournamentStandings(tournamentId),
      getGroupedStandings(tournamentId),
    ]);
  }

  return (
    <div className="space-y-6">
      <BackPage title={t("title")} />
      <MatchDetails
        match={match}
        standings={standings}
        groupedStandings={groupedStandings}
      />
    </div>
  );
}

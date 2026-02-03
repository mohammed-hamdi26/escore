import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTournamentStandings, getGroupedStandings } from "@/app/[locale]/_Lib/standingsApi";
import TournamentDetails from "@/components/Tournaments Management/TournamentDetails";

async function page({ params }) {
  const { id } = await params;

  // Fetch tournament and standings in parallel
  const [tournament, standings, groupedStandings] = await Promise.all([
    getTournament(id),
    getTournamentStandings(id),
    getGroupedStandings(id),
  ]);

  return (
    <TournamentDetails
      tournament={tournament}
      standings={standings}
      groupedStandings={groupedStandings}
    />
  );
}

export default page;

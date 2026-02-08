import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTournamentStandings } from "@/app/[locale]/_Lib/standingsApi";
import StandingsManagement from "@/components/Tournaments Management/StandingsManagement";

async function page({ params }) {
  const { id } = await params;

  const [tournament, standings] = await Promise.all([
    getTournament(id),
    getTournamentStandings(id),
  ]);

  return (
    <StandingsManagement tournament={tournament} initialStandings={standings} />
  );
}

export default page;

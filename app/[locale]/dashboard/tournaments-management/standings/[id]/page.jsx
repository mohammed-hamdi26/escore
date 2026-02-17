import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTournamentStandings } from "@/app/[locale]/_Lib/standingsApi";
import StandingsManagement from "@/components/Tournaments Management/StandingsManagement";
import { StandingsWrapper } from "@/components/Tournaments Management/StandingsWrapper";

async function page({ params }) {
  const { id } = await params;

  const [tournament, standings] = await Promise.all([
    getTournament(id),
    getTournamentStandings(id),
  ]);

  return (
    <StandingsWrapper>
      <StandingsManagement tournament={tournament} initialStandings={standings} />
    </StandingsWrapper>
  );
}

export default page;

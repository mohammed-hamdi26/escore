import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentDetails from "@/components/Tournaments Management/TournamentDetails";

async function page({ params }) {
  const { id } = await params;
  const tournament = await getTournament(id);

  return <TournamentDetails tournament={tournament} />;
}

export default page;

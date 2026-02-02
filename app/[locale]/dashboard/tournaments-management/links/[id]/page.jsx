import { getTournament, getTournamentLinks } from "@/app/[locale]/_Lib/tournamentsApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [tournament, links] = await Promise.all([
    getTournament(id),
    getTournamentLinks(id),
  ]);

  // Get tournament name for header
  const tournamentName = tournament?.name || null;

  return (
    <LinksPageContainer
      links={links}
      id={id}
      linkType="tournaments"
      playerName={tournamentName}
    />
  );
}

export default page;

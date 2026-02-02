import { getTeam, getTeams, getTeamsLinks } from "@/app/[locale]/_Lib/teamsApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [team, teams, links] = await Promise.all([
    getTeam(id),
    getTeams(),
    getTeamsLinks(id),
  ]);

  // Get team name for header
  const teamName = team?.name || null;

  return (
    <LinksPageContainer
      links={links}
      linkType="teams"
      teams={teams}
      id={id}
      playerName={teamName}
    />
  );
}

export default page;

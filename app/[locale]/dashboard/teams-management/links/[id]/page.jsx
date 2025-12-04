import { getTeams, getTeamsLinks } from "@/app/[locale]/_Lib/teamsApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [teams, links] = await Promise.all([getTeams(), getTeamsLinks(id)]);

  return (
    <LinksPageContainer links={links} linkType="teams" teams={teams} id={id} />
  );
}

export default page;

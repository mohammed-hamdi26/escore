import { getTeam } from "@/app/[locale]/_Lib/teamsApi";
import TeamDetails from "@/components/teams management/TeamDetails";

async function page({ params }) {
  const { id } = await params;
  const team = await getTeam(id);

  return <TeamDetails team={team} />;
}

export default page;

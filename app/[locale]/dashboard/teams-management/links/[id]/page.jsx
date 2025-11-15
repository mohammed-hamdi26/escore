import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [teams] = await Promise.all([getTeams()]);
  console.log(teams);

  return <LinksPageContainer linkType="team" teams={teams} id={id} />;
}

export default page;

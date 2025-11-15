import { getLinks } from "@/app/[locale]/_Lib/linksApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players, links] = await Promise.all([getPlayers(), getLinks(id)]);
  return <LinksPageContainer links={links} players={players} id={id} />;
}

export default page;

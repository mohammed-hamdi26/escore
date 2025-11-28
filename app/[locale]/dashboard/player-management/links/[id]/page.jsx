import { getLinks } from "@/app/[locale]/_Lib/linksApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players, links] = await Promise.all([
    getPlayers(),
    getLinks({ "playerId.equals": id }),
  ]);

  return <LinksPageContainer players={players} links={links} id={id} />;
}

export default page;

import { getPlayers, getPlayersLinks } from "@/app/[locale]/_Lib/palyerApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players, links] = await Promise.all([
    getPlayers(),
    getPlayersLinks(id),
  ]);

  return <LinksPageContainer players={players} links={links} id={id} />;
}

export default page;

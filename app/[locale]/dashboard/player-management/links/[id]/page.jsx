import { getLinks } from "@/app/[locale]/_Lib/linksApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [players] = await Promise.all([getPlayers()]);
  return <LinksPageContainer players={players} id={id} />;
}

export default page;

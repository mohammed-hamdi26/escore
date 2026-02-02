import { getPlayer } from "@/app/[locale]/_Lib/palyerApi";
import PlayerDetails from "@/components/Player Management/PlayerDetails";

async function page({ params }) {
  const { id } = await params;
  const player = await getPlayer(id);

  return <PlayerDetails player={player} />;
}

export default page;

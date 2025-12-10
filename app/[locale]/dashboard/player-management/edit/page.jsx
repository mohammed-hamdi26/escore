import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import PlayerListRedesign from "@/components/Player Management/PlayerListRedesign";

async function page({ searchParams }) {
  const { search, size, page } = await searchParams;

  const { data: players, pagination } = await getPlayers({
    search,
    size,
    page,
  });
  console.log(players);

  return <PlayerListRedesign players={players || []} pagination={pagination} />;
}

export default page;

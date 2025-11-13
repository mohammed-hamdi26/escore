import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import GamesTable from "@/components/games-management/GamesTable";

const columns = [
  { id: "game", header: "Game" },
  { id: "description", header: "Description" },
];

async function page() {
  const games = await getGames();

  return <GamesTable games={games} columns={columns} />;
}
//
export default page;

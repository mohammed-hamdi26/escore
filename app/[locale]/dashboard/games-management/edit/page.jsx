import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import GamesTable from "@/components/games-management/GamesTable";

const columns = [
  { id: "game", header: "Game" },
  { id: "description", header: "Description" },
];

async function page({ searchParams }) {
  const { size, page } = await searchParams;
  console.log(size);
  const games = await getGames({ size, page });

  return <GamesTable games={games} columns={columns} />;
}
//
export default page;

import { getGames, getGamesCount } from "@/app/[locale]/_Lib/gamesApi";
import GamesTable from "@/components/games-management/GamesTable";

const columns = [
  { id: "game", header: "Game" },
  { id: "description", header: "Description" },
];

async function page({ searchParams }) {
  const { size, page, search } = await searchParams;
  console.log(size);
  const games = await getGames({ size, page, "name.contains": search || "" });
  const numOfGames = await getGamesCount();

  return <GamesTable games={games} columns={columns} numOfGames={numOfGames} />;
}
//
export default page;

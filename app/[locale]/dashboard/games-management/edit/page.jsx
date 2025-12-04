import { getGames, getGamesCount } from "@/app/[locale]/_Lib/gamesApi";
import GamesTable from "@/components/games-management/GamesTable";

const columns = [
  { id: "game", header: "Game" },
  { id: "description", header: "Description" },
];

async function page({ searchParams }) {
  const { size, page, search } = await searchParams;

  const games = await getGames();
  // const numOfGames = await getGamesCount();

  return <GamesTable games={games} columns={columns} />;
}
//
export default page;

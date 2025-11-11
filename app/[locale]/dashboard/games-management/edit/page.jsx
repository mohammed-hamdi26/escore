import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { id } from "date-fns/locale";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const columns = [
  { id: "game", header: "Game" },
  { id: "description", header: "Description" },
];

async function page() {
  // const data = await getGames();
  const t = await getTranslations("GamesTable");
  const games = await getGames();
  return (
    <div>
      <Table
        t={t}
        grid_cols="grid-cols-[0.5fr_0.5fr_2fr]"
        data={games}
        columns={[...columns]}
      >
        {games.map((game) => (
          <Table.Row key={game.id} grid_cols="grid-cols-[0.5fr_0.5fr_2fr]">
            <Table.Cell> {game.name}</Table.Cell>
            <Table.Cell> {game.description}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/games-management/edit/${game.id}`}>
                  <Button
                    className={
                      "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                    }
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
//  <>
//           <Button
//             className={
//               "text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer"
//             }
//           >
//             Delete
//           </Button>
//         </>
export default page;

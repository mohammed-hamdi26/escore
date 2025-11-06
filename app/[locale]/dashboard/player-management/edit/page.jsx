import { getPlayers } from "@/app/_Lib/palyerApi";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

const columns = [
  {
    id: "player",
    header: "Player",
  },
  {
    id: "team",
    header: "Team",
  },
  {
    id: "age",
    header: "Age",
  },
  {
    id: "country",
    header: "Country",
  },
];
async function page() {
  const players = await getPlayers();

  return (
    <div>
      <Suspense fallback={<div>Loading................</div>}>
        <Table
          columns={columns}
          grid_cols={"grid-cols-[1fr_0.5fr_0.5fr_0.5fr_2fr]"}
          data={players}
        >
          {players.map((player) => (
            <Table.Row
              grid_cols={"grid-cols-[1fr_0.5fr_0.5fr_0.5fr_2fr]"}
              key={player.id}
            >
              <Table.Cell>
                {player.firstName} {player.lastName}
              </Table.Cell>
              <Table.Cell>{player.photo}</Table.Cell>
              <Table.Cell>{player.birthDate}</Table.Cell>
              <Table.Cell>{player.nationality}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-4">
                  <Link href={`/dashboard/player-management/edit/${player.id}`}>
                    <Button
                      className={
                        "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                      }
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    className={
                      "text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer"
                    }
                  >
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </Suspense>
    </div>
  );
}

export default page;

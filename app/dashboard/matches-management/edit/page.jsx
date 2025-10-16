import Table from "@/components/ui app/Table";

import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { id } from "date-fns/locale";

async function getData() {
  // Fetch data from your API here.
  return [
    {
      // id: "728ed52f",
      team1: "Team 1",
      team2: "Team 2",
      date: "2023-06-01",
      time: "10:00 AM",
    },
    {
      // id: "728ed52f",
      team1: "Team 1",
      team2: "Team 2",
      date: "2023-06-01",
      time: "10:00 AM",
    },
    {
      // id: "728ed52f",
      team1: "Team 1",
      team2: "Team 2",
      date: "2023-06-01",
      time: "10:00 AM",
    },
    {
      // id: "728ed52f",
      team1: "Team 1",
      team2: "Team 2",
      date: "2023-06-01",
      time: "10:00 AM",
    },
    // ...
  ];
}
const columns = [
  { id: "team1", header: "Team 1" },
  { id: "team2", header: "Team 2" },
  { id: "date", header: "Date" },
  { id: "time", header: "Time" },
];

export default async function page() {
  const data = await getData();

  return (
    <div className="">
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        data={data}
        columns={[...columns]}
      >
        <>
          <Button
            className={
              "bg-green-primary rounded-full min-w-[100px] cursor-pointer"
            }
          >
            Edit
          </Button>
          <Button
            className={"bg-red-800 rounded-full min-w-[100px] cursor-pointer"}
          >
            Delete
          </Button>
        </>
      </Table>
    </div>
  );
}

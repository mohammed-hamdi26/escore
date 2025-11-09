import MatchesTable from "@/components/Matches Management/MatchesTable";
import Table from "@/components/ui app/Table";

import { Button } from "@/components/ui/button";

async function getData() {
  // Fetch data from your API here.
  return [
    {
      // id: "728ed52f",
      team: "Team ",
      country: "USA",
    },
    {
      // id: "728ed52f",
      team: "Team ",
      country: "USA",
    },
    {
      // id: "728ed52f",
      team: "Team ",
      country: "USA",
    },
    {
      // id: "728ed52f",
      team: "Team ",
      country: "USA",
    },
    // ...
  ];
}
const columns = [
  { id: "team1", header: "Team 1" },
  { id: "team2", header: "Team 2" },
  { id: "time", header: "Time" },
  { id: "date", header: "Date" },
];

export default async function page() {
  // const data = await getData();
  const data = [];

  return <MatchesTable matches={data} columns={columns} />;
}

// <Button
//   className={
//     "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
//   }
// >
//   Edit
// </Button>
// <Button
//   className={
//     "text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer"
//   }
// >
//   Delete
// </Button>

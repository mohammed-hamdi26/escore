import { getMatches, getMatchesCount } from "@/app/[locale]/_Lib/matchesApi";
import MatchesTable from "@/components/Matches Management/MatchesTable";
import Table from "@/components/ui app/Table";

import { Button } from "@/components/ui/button";

const columns = [
  { id: "team1", header: "Team 1" },
  { id: "team2", header: "Team 2" },
  { id: "time", header: "Time" },
  { id: "date", header: "Date" },
];

export default async function page({ searchParams }) {
  const { size, page } = await searchParams;
  const matches = await getMatches({ size, page });
  const numOfMatches = await getMatchesCount();

  return (
    <MatchesTable
      matches={matches}
      columns={columns}
      numOfMatches={numOfMatches}
    />
  );
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
//     "text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer"
//   }
// >
//   Delete
// </Button>

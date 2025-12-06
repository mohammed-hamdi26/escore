import { getMatches } from "@/app/[locale]/_Lib/matchesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import MatchesTable from "@/components/Matches Management/MatchesTable";

const columns = [
  { id: "team1", header: "Team 1" },
  { id: "team2", header: "Team 2" },
  { id: "status", header: "Status" },
  { id: "round", header: "Round" },
  { id: "date", header: "Date" },
];

export default async function page({ searchParams }) {
  const { size, page, status, game, tournament } = await searchParams;
  const [matchesResult, players] = await Promise.all([
    getMatches({ size, page, status, game, tournament }),
    getPlayers(),
  ]);

  return (
    <MatchesTable
      players={players}
      matches={matchesResult.data || []}
      columns={columns}
      pagination={matchesResult.pagination}
    />
  );
}

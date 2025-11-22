import { getTeams, getTeamsCount } from "@/app/[locale]/_Lib/teamsApi";
import TeamsTable from "@/components/teams management/TeamsTable";

const columns = [
  { id: "name", header: "Name" },
  { id: "country", header: "Country" },
  { id: "description", header: "Description" },
];

async function page({ searchParams }) {
  const { size, page, search } = await searchParams;
  const [teams, numOfTeams] = await Promise.all([
    getTeams({ size, page, "name.contains": search || "" }),
    getTeamsCount(),
  ]);

  return <TeamsTable columns={columns} numOfTeams={numOfTeams} teams={teams} />;
}

export default page;

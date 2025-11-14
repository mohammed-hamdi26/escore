import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TeamsTable from "@/components/teams management/TeamsTable";

const columns = [
  { id: "name", header: "Name" },
  { id: "country", header: "Country" },
  { id: "description", header: "Description" },
];

async function page({ searchParams }) {
  const { size, page } = await searchParams;
  const teams = await getTeams({ size, page });

  return <TeamsTable columns={columns} teams={teams} />;
}

export default page;

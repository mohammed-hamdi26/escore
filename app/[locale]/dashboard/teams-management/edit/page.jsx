import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TeamsTable from "@/components/teams management/TeamsTable";

const columns = [
  { id: "name", header: "Name" },
  { id: "country", header: "Country" },
  { id: "description", header: "Description" },
];

async function page({ searchParams }) {
  const { size, page, search } = await searchParams;
  const { data: teams, pagination } = await getTeams({
    size,
    page,
    search,
  });

  return <TeamsTable columns={columns} teams={teams || []} pagination={pagination} />;
}

export default page;

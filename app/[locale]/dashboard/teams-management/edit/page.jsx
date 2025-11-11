import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const columns = [
  { id: "name", header: "Name" },
  { id: "country", header: "Country" },
  { id: "description", header: "Description" },
];

async function page() {
  const t = await getTranslations("TeamsTable");
  const teams = await getTeams();

  return (
    <div>
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
        t={t}
      >
        {teams.map((team) => (
          <Table.Row
            key={team.id}
            grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
          >
            <Table.Cell>{team?.name}</Table.Cell>
            <Table.Cell>{team?.region}</Table.Cell>
            <Table.Cell>{team?.description}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/teams-management/edit/${team.id}`}>
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
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

export default page;

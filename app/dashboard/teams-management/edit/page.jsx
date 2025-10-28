import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";

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
  { id: "country", header: "Country" },
];

async function page() {
  const data = await getData();
  return (
    <div>
      <Table grid_cols="grid-cols-[0.5fr_0.5fr_2fr]" columns={[...columns]}>
        <Table.Row grid_cols="grid-cols-[0.5fr_0.5fr_2fr]">
          <Table.Cell>Team 1</Table.Cell>
          <Table.Cell>Country</Table.Cell>
          <Table.Cell>
            <div className="flex justify-end gap-4">
              <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                Edit
              </Button>
              <Button className="text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer">
                Delete
              </Button>
            </div>
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
  );
}

export default page;

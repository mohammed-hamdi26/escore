import Table from "@/components/ui app/Table";

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

async function page() {
  const data = await getData();
  return (
    <div>
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        data={data}
        columns={[...columns]}
      />
    </div>
  );
}

export default page;

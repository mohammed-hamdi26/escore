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
  { id: "team", header: "Team " },
  { id: "country", header: "Country" },
];

export default async function page() {
  const data = await getData();

  return (
    <div className="">
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_2fr]"
        data={data}
        columns={[...columns]}
      >
        <>
          <Button
            className={
              "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
            }
          >
            Edit
          </Button>
          <Button
            className={
              "text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer"
            }
          >
            Delete
          </Button>
        </>
      </Table>
    </div>
  );
}

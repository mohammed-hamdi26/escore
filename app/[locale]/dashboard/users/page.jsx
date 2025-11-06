import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";

async function getData() {
  // Fetch data from your API here.
  return [
    {
      // id: "728ed52f",
      team1: "Team 1",
    },

    // ...
  ];
}

async function page() {
  const data = await getData();
  return (
    <div>
      <Table showHeader={false} grid_cols="grid-cols-[0.5fr_2fr]" data={data}>
        <Button
          className={
            "text-white   bg-red-800 rounded-full min-w-[100px] cursor-pointer"
          }
        >
          Delete
        </Button>
      </Table>
    </div>
  );
}

export default page;

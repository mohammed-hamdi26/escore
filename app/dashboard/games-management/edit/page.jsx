import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";

async function getData() {
  // Fetch data from your API here.
  return [
    {
      // id: "728ed52f",
      team1: "logo",
    },
    {
      // id: "728ed52f",
      team1: "logo",
    },
    {
      // id: "728ed52f",
      team1: "logo",
    },
    {
      // id: "728ed52f",
      team1: "logo",
    },
    // ...
  ];
}
const columns = [{ id: "game", header: "Game" }];

async function page() {
  const data = await getData();
  return (
    <div>
      <Table
        grid_cols="grid-cols-[0.5fr_2fr]"
        data={data}
        columns={[...columns]}
      >
        <Table.Row grid_cols="grid-cols-[0.5fr_2fr]">
          <Table.Cell>Game 1</Table.Cell>
          <Table.Cell>
            <div className="flex justify-end gap-4">
              <Button
                className={
                  "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                }
              >
                Edit
              </Button>
            </div>
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
  );
}
//  <>
//           <Button
//             className={
//               "text-white bg-red-800 rounded-full min-w-[100px] cursor-pointer"
//             }
//           >
//             Delete
//           </Button>
//         </>
export default page;

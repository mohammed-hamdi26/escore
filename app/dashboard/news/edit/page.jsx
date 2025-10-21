import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
const columns = [];
function page() {
  const data = [
    {
      date: "2023-06-01",
      user: "User 1",
      message: " Hello, how can I help you?",
    },
  ];
  return (
    <div>
      <Table
        showHeader={false}
        data={data}
        grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"}
      >
        <Button
          className={
            "bg-green-primary rounded-full min-w-[100px] cursor-pointer"
          }
        >
          Edit
        </Button>
      </Table>
    </div>
  );
}

export default page;

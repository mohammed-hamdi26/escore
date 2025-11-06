"use client";
import AnswerBox from "@/components/ui app/AnswerBox";
import Model from "@/components/ui app/Model";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";

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
        grid_cols="grid-cols-[0.5fr_0.5fr_0.7fr_2fr]"
        data={data}
      >
        <Model>
          <Model.Open name={"answer"}>
            <Button
              className={
                "bg-green-primary rounded-full min-w-[100px] cursor-pointer"
              }
            >
              Answer
            </Button>
          </Model.Open>
          <Model.Window openName={"answer"}>
            <AnswerBox />
          </Model.Window>
        </Model>
      </Table>
    </div>
  );
}

export default page;

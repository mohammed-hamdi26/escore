import Table from "@/components/ui app/Table";

function page() {
  return (
    <div>
      <Table
        showHeader={false}
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        data={[
          {
            name: "Player 1",
            team: "Team 1",
            age: "20",
            country: "USA",
          },
        ]}
      />
    </div>
  );
}

export default page;

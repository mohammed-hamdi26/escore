import Table from "@/components/ui app/Table";

function page() {
  return (
    <div>
      <Table
        showHeader={false}
        grid_cols="grid-cols-[0.5fr_2fr]"
        data={[
          {
            Team: "Team 1",
          },
        ]}
      />
    </div>
  );
}

export default page;

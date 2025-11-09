"use client";
import Table from "../ui app/Table";
import FilterMatches from "./FilterMatches";

function MatchesTable({ matches, columns }) {
  return (
    <div className="space-y-8">
      <FilterMatches />
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
      >
        {matches?.map((item) => (
          <Table.Row
            grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
            key={item.id}
          >
            <Table.Cell>{item.team1}</Table.Cell>
            <Table.Cell>{item.team2}</Table.Cell>
            <Table.Cell>{item.time}</Table.Cell>
            <Table.Cell>{item.date}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}

export default MatchesTable;

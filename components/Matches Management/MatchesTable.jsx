"use client";
import Pagination from "../ui app/Pagination";
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
        {matches?.map((match) => (
          <Table.Row
            grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
            key={match.id}
          >
            <Table.Cell>{match?.teams[0]?.name}</Table.Cell>
            <Table.Cell>{match?.teams[1]?.name}</Table.Cell>
            <Table.Cell>{match.matchTime}</Table.Cell>
            <Table.Cell>{match.matchDate}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination />
    </div>
  );
}

export default MatchesTable;

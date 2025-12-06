import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import PlayersTable from "@/components/Player Management/PlayersTable";
import Loading from "@/components/ui app/Loading";
import { Suspense } from "react";

const columns = [
  {
    id: "player",
    header: "Player",
  },
  {
    id: "team",
    header: "Team",
  },
  {
    id: "age",
    header: "Age",
  },
  {
    id: "country",
    header: "Country",
  },
];

async function page({ searchParams }) {
  const { search, size, page } = await searchParams;

  const { data: players, pagination } = await getPlayers({
    search,
    size,
    page,
  });

  return (
    <Suspense fallback={<Loading />}>
      <PlayersTable
        players={players || []}
        columns={columns}
        pagination={pagination}
      />
    </Suspense>
  );
}

export default page;

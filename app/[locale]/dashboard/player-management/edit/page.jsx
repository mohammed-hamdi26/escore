import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import PlayersTable from "@/components/Player Management/PlayersTable";
import Loading from "@/components/ui app/Loading";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

  const players = await getPlayers({
    "firstName.contains": search || "",
    "lastName.contains": search || "",
    size: size || 20,
    page,
  });
  // const players = [];

  return (
    <Suspense fallback={<Loading />}>
      <PlayersTable search={search} players={players} columns={columns} />
    </Suspense>
  );
}

export default page;

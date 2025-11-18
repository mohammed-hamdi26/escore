import {
  getNumOfTournaments,
  getTournaments,
} from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsTable from "@/components/Tournaments Management/TournamentsTable";

async function page({ searchParams }) {
  const { size, page } = await searchParams;
  const tournaments = await getTournaments({ size, page });
  const numOfTournaments = await getNumOfTournaments();
  return (
    <TournamentsTable
      tournaments={tournaments}
      numOfTournaments={numOfTournaments}
    />
  );
}

export default page;

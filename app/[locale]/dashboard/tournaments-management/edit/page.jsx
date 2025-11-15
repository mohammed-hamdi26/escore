import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsTable from "@/components/Tournaments Management/TournamentsTable";

async function page({ searchParams }) {
  const { size, page } = await searchParams;
  const tournaments = await getTournaments({ size, page });
  return <TournamentsTable tournaments={tournaments} />;
}

export default page;

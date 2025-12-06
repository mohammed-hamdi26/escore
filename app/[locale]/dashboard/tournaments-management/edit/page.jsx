import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsTable from "@/components/Tournaments Management/TournamentsTable";

async function page({ searchParams }) {
  const { size, page, search } = await searchParams;
  const { data: tournaments, pagination } = await getTournaments({
    size,
    page,
    search,
  });

  return (
    <TournamentsTable
      tournaments={tournaments || []}
      pagination={pagination}
    />
  );
}

export default page;

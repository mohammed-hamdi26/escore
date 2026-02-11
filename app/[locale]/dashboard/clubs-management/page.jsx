import { getClubs } from "@/app/[locale]/_Lib/clubsApi";
import ClubList from "@/components/Clubs Management/ClubList";
import { ClubListWrapper } from "@/components/Clubs Management/ClubFormWrapper";

async function ClubsPage({ searchParams }) {
  const { size, page, search, isActive, region, sortBy, sortOrder } =
    await searchParams;
  const { data: clubs, pagination } = await getClubs({
    size,
    page,
    search,
    isActive,
    region,
    sortBy,
    sortOrder,
  });

  return (
    <ClubListWrapper>
      <ClubList clubs={clubs || []} pagination={pagination} />
    </ClubListWrapper>
  );
}

export default ClubsPage;

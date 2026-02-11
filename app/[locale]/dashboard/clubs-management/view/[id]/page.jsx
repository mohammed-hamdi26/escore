import { getClub } from "@/app/[locale]/_Lib/clubsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import ClubDetails from "@/components/Clubs Management/ClubDetails";
import { ClubListWrapper } from "@/components/Clubs Management/ClubFormWrapper";

async function ViewClubPage({ params }) {
  const { id } = await params;
  const [club, { data: games }, { data: teams }] = await Promise.all([
    getClub(id),
    getGames({ size: 100 }),
    getTeams({ size: 200 }),
  ]);

  return (
    <ClubListWrapper>
      <ClubDetails club={club} games={games || []} teams={teams || []} />
    </ClubListWrapper>
  );
}

export default ViewClubPage;

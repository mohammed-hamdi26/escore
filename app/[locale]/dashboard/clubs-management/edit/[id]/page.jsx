import { getClub } from "@/app/[locale]/_Lib/clubsApi";
import { editClub } from "@/app/[locale]/_Lib/actions";
import ClubForm from "@/components/Clubs Management/ClubForm";
import { ClubEditWrapper } from "@/components/Clubs Management/ClubFormWrapper";

async function EditClubPage({ params }) {
  const { id } = await params;
  const club = await getClub(id);

  return (
    <ClubEditWrapper>
      <ClubForm club={club} submit={editClub} formType="edit" />
    </ClubEditWrapper>
  );
}

export default EditClubPage;

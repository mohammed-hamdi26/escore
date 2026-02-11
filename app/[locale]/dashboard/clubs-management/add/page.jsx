import { addClub } from "@/app/[locale]/_Lib/actions";
import ClubForm from "@/components/Clubs Management/ClubForm";
import { ClubAddWrapper } from "@/components/Clubs Management/ClubFormWrapper";

async function AddClubPage() {
  return (
    <ClubAddWrapper>
      <ClubForm submit={addClub} formType="add" />
    </ClubAddWrapper>
  );
}

export default AddClubPage;

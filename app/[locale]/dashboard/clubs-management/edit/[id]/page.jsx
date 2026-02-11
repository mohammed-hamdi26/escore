import { getClub } from "@/app/[locale]/_Lib/clubsApi";
import { editClub } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import ClubForm from "@/components/Clubs Management/ClubForm";
import { ClubEditWrapper } from "@/components/Clubs Management/ClubFormWrapper";

async function EditClubPage({ params }) {
  const { id } = await params;

  let countries = [];
  try {
    const result = await getCountries();
    countries = result?.countries || [];
  } catch {
    countries = [];
  }

  const club = await getClub(id);

  return (
    <ClubEditWrapper>
      <ClubForm club={club} submit={editClub} formType="edit" countries={countries} />
    </ClubEditWrapper>
  );
}

export default EditClubPage;

import { addClub } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import ClubForm from "@/components/Clubs Management/ClubForm";
import { ClubAddWrapper } from "@/components/Clubs Management/ClubFormWrapper";

async function AddClubPage() {
  let countries = [];
  try {
    const result = await getCountries();
    countries = result?.countries || [];
  } catch {
    countries = [];
  }

  return (
    <ClubAddWrapper>
      <ClubForm submit={addClub} formType="add" countries={countries} />
    </ClubAddWrapper>
  );
}

export default AddClubPage;

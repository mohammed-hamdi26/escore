import { addTeam } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import TeamForm from "@/components/teams management/TeamForm";

async function page() {
  const countries = await getCountries();
  return (
    <TeamForm
      submit={addTeam}
      countries={countries}
      successMessage="Team added successfully"
    />
  );
}

export default page;

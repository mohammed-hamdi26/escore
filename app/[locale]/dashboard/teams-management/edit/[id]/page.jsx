import { updateTeam } from "@/app/_Lib/actions";
import { getCountries } from "@/app/_Lib/countriesApi";
import { getTeam } from "@/app/_Lib/teamsApi";
import TeamForm from "@/components/teams management/TeamForm";

export default async function page({ params }) {
  const { id } = await params;
  const team = await getTeam(id);
  const countries = await getCountries();
  return (
    <TeamForm
      submit={updateTeam}
      countries={countries}
      team={team}
      successMessage="Team updated"
      formType="edit"
    />
  );
}

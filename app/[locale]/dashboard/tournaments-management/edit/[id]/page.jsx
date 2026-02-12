import { editTournament, searchGames } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import { TournamentEditWrapper } from "@/components/tournaments/TournamentFormWrapper";

async function page({ params }) {
  const { id } = await params;
  const [tournament, countries, teamsResponse] = await Promise.all([
    getTournament(id),
    getCountries(),
    getTeams({ size: 100 }),
  ]);

  return (
    <TournamentEditWrapper>
      <TournamentsForm
        countries={countries.countries}
        formType="edit"
        searchGames={searchGames}
        teamOptions={teamsResponse.data || []}
        submit={editTournament}
        tournament={tournament}
      />
    </TournamentEditWrapper>
  );
}

export default page;

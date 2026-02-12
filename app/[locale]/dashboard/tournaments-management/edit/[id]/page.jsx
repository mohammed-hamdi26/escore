import { editTournament, searchGames, searchTeams } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import { TournamentEditWrapper } from "@/components/tournaments/TournamentFormWrapper";

async function page({ params }) {
  const { id } = await params;
  const [tournament, countries] = await Promise.all([
    getTournament(id),
    getCountries(),
  ]);

  return (
    <TournamentEditWrapper>
      <TournamentsForm
        countries={countries.countries}
        formType="edit"
        searchGames={searchGames}
        searchTeams={searchTeams}
        submit={editTournament}
        tournament={tournament}
      />
    </TournamentEditWrapper>
  );
}

export default page;

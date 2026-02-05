import { editTournament } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import { TournamentEditWrapper } from "@/components/tournaments/TournamentFormWrapper";

async function page({ params }) {
  const { id } = await params;
  const [tournament, countries, gamesResponse] = await Promise.all([
    getTournament(id),
    getCountries(),
    getGames(),
  ]);

  return (
    <TournamentEditWrapper>
      <TournamentsForm
        countries={countries.countries}
        formType="edit"
        gameOptions={gamesResponse.data || []}
        submit={editTournament}
        tournament={tournament}
      />
    </TournamentEditWrapper>
  );
}

export default page;

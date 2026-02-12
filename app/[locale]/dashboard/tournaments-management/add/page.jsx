import { addTournament, searchGames } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import { TournamentAddWrapper } from "@/components/tournaments/TournamentFormWrapper";
import React from "react";

export default async function page() {
  const [countries, teamsResponse] = await Promise.all([
    getCountries(),
    getTeams({ size: 100 }),
  ]);

  return (
    <TournamentAddWrapper>
      <div>
        <TournamentsForm
          submit={addTournament}
          searchGames={searchGames}
          teamOptions={teamsResponse.data || []}
          countries={countries.countries}
        />
      </div>
    </TournamentAddWrapper>
  );
}

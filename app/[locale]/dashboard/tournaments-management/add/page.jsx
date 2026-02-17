import { addTournament, searchGames, searchTeams, searchPlayers } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import { TournamentAddWrapper } from "@/components/tournaments/TournamentFormWrapper";
import React from "react";

export default async function page() {
  const countries = await getCountries();

  return (
    <TournamentAddWrapper>
      <div>
        <TournamentsForm
          submit={addTournament}
          searchGames={searchGames}
          searchTeams={searchTeams}
          searchPlayers={searchPlayers}
          countries={countries.countries}
        />
      </div>
    </TournamentAddWrapper>
  );
}

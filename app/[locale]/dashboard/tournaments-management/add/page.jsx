import { addTournament } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import { TournamentAddWrapper } from "@/components/tournaments/TournamentFormWrapper";
import React from "react";

export default async function page() {
  const [countries, gamesResponse] = await Promise.all([getCountries(), getGames()]);

  return (
    <TournamentAddWrapper>
      <div>
        <TournamentsForm
          submit={addTournament}
          gameOptions={gamesResponse.data || []}
          countries={countries.countries}
        />
      </div>
    </TournamentAddWrapper>
  );
}

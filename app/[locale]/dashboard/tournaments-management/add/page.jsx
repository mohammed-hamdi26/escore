import { addTournament } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import React from "react";

export default async function page() {
  const [countries, gamesResponse] = await Promise.all([getCountries(), getGames()]);

  return (
    <div>
      <TournamentsForm
        submit={addTournament}
        gameOptions={gamesResponse.data || []}
        countries={countries.countries}
      />
    </div>
  );
}

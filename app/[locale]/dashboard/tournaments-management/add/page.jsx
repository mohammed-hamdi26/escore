import { addTournament } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import React from "react";

export default async function page() {
  const [countries, games] = await Promise.all([getCountries(), getGames()]);

  console.log(games, "games");

  return (
    <div>
      <TournamentsForm
        submit={addTournament}
        gameOptions={games}
        countries={countries.countries}
      />
    </div>
  );
}

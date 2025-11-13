import { addTournament } from "@/app/[locale]/_Lib/actions";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";
import React from "react";

export default function page() {
  return (
    <div>
      <TournamentsForm submit={addTournament} />
    </div>
  );
}

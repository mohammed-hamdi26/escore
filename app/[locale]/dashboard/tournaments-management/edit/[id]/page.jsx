import { editTournament } from "@/app/[locale]/_Lib/actions";
import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import TournamentsForm from "@/components/Tournaments Management/TournamentsForm";

async function page({ params }) {
  const { id } = await params;
  const tournament = await getTournament(id);

  return (
    <TournamentsForm
      formType="edit"
      submit={editTournament}
      tournament={tournament}
    />
  );
}

export default page;

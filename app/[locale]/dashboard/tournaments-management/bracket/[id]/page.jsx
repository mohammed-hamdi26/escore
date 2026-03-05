import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import BracketManagement from "@/components/Tournaments Management/BracketManagement";
import { BracketWrapper } from "@/components/Tournaments Management/BracketWrapper";

async function page({ params }) {
  const { id } = await params;
  const tournament = await getTournament(id);

  return (
    <BracketWrapper>
      <BracketManagement tournament={tournament} />
    </BracketWrapper>
  );
}

export default page;

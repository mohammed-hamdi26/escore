import { editTransfer } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournament } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTransfer, getTransfers } from "@/app/[locale]/_Lib/transferApi";
import TransfersForm from "@/components/transfers-management/TransfersForm";

async function page({ params }) {
  const { id } = await params;
  const [games, players, teams, transfer] = await Promise.all([
    getGames(),
    getPlayers(),
    getTeams(),
    getTransfer(id),
  ]);
  return (
    <TransfersForm
      submit={editTransfer}
      playersOptions={players}
      transfer={transfer}
      formType="edit"
      teamsOptions={teams}
      gamesOptions={games}
    />
  );
}

export default page;

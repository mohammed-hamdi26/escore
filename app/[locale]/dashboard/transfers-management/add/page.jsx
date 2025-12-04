import { addTransfer } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TransfersForm from "@/components/transfers-management/TransfersForm";

async function page() {
  const [games, players, teams] = await Promise.all([
    getGames(),
    getPlayers(),
    getTeams(),
  ]);
  return (
    <TransfersForm
      submit={addTransfer}
      gamesOptions={games}
      playersOptions={players}
      teamsOptions={teams}
    />
  );
}

export default page;

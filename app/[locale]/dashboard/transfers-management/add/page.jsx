import { addTransfer } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TransfersForm from "@/components/transfers-management/TransfersForm";

async function AddTransferPage() {
  const [games, playersData, teamsData] = await Promise.all([
    getGames().catch(() => []),
    getPlayers().catch(() => ({ data: [] })),
    getTeams().catch(() => ({ data: [] })),
  ]);

  return (
    <TransfersForm
      submit={addTransfer}
      gamesOptions={games || []}
      playersOptions={playersData?.data || []}
      teamsOptions={teamsData?.data || []}
      formType="add"
    />
  );
}

export default AddTransferPage;

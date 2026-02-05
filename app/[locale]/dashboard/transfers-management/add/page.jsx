import { addTransfer } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TransfersForm from "@/components/transfers-management/TransfersForm";
import { TransferAddWrapper } from "@/components/transfers/TransferFormWrapper";

async function AddTransferPage() {
  const [gamesData, playersData, teamsData] = await Promise.all([
    getGames({ size: 100 }).catch(() => ({ data: [] })),
    getPlayers({ size: 500 }).catch(() => ({ data: [] })),
    getTeams({ size: 500 }).catch(() => ({ data: [] })),
  ]);

  return (
    <TransferAddWrapper>
      <TransfersForm
        submit={addTransfer}
        gamesOptions={gamesData?.data || []}
        playersOptions={playersData?.data || []}
        teamsOptions={teamsData?.data || []}
        formType="add"
      />
    </TransferAddWrapper>
  );
}

export default AddTransferPage;

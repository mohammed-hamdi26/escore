import { editTransfer } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTransfer } from "@/app/[locale]/_Lib/transferApi";
import TransfersForm from "@/components/transfers-management/TransfersForm";
import { TransferEditWrapper } from "@/components/transfers/TransferFormWrapper";
import { notFound } from "next/navigation";

async function EditTransferPage({ params }) {
  const { id } = await params;

  let transfer;
  try {
    [transfer] = await Promise.all([getTransfer(id)]);
    if (!transfer) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching transfer:", error);
    notFound();
  }

  const [gamesData, playersData, teamsData] = await Promise.all([
    getGames({ limit: 100 }).catch(() => ({ data: [] })),
    getPlayers().catch(() => ({ data: [] })),
    getTeams().catch(() => ({ data: [] })),
  ]);

  return (
    <TransferEditWrapper>
      <TransfersForm
        submit={editTransfer}
        playersOptions={playersData?.data || []}
        transfer={transfer}
        formType="edit"
        teamsOptions={teamsData?.data || []}
        gamesOptions={gamesData?.data || []}
      />
    </TransferEditWrapper>
  );
}

export default EditTransferPage;

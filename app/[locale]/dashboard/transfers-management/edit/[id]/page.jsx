import { editTransfer } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTransfer } from "@/app/[locale]/_Lib/transferApi";
import TransfersForm from "@/components/transfers-management/TransfersForm";
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
    getGames().catch(() => ({ data: [] })),
    getPlayers().catch(() => ({ data: [] })),
    getTeams().catch(() => ({ data: [] })),
  ]);

  return (
    <TransfersForm
      submit={editTransfer}
      playersOptions={playersData?.data || []}
      transfer={transfer}
      formType="edit"
      teamsOptions={teamsData?.data || []}
      gamesOptions={gamesData?.data || []}
    />
  );
}

export default EditTransferPage;

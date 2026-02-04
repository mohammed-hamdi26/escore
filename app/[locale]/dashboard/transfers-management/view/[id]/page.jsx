import { getTransfer } from "@/app/[locale]/_Lib/transferApi";
import TransferDetails from "@/components/transfers-management/TransferDetails";

async function ViewTransferPage({ params }) {
  const { id } = await params;

  const transfer = await getTransfer(id);

  return <TransferDetails transfer={transfer} />;
}

export default ViewTransferPage;

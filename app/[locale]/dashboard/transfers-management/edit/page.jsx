import { getTransfers } from "@/app/[locale]/_Lib/transferApi";
import TransfersTable from "@/components/transfers-management/TransfersTable";

async function page() {
  const transfers = await getTransfers();
  return (
    <div>
      <TransfersTable transfers={transfers} />
    </div>
  );
}

export default page;

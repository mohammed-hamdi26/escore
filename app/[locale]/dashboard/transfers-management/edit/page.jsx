import { getTransfers } from "@/app/[locale]/_Lib/transferApi";
import TransfersTable from "@/components/transfers-management/TransfersTable";

async function page({ searchParams }) {
  const { size, page, search } = await searchParams;
  const { data: transfers, pagination } = await getTransfers({
    size,
    page,
    search,
  });

  return (
    <div>
      <TransfersTable transfers={transfers || []} pagination={pagination} />
    </div>
  );
}

export default page;

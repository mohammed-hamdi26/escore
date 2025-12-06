import { getTransfers, getTransferStats } from "@/app/[locale]/_Lib/transferApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import TransfersStatsCards from "@/components/transfers-management/TransfersStatsCards";
import TransfersTable from "@/components/transfers-management/TransfersTable";

async function TransfersListPage({ searchParams }) {
  const params = await searchParams;
  const { page, limit, status, type, game, search } = params || {};

  // Fetch transfers, stats, and games in parallel
  let transfersData = { data: [], pagination: { totalPages: 1, total: 0 } };
  let stats = null;
  let games = [];

  try {
    [transfersData, stats, games] = await Promise.all([
      getTransfers({ page, limit: limit || 10, status, type, game, search }).catch(() => ({
        data: [],
        pagination: { totalPages: 1, total: 0 },
      })),
      getTransferStats().catch(() => null),
      getGames().catch(() => []),
    ]);
  } catch (error) {
    console.error("Error fetching transfers data:", error);
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <TransfersStatsCards stats={stats} />

      {/* Transfers Table with Filters */}
      <TransfersTable
        transfers={transfersData?.data || []}
        pagination={transfersData?.pagination || { totalPages: 1, total: 0 }}
        games={games || []}
      />
    </div>
  );
}

export default TransfersListPage;

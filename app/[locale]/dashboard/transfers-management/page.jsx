import { getTransfers } from "@/app/[locale]/_Lib/transferApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import TransfersTable from "@/components/transfers-management/TransfersTable";
import { TransferListWrapper } from "@/components/transfers/TransferFormWrapper";

async function TransfersListPage({ searchParams }) {
  const params = await searchParams;
  const { page, limit, game, search, team, isFeatured, sortBy, sortOrder } = params || {};

  // Fetch transfers, games, and teams in parallel
  let transfersData = { data: [], pagination: { totalPages: 1, total: 0 } };
  let gamesData = { data: [] };
  let teamsData = { data: [] };

  try {
    [transfersData, gamesData, teamsData] = await Promise.all([
      getTransfers({ page, limit: limit || 10, game, search, team, isFeatured, sortBy, sortOrder }).catch(() => ({
        data: [],
        pagination: { totalPages: 1, total: 0 },
      })),
      getGames().catch(() => ({ data: [] })),
      getTeams({ size: 500 }).catch(() => ({ data: [] })),
    ]);
  } catch (error) {
    console.error("Error fetching transfers data:", error);
  }

  return (
    <TransferListWrapper>
      <div className="space-y-6">
        {/* Transfers Table with Filters */}
        <TransfersTable
          transfers={transfersData?.data || []}
          pagination={transfersData?.pagination || { totalPages: 1, total: 0 }}
          games={gamesData?.data || []}
          teams={teamsData?.data || []}
        />
      </div>
    </TransferListWrapper>
  );
}

export default TransfersListPage;

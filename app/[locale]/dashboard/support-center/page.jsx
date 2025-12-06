import { getTickets, getTicketStats } from "../../_Lib/supportCenterApi";
import SupportStatsCards from "@/components/Support Center/SupportStatsCards";
import SupportFilter from "@/components/Support Center/SupportFilter";
import SupportTicketsTable from "@/components/Support Center/SupportCenterTable";
import { getTranslations } from "next-intl/server";

async function SupportCenterPage({ searchParams }) {
  const t = await getTranslations("SupportCenter");
  const params = await searchParams;
  const { page, limit, status, category, priority, search } = params || {};

  // Fetch tickets and stats in parallel with error handling
  let ticketsData = { data: [], pagination: { totalPages: 1, total: 0 } };
  let stats = null;

  try {
    [ticketsData, stats] = await Promise.all([
      getTickets({ page, limit: limit || 10, status, category, priority, search }).catch(() => ({ data: [], pagination: { totalPages: 1, total: 0 } })),
      getTicketStats().catch(() => null),
    ]);
  } catch (error) {
    console.error("Error fetching support data:", error);
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <SupportStatsCards stats={stats} t={t} />

      {/* Filters */}
      <SupportFilter t={t} />

      {/* Tickets Table */}
      <SupportTicketsTable
        tickets={ticketsData?.data || []}
        pagination={ticketsData?.pagination || { totalPages: 1, total: 0 }}
      />
    </div>
  );
}

export default SupportCenterPage;

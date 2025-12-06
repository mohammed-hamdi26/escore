import { getTickets, getTicketStats } from "../../_Lib/supportCenterApi";
import SupportStatsCards from "@/components/Support Center/SupportStatsCards";
import SupportFilter from "@/components/Support Center/SupportFilter";
import SupportTicketsTable from "@/components/Support Center/SupportCenterTable";
import { getTranslations } from "next-intl/server";

async function SupportCenterPage({ searchParams }) {
  const t = await getTranslations("SupportCenter");
  const { page, limit, status, category, priority, search } = await searchParams;

  // Fetch tickets and stats in parallel
  const [ticketsData, stats] = await Promise.all([
    getTickets({ page, limit: limit || 10, status, category, priority, search }),
    getTicketStats().catch(() => null), // Don't fail page if stats fail
  ]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <SupportStatsCards stats={stats} t={t} />

      {/* Filters */}
      <SupportFilter t={t} />

      {/* Tickets Table */}
      <SupportTicketsTable
        tickets={ticketsData.data || []}
        pagination={ticketsData.pagination}
      />
    </div>
  );
}

export default SupportCenterPage;

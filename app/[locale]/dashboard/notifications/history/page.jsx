import { getNotificationHistory } from "../../../_Lib/notificationsApi";
import NotificationHistory from "@/components/notifications/NotificationHistory";

export default async function HistoryPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const type = params?.type || "";
  const status = params?.status || "";
  const search = params?.search || "";
  const dateFrom = params?.dateFrom || "";
  const dateTo = params?.dateTo || "";

  let data = null;
  let error = null;

  try {
    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    data = await getNotificationHistory(page, 20, filters);
  } catch (e) {
    error = e.message;
  }

  return (
    <NotificationHistory
      notifications={data?.data || []}
      pagination={data?.pagination}
      error={error}
      currentFilters={{ type, status, search, dateFrom, dateTo }}
    />
  );
}

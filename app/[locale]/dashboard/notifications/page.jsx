import { getNotificationStats } from "../../_Lib/notificationsApi";
import NotificationsDashboard from "@/components/notifications/NotificationsDashboard";

export default async function NotificationsPage() {
  let stats = null;
  let error = null;

  try {
    stats = await getNotificationStats();
  } catch (e) {
    error = e.message;
  }

  return <NotificationsDashboard stats={stats} error={error} />;
}

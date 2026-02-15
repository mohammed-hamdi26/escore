import {
  getNotificationStats,
  getNotificationTimeline,
} from "../../_Lib/notificationsApi";
import NotificationsDashboard from "@/components/notifications/NotificationsDashboard";

export default async function NotificationsPage() {
  let stats = null;
  let timeline = null;
  let error = null;

  try {
    const [statsData, timelineData] = await Promise.all([
      getNotificationStats(),
      getNotificationTimeline("30d", "day"),
    ]);
    stats = statsData;
    timeline = timelineData;
  } catch (e) {
    error = e.message;
  }

  return (
    <NotificationsDashboard
      stats={stats}
      initialTimeline={timeline}
      error={error}
    />
  );
}

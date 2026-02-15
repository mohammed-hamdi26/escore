import SendNotificationForm from "@/components/notifications/SendNotificationForm";
import {
  getGamesForFilter,
  getTeamsForFilter,
  getTournamentsForFilter,
  getUsersForFilter,
  getNotificationTemplates,
} from "../../../_Lib/notificationsApi";

export default async function SendNotificationPage() {
  // Fetch data for filters in parallel
  const [games, teams, tournaments, users, templates] = await Promise.all([
    getGamesForFilter(),
    getTeamsForFilter(),
    getTournamentsForFilter(),
    getUsersForFilter(),
    getNotificationTemplates({ isActive: true }),
  ]);

  return (
    <SendNotificationForm
      games={games}
      teams={teams}
      tournaments={tournaments}
      users={users}
      templates={templates}
    />
  );
}

import { getNotificationTemplates } from "../../../_Lib/notificationsApi";
import TemplateManager from "@/components/notifications/TemplateManager";

export default async function TemplatesPage() {
  let templates = [];
  let error = null;

  try {
    templates = await getNotificationTemplates();
  } catch (e) {
    error = e.message;
  }

  return <TemplateManager templates={templates} error={error} />;
}

import { getContentRequests } from "../../../_Lib/usersApi";
import { getTranslations } from "next-intl/server";
import ContentRequestsTable from "@/components/Users/ContentRequestsTable";

export default async function ContentRequestsPage({ searchParams }) {
  const params = await searchParams;
  const page = params.page || 1;

  const { data: requests, meta } = await getContentRequests(page, 20);
  const t = await getTranslations("UsersManagement");

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <p className="text-gray-400">
          {t("contentRequestsDescription")}
        </p>
      </div>

      <ContentRequestsTable requests={requests} meta={meta} />
    </div>
  );
}

import { getUsers } from "../../../_Lib/usersApi";
import { getTranslations } from "next-intl/server";
import UsersListTable from "@/components/Users/UsersListTable";
import UsersFilters from "@/components/Users/UsersFilters";
import { AlertCircle } from "lucide-react";

export default async function UsersListPage({ searchParams }) {
  const params = await searchParams;
  const page = params.page || 1;
  const role = params.role || "";
  const isVerified = params.isVerified || "";
  const search = params.search || "";
  const isDeleted = params.isDeleted || "false";

  const t = await getTranslations("UsersManagement");

  let users = [];
  let meta = { page: 1, limit: 20, total: 0, totalPages: 0 };
  let error = null;

  try {
    const result = await getUsers({
      page,
      role,
      isVerified,
      search,
      isDeleted,
      limit: 20,
    });
    users = result.data;
    meta = result.meta;
  } catch (e) {
    error = e.message || "Failed to load users";
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UsersFilters
        currentFilters={{ role, isVerified, search, isDeleted }}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="size-6 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-red-500">{t("error") || "Error"}</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      {!error && <UsersListTable users={users} meta={meta} />}
    </div>
  );
}

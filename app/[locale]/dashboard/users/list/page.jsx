import { getUsers } from "../../../_Lib/usersApi";
import { getTranslations } from "next-intl/server";
import UsersListTable from "@/components/Users/UsersListTable";
import UsersFilters from "@/components/Users/UsersFilters";

export default async function UsersListPage({ searchParams }) {
  const params = await searchParams;
  const page = params.page || 1;
  const role = params.role || "";
  const isVerified = params.isVerified || "";
  const search = params.search || "";
  const isDeleted = params.isDeleted || "false";

  const { data: users, meta } = await getUsers({
    page,
    role,
    isVerified,
    search,
    isDeleted,
    limit: 20,
  });

  const t = await getTranslations("UsersManagement");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UsersFilters
        currentFilters={{ role, isVerified, search, isDeleted }}
      />

      {/* Users Table */}
      <UsersListTable users={users} meta={meta} />
    </div>
  );
}

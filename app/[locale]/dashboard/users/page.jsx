import UsersTable from "@/components/Users/UsersTable";
import { getUsers } from "../../_Lib/usersApi";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

async function page() {
  const users = await getUsers();
  const t = await getTranslations("buttonLinks");
  return (
    <div>
      <div className="flex items-center  gap-4 mb-8">
        <Link href="/dashboard/users/add">
          <Button
            className={` text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary  hover:bg-green-primary/80
            cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {t("add new")}
          </Button>
        </Link>
      </div>
      <UsersTable users={users} />
    </div>
  );
}

export default page;

import SideNavBar from "@/components/dashboard/SideNavBar";
import TopNav from "@/components/dashboard/TopNav";
import { getLoginUser } from "../_Lib/usersApi";

export default async function DashboardLayout({ children }) {
  const user = await getLoginUser();
  return (
    <div className="p-16 pt-8 min-h-dvh  ">
      <TopNav />
      <div className="flex gap-5 h-full">
        <SideNavBar user={user} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

import SideNavBar from "@/components/dashboard/SideNavBar";
import TopNav from "@/components/dashboard/TopNav";
import { getLoginUser } from "../_Lib/usersApi";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }) {
  let user = null;

  try {
    user = await getLoginUser();
  } catch (error) {
    // If user fetch fails, clear session and redirect to login
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-16 pt-8 min-h-dvh">
      <TopNav />
      <div className="flex gap-5 h-full">
        <SideNavBar user={user} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

import SideNavBar from "@/components/dashboard/SideNavBar";
import TopNav from "@/components/dashboard/TopNav";
import { getLoginUser } from "../_Lib/usersApi";
import { redirect } from "next/navigation";
import { PermissionsProvider } from "@/contexts/PermissionsContext";

export default async function DashboardLayout({ children }) {
  let user = null;
  let shouldRedirect = false;

  try {
    user = await getLoginUser();
  } catch (error) {
    shouldRedirect = true;
  }

  if (shouldRedirect || !user) {
    redirect("/api/auth/force-logout");
  }

  return (
    <PermissionsProvider user={user}>
      <div className="min-h-dvh">
        {/* Fixed Header */}
        <TopNav user={user} />

        {/* Main Content Area */}
        <div className="flex gap-5 px-4 md:px-6 lg:px-8 pb-6">
          <SideNavBar user={user} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </PermissionsProvider>
  );
}

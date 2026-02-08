import SideNavBar from "@/components/dashboard/SideNavBar";
import TopNav from "@/components/dashboard/TopNav";
import { getLoginUser } from "../_Lib/usersApi";
import { redirect } from "next/navigation";
import { PermissionsProvider } from "@/contexts/PermissionsContext";

export default async function DashboardLayout({ children, params }) {
  let user = null;
  let shouldRedirect = false;
  const { locale } = await params;

  try {
    user = await getLoginUser();
  } catch (error) {
    shouldRedirect = true;
  }

  if (shouldRedirect || !user) {
    // Redirect to force-logout route handler which can safely clear cookies
    redirect(`/api/auth/force-logout?locale=${locale || "en"}`);
  }

  return (
    <PermissionsProvider user={user}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#05060e]">
        {/* Header */}
        <TopNav user={user} />

        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar */}
          <SideNavBar user={user} />

          {/* Content */}
          <main className="flex-1 min-h-[calc(100vh-64px)] p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </PermissionsProvider>
  );
}

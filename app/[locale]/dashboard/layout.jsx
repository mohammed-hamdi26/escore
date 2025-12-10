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
    // If user fetch fails, mark for redirect
    // Don't call redirect inside try-catch as it throws internally
    shouldRedirect = true;
  }

  // Redirect to force-logout route which will clear the session cookie
  // Can't delete cookies in Server Components, so use a route handler
  if (shouldRedirect || !user) {
    redirect("/api/auth/force-logout");
  }

  return (
    <PermissionsProvider user={user}>
      <div className="p-4 md:p-8 lg:p-16 pt-4 md:pt-8 min-h-dvh">
        <TopNav user={user} />
        <div className="flex gap-5 h-full">
          <SideNavBar user={user} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </PermissionsProvider>
  );
}

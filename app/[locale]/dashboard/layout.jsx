import SideNavBar from "@/components/dashboard/SideNavBar";
import TopNav from "@/components/dashboard/TopNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="p-16 pt-8 min-h-dvh  ">
      <TopNav />
      <div className="flex gap-5 h-full">
        <SideNavBar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

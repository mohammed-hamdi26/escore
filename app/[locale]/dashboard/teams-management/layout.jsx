import TeamsHeader from "@/components/teams management/TeamsHeader";

function layout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <TeamsHeader />

      {/* Content */}
      {children}
    </div>
  );
}

export default layout;

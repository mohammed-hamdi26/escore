import PlayersHeader from "@/components/Player Management/PlayersHeader";

function layout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <PlayersHeader />

      {/* Content */}
      {children}
    </div>
  );
}

export default layout;

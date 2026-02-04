import TransfersHeader from "@/components/transfers-management/TransfersHeader";

function layout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <TransfersHeader />

      {/* Content */}
      {children}
    </div>
  );
}

export default layout;

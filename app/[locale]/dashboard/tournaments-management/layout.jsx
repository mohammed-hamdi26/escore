import React from "react";
import TournamentsHeader from "@/components/Tournaments Management/TournamentsHeader";

export default async function TournamentsManagementLayout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <TournamentsHeader />

      {/* Content */}
      {children}
    </div>
  );
}

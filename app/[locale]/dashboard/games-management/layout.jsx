import React from "react";
import GamesHeader from "@/components/games-management/GamesHeader";

export default async function GamesManagementLayout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <GamesHeader />

      {/* Content */}
      {children}
    </div>
  );
}

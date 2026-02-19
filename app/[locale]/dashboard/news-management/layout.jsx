import React from "react";
import NewsHeader from "@/components/News Management/NewsHeader";

export default async function NewsManagementLayout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <NewsHeader />

      {/* Content */}
      {children}
    </div>
  );
}

import React from "react";
import LinksButtons from "@/components/ui app/LinksButtons";
export default function TournamentsManagementLayout({ children }) {
  return (
    <>
      <LinksButtons />
      {children}
    </>
  );
}

"use client";

import { ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function StandingsWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.STANDING}>
      {children}
    </ReadProtection>
  );
}

export default StandingsWrapper;

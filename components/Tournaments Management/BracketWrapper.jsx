"use client";

import { ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function BracketWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.TOURNAMENT}>
      {children}
    </ReadProtection>
  );
}

export default BracketWrapper;

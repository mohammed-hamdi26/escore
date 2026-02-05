"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function GameListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.GAME}>
      {children}
    </ReadProtection>
  );
}

export function GameAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.GAME}>
      {children}
    </CreateProtection>
  );
}

export function GameEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.GAME}>
      {children}
    </UpdateProtection>
  );
}

export default GameAddWrapper;

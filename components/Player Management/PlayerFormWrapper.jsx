"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function PlayerListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.PLAYER}>
      {children}
    </ReadProtection>
  );
}

export function PlayerAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.PLAYER}>
      {children}
    </CreateProtection>
  );
}

export function PlayerEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.PLAYER}>
      {children}
    </UpdateProtection>
  );
}

export default PlayerAddWrapper;

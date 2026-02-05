"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function TeamListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.TEAM}>
      {children}
    </ReadProtection>
  );
}

export function TeamAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.TEAM}>
      {children}
    </CreateProtection>
  );
}

export function TeamEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.TEAM}>
      {children}
    </UpdateProtection>
  );
}

export default TeamAddWrapper;

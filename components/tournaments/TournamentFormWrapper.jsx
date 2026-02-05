"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function TournamentListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.TOURNAMENT}>
      {children}
    </ReadProtection>
  );
}

export function TournamentAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.TOURNAMENT}>
      {children}
    </CreateProtection>
  );
}

export function TournamentEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.TOURNAMENT}>
      {children}
    </UpdateProtection>
  );
}

export default TournamentAddWrapper;

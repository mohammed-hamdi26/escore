"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

/**
 * Wrapper to protect Match list page with read permission
 */
export function MatchListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.MATCH}>
      {children}
    </ReadProtection>
  );
}

/**
 * Wrapper to protect Match add form with create permission
 */
export function MatchAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.MATCH}>
      {children}
    </CreateProtection>
  );
}

/**
 * Wrapper to protect Match edit form with update permission
 */
export function MatchEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.MATCH}>
      {children}
    </UpdateProtection>
  );
}

export default MatchAddWrapper;

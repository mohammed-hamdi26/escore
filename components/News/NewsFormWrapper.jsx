"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function NewsListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.NEWS}>
      {children}
    </ReadProtection>
  );
}

export function NewsAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.NEWS}>
      {children}
    </CreateProtection>
  );
}

export function NewsEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.NEWS}>
      {children}
    </UpdateProtection>
  );
}

export default NewsAddWrapper;

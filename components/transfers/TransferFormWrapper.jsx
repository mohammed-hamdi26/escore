"use client";

import { CreateProtection, UpdateProtection, ReadProtection } from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function TransferListWrapper({ children }) {
  return (
    <ReadProtection entity={ENTITIES.TRANSFER}>
      {children}
    </ReadProtection>
  );
}

export function TransferAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.TRANSFER}>
      {children}
    </CreateProtection>
  );
}

export function TransferEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.TRANSFER}>
      {children}
    </UpdateProtection>
  );
}

export default TransferAddWrapper;

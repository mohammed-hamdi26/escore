"use client";

import {
  CreateProtection,
  UpdateProtection,
  ReadProtection,
} from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function EventListWrapper({ children }) {
  return <ReadProtection entity={ENTITIES.EVENT}>{children}</ReadProtection>;
}

export function EventAddWrapper({ children }) {
  return (
    <CreateProtection entity={ENTITIES.EVENT}>{children}</CreateProtection>
  );
}

export function EventEditWrapper({ children }) {
  return (
    <UpdateProtection entity={ENTITIES.EVENT}>{children}</UpdateProtection>
  );
}

export default EventAddWrapper;

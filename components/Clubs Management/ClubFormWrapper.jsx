"use client";
import {
  CreateProtection,
  UpdateProtection,
  ReadProtection,
} from "@/components/ui app/RouteProtection";
import { ENTITIES } from "@/contexts/PermissionsContext";

export function ClubListWrapper({ children }) {
  return <ReadProtection entity={ENTITIES.CLUB}>{children}</ReadProtection>;
}

export function ClubAddWrapper({ children }) {
  return <CreateProtection entity={ENTITIES.CLUB}>{children}</CreateProtection>;
}

export function ClubEditWrapper({ children }) {
  return <UpdateProtection entity={ENTITIES.CLUB}>{children}</UpdateProtection>;
}

export default ClubAddWrapper;

"use client";

import { usePermissions, ACTIONS } from "@/contexts/PermissionsContext";

/**
 * PermissionGate - Conditionally renders children based on permissions
 *
 * @param {Object} props
 * @param {string} props.entity - Entity name to check (Game, Team, Player, etc.)
 * @param {string|string[]} props.action - Action(s) to check (create, read, update, delete)
 * @param {boolean} props.requireAll - If true, requires all actions; if false, requires any (default: false)
 * @param {React.ReactNode} props.fallback - What to render if no permission (default: null)
 * @param {React.ReactNode} props.children - Content to render if has permission
 */
export function PermissionGate({
  entity,
  action,
  requireAll = false,
  fallback = null,
  children,
}) {
  const { hasPermission } = usePermissions();

  // Handle single action
  if (typeof action === "string") {
    if (!hasPermission(entity, action)) {
      return fallback;
    }
    return children;
  }

  // Handle multiple actions
  if (Array.isArray(action)) {
    const hasAccess = requireAll
      ? action.every((a) => hasPermission(entity, a))
      : action.some((a) => hasPermission(entity, a));

    if (!hasAccess) {
      return fallback;
    }
    return children;
  }

  return children;
}

/**
 * AdminGate - Only renders for admin users
 *
 * @param {Object} props
 * @param {React.ReactNode} props.fallback - What to render if not admin
 * @param {React.ReactNode} props.children - Content to render if admin
 */
export function AdminGate({ fallback = null, children }) {
  const { isAdmin } = usePermissions();
  return isAdmin ? children : fallback;
}

/**
 * EntityGate - Renders if user has any permission for an entity
 *
 * @param {Object} props
 * @param {string} props.entity - Entity name
 * @param {React.ReactNode} props.fallback - What to render if no access
 * @param {React.ReactNode} props.children - Content to render if has access
 */
export function EntityGate({ entity, fallback = null, children }) {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(entity) ? children : fallback;
}

/**
 * CreateGate - Shorthand for create permission
 */
export function CreateGate({ entity, fallback = null, children }) {
  return (
    <PermissionGate entity={entity} action={ACTIONS.CREATE} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * ReadGate - Shorthand for read permission
 */
export function ReadGate({ entity, fallback = null, children }) {
  return (
    <PermissionGate entity={entity} action={ACTIONS.READ} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * UpdateGate - Shorthand for update permission
 */
export function UpdateGate({ entity, fallback = null, children }) {
  return (
    <PermissionGate entity={entity} action={ACTIONS.UPDATE} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * DeleteGate - Shorthand for delete permission
 */
export function DeleteGate({ entity, fallback = null, children }) {
  return (
    <PermissionGate entity={entity} action={ACTIONS.DELETE} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export default PermissionGate;

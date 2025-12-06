"use client";

import { createContext, useContext, useMemo } from "react";

/**
 * Permission entities that can be controlled
 */
export const ENTITIES = {
  GAME: "Game",
  TEAM: "Team",
  PLAYER: "Player",
  TOURNAMENT: "Tournament",
  MATCH: "Match",
  NEWS: "News",
  TRANSFER: "Transfer",
  STANDING: "Standing",
  SETTINGS: "Settings",
  SUPPORT: "Support",
  USER: "User",
  AVATAR: "Avatar",
};

/**
 * Permission actions
 */
export const ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

const defaultContext = {
  permissions: [],
  role: "user",
  isAdmin: false,
  hasPermission: () => false,
  canCreate: () => false,
  canRead: () => false,
  canUpdate: () => false,
  canDelete: () => false,
  hasAnyPermission: () => false,
};

const PermissionsContext = createContext(defaultContext);

/**
 * PermissionsProvider - Wraps app to provide permission context
 * @param {Object} props
 * @param {Object} props.user - User object with permissions and role
 * @param {React.ReactNode} props.children
 */
export function PermissionsProvider({ children, user }) {
  const value = useMemo(() => {
    const permissions = user?.permissions || [];
    const role = user?.role || "user";
    const isAdmin = role === "admin";

    /**
     * Check if user has specific permission
     * @param {string} entity - Entity name (Game, Team, etc.)
     * @param {string} action - Action (create, read, update, delete)
     * @returns {boolean}
     */
    const hasPermission = (entity, action) => {
      // Admin has all permissions
      if (isAdmin) return true;

      const perm = permissions.find((p) => p.entity === entity);
      return perm?.actions?.includes(action) || false;
    };

    /**
     * Check if user can create entity
     */
    const canCreate = (entity) => hasPermission(entity, ACTIONS.CREATE);

    /**
     * Check if user can read entity
     */
    const canRead = (entity) => hasPermission(entity, ACTIONS.READ);

    /**
     * Check if user can update entity
     */
    const canUpdate = (entity) => hasPermission(entity, ACTIONS.UPDATE);

    /**
     * Check if user can delete entity
     */
    const canDelete = (entity) => hasPermission(entity, ACTIONS.DELETE);

    /**
     * Check if user has any permission for an entity
     */
    const hasAnyPermission = (entity) => {
      if (isAdmin) return true;
      const perm = permissions.find((p) => p.entity === entity);
      return perm?.actions?.length > 0;
    };

    return {
      permissions,
      role,
      isAdmin,
      hasPermission,
      canCreate,
      canRead,
      canUpdate,
      canDelete,
      hasAnyPermission,
    };
  }, [user]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook to access permissions context
 */
export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    console.warn("usePermissions must be used within PermissionsProvider");
    return defaultContext;
  }
  return context;
}

export default PermissionsContext;

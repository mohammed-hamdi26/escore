"use client";

import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Map route segments to permission entities
 */
const ROUTE_TO_ENTITY = {
  "matches-management": ENTITIES.MATCH,
  "player-management": ENTITIES.PLAYER,
  "teams-management": ENTITIES.TEAM,
  "games-management": ENTITIES.GAME,
  "tournaments-management": ENTITIES.TOURNAMENT,
  "transfers-management": ENTITIES.TRANSFER,
  "news": ENTITIES.NEWS,
  "users": ENTITIES.USER,
  "support-center": ENTITIES.SUPPORT,
  "settings": ENTITIES.SETTINGS,
};

/**
 * Map action types to permission actions
 */
const ACTION_TYPE = {
  add: ACTIONS.CREATE,
  edit: ACTIONS.UPDATE,
  delete: ACTIONS.DELETE,
  view: ACTIONS.READ,
};

/**
 * RouteProtection - Protects routes based on user permissions
 *
 * @param {Object} props
 * @param {string} props.entity - Entity name (Match, Player, etc.) - if not provided, auto-detected from pathname
 * @param {string} props.action - Action required (create, read, update, delete)
 * @param {React.ReactNode} props.children - Content to render if has permission
 * @param {string} props.redirectTo - Optional path to redirect if no permission (default: show access denied)
 */
export function RouteProtection({
  entity,
  action,
  children,
  redirectTo,
}) {
  const { hasPermission, isAdmin } = usePermissions();
  const router = useRouter();
  const t = useTranslations("common");
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Admin always has access
    if (isAdmin) {
      setHasAccess(true);
      setIsChecking(false);
      return;
    }

    // Check permission
    const permitted = hasPermission(entity, action);

    if (!permitted && redirectTo) {
      router.replace(redirectTo);
    } else {
      setHasAccess(permitted);
    }

    setIsChecking(false);
  }, [entity, action, hasPermission, isAdmin, redirectTo, router]);

  // Loading state
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-green-primary/30 border-t-green-primary animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">{t("checkingPermissions") || "Checking permissions..."}</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-8 max-w-md text-center shadow-xl">
          {/* Icon */}
          <div className="relative size-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
            <div className="relative size-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <ShieldAlert className="size-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-white dark:bg-[#0f1118] flex items-center justify-center shadow-lg">
              <Lock className="size-4 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t("accessDenied") || "Access Denied"}
          </h2>

          {/* Message */}
          <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            {t("noRoutePermission") || "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
          </p>

          {/* Action info */}
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t("requiredPermission") || "Required permission"}:</span>
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-medium capitalize">
                {action} {entity}
              </span>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-primary to-green-primary/80 hover:from-green-primary/90 hover:to-green-primary/70 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-primary/20 hover:shadow-green-primary/30"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("goBack") || "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  // Has access - render children
  return children;
}

/**
 * CreateProtection - Shorthand for create permission check
 */
export function CreateProtection({ entity, children, redirectTo }) {
  return (
    <RouteProtection entity={entity} action={ACTIONS.CREATE} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  );
}

/**
 * UpdateProtection - Shorthand for update permission check
 */
export function UpdateProtection({ entity, children, redirectTo }) {
  return (
    <RouteProtection entity={entity} action={ACTIONS.UPDATE} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  );
}

/**
 * DeleteProtection - Shorthand for delete permission check
 */
export function DeleteProtection({ entity, children, redirectTo }) {
  return (
    <RouteProtection entity={entity} action={ACTIONS.DELETE} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  );
}

/**
 * ReadProtection - Shorthand for read permission check (for listing pages)
 */
export function ReadProtection({ entity, children, redirectTo }) {
  return (
    <RouteProtection entity={entity} action={ACTIONS.READ} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  );
}

export default RouteProtection;

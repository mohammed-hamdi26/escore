"use client";

import { usePermissions, ENTITIES } from "@/contexts/PermissionsContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SettingsLayout({ children }) {
  const { hasAnyPermission, isAdmin } = usePermissions();
  const router = useRouter();
  const t = useTranslations("common");

  const hasSettingsAccess = hasAnyPermission(ENTITIES.SETTINGS);

  useEffect(() => {
    if (!hasSettingsAccess) {
      // Optional: redirect after showing message
      // router.push("/dashboard");
    }
  }, [hasSettingsAccess, router]);

  if (!hasSettingsAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-8 max-w-md text-center">
          <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="size-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t("accessDenied") || "Access Denied"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t("noSettingsPermission") || "You don't have permission to access the settings page. Please contact your administrator if you believe this is an error."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 bg-green-primary hover:bg-green-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            {t("backToDashboard") || "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

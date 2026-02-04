"use client";

import { usePathname } from "@/i18n/navigation";
import LinksButtons from "@/components/ui app/LinksButtons";
import { useTranslations } from "next-intl";
import { Newspaper } from "lucide-react";

function NewsHeader() {
  const t = useTranslations("NewsManagement");
  const pathname = usePathname();

  // Hide header on view page
  if (pathname.includes("/view/")) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
          <Newspaper className="size-5 text-green-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("title") || "News Management"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("description") || "Manage all news articles and announcements"}
          </p>
        </div>
      </div>
      <LinksButtons />
    </div>
  );
}

export default NewsHeader;

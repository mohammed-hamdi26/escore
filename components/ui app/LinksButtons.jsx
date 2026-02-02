"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Pencil, Plus } from "lucide-react";

function LinksButtons() {
  const pathname = usePathname();
  const t = useTranslations("buttonLinks");

  if (
    pathname.includes("links") ||
    pathname.includes("favorites-characters") ||
    pathname.includes("awards") ||
    pathname.includes("lineups")
  )
    return null;

  const isEditActive = pathname.includes("edit");
  const isAddActive = pathname.includes("add");

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Edit Button */}
      <Link
        aria-disabled={isEditActive ? "true" : "false"}
        href={isEditActive ? pathname : pathname.slice(0, pathname.lastIndexOf("add")) + "edit"}
        className={isEditActive ? "cursor-not-allowed" : ""}
      >
        <Button
          disabled={isEditActive}
          className={`h-10 px-5 rounded-xl font-medium transition-all ${
            isEditActive
              ? "bg-green-primary text-white glow-green-subtle cursor-not-allowed"
              : "bg-muted/50 dark:bg-white/5 text-foreground hover:bg-green-primary hover:text-white"
          } disabled:opacity-100`}
        >
          <Pencil className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("edit")}
        </Button>
      </Link>

      {/* Add Button */}
      <Link
        aria-disabled={isAddActive ? "true" : "false"}
        href={isAddActive ? pathname : pathname.slice(0, pathname.lastIndexOf("edit")) + "add"}
        className={isAddActive ? "cursor-not-allowed" : ""}
      >
        <Button
          disabled={isAddActive}
          className={`h-10 px-5 rounded-xl font-medium transition-all ${
            isAddActive
              ? "bg-green-primary text-white glow-green-subtle cursor-not-allowed"
              : "bg-muted/50 dark:bg-white/5 text-foreground hover:bg-green-primary hover:text-white"
          } disabled:opacity-100`}
        >
          <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t("add new")}
        </Button>
      </Link>
    </div>
  );
}

export default LinksButtons;

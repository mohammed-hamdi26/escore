"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

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

  // Only show Add button on edit pages
  if (!pathname.includes("edit")) return null;

  return (
    <Link href={pathname.replace("edit", "add")}>
      <Button className="h-10 px-5 rounded-xl font-medium bg-green-primary hover:bg-green-primary/90 text-white transition-all">
        <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
        {t("add new")}
      </Button>
    </Link>
  );
}

export default LinksButtons;

"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

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

  return (
    <div className="flex gap-4  mb-8">
      <Link
        aria-disabled={pathname.includes("edit") ? "true" : "false"}
        href={
          pathname.includes("edit")
            ? pathname
            : pathname.slice(0, pathname.lastIndexOf("add")) + "edit"
        }
        className={`${pathname.includes("edit") ? "cursor-not-allowed" : ""}`}
      >
        <Button
          disabled={pathname.includes("edit")}
          className={` text-white text-center min-w-[100px] px-5 py-2 rounded-lg ${
            pathname.includes("edit")
              ? "bg-green-primary  hover:bg-green-primary "
              : "bg-[#F5F6F8] dark:bg-[#10131D] text-black dark:text-white  hover:bg-green-primary hover:text-white"
          }  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {t("edit")}
        </Button>
      </Link>

      <Link
        aria-disabled={pathname.includes("add") ? "true" : "false"}
        disabled={pathname.includes("add")}
        href={
          pathname.includes("add")
            ? pathname
            : pathname.slice(0, pathname.lastIndexOf("edit")) + "add"
        }
        className={`${pathname.includes("add") ? "cursor-not-allowed" : ""}`}
      >
        <Button
          disabled={pathname.includes("add")}
          className={`text-white  text-center min-w-[100px]  px-5 py-2 rounded-lg ${
            pathname.includes("add")
              ? "bg-green-primary cursor-not-allowed hover:bg-green-primary "
              : "bg-[#F5F6F8]  dark:bg-[#10131D] text-black dark:text-white cursor-pointer hover:bg-green-primary hover:text-white"
          }  disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {t("add new")}
        </Button>
      </Link>
    </div>
  );
}

export default LinksButtons;

"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

function BackPage() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("topNav");

  function GetTitlePage(pathname) {
    const arr = pathname.split("/");
    if (arr.length < 3) return "";
    return arr[2].split("-").join(" ");
  }

  if (pathname === "/" || pathname === "/dashboard") return null;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleBack}
        className="bg-green-primary/10 hover:bg-green-primary/20 dark:bg-green-primary/15 dark:hover:bg-green-primary/25 cursor-pointer size-9 rounded-full flex justify-center items-center transition-all duration-200 hover:scale-105 group"
      >
        <ArrowLeft className="size-4 text-green-primary dark:text-green-primary group-hover:text-green-primary rtl:rotate-180 transition-colors" />
      </Button>

      <p className="capitalize text-sm md:text-base font-medium hidden md:block text-foreground">
        {t(GetTitlePage(pathname))}
      </p>
    </div>
  );
}

export default BackPage;

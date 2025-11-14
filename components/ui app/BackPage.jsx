"use client";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

function BackPage() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("topNav");

  function GetTitlePage(pathname) {
    const arr = pathname.split("/");

    return arr[2].split("-").join(" ");
  }
  if (pathname === "/" || pathname === "/dashboard") return null;
  return (
    <div className="flex items-center gap-3">
      {/* <Link href={pathname.split("/").slice(0, 3).join("/")}> */}
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-green-primary/10 dark:bg-[linear-gradient(180deg,rgba(58,70,157,0.1)_0%,rgba(40,149,70,0.1)_100%)] cursor-pointer size-9 rounded-full flex justify-center items-center backdrop-blur-2xl "
      >
        <ArrowLeft className="text-green-primary dark:text-white rtl:rotate-180" />
      </Button>
      {/* </Link> */}

      <p className="capitalize text-lg font-normal text-green-primary dark:text-white">
        {t(GetTitlePage(pathname))}
      </p>
    </div>
  );
}

export default BackPage;

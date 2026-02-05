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

  // Get smart parent path
  function getParentPath(path) {
    const segments = path.split("/").filter(Boolean);

    // If we're at dashboard level or less, return dashboard
    if (segments.length <= 1) {
      return "/dashboard";
    }

    // Common patterns: view/[id], edit/[id], add, create
    // If last segment looks like an ID or we're in view/edit/add paths, go to management page
    const lastSegment = segments[segments.length - 1];
    const secondLastSegment = segments[segments.length - 2];

    // Check if last segment is a MongoDB ObjectId or UUID (dynamic id)
    const isIdPattern = /^[a-f0-9]{24}$|^[a-f0-9-]{36}$|^\d+$/.test(lastSegment);

    // If we're on /view/[id] or /edit/[id], go back to the management page (skip 2 levels)
    if (isIdPattern && ["view", "edit", "details"].includes(secondLastSegment)) {
      // Remove both the id and view/edit
      segments.pop(); // remove id
      segments.pop(); // remove view/edit
      return "/" + segments.join("/");
    }

    // If we're on /view or /edit or /add (without id), go to management page
    if (["view", "edit", "add", "create", "new"].includes(lastSegment)) {
      segments.pop();
      return "/" + segments.join("/");
    }

    // If last segment is an ID directly (like /tournaments-management/[id])
    if (isIdPattern) {
      segments.pop();
      return "/" + segments.join("/");
    }

    // Default: go up one level
    segments.pop();
    return "/" + segments.join("/");
  }

  // Hide on home and dashboard pages (with or without locale)
  if (pathname === "/" || pathname === "/dashboard" || pathname.endsWith("/dashboard")) return null;

  const handleBack = () => {
    const parentPath = getParentPath(pathname);
    router.push(parentPath);
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleBack}
        className="bg-gray-100 hover:bg-gray-200 dark:bg-green-primary/10 dark:hover:bg-green-primary/20 cursor-pointer size-9 rounded-full flex justify-center items-center transition-all duration-200 hover:scale-105 group shadow-sm border border-gray-200 dark:border-transparent"
      >
        <ArrowLeft className="size-4 text-gray-700 dark:text-green-primary group-hover:text-gray-900 dark:group-hover:text-green-primary rtl:rotate-180 transition-colors" />
      </Button>

      <p className="capitalize text-sm md:text-base font-medium hidden md:block text-gray-800 dark:text-white">
        {t(GetTitlePage(pathname))}
      </p>
    </div>
  );
}

export default BackPage;

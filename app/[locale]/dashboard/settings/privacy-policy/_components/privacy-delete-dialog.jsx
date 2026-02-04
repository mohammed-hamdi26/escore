"use client";
import { deletePrivacyContent } from "@/app/[locale]/_Lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import toast from "react-hot-toast";

function PrivacyDeleteDialog({
  languageCode,
  contentCache,
  setHasPrivacy,
  setContent,
}) {
  const t = useTranslations("PrivacyPage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deletePrivacyContent(languageCode);
      setContent("");
      contentCache.delete(languageCode);
      setHasPrivacy(false);
      toast.success(t("Content deleted successfully"));
      setOpen(false);
    } catch (error) {
      toast.error(error.message || t("Failed to delete content"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="bg-white dark:bg-[#0F1017] border-gray-200 dark:border-gray-800"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10">
              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <AlertDialogTitle className="text-gray-900 dark:text-white">
                {t("Delete confirmation title")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 dark:text-[#677185] mt-1">
                {t("Delete confirmation description")}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter
          className={`border-t border-gray-200 dark:border-gray-800 pt-4 mt-2 ${
            isRTL ? "flex-row-reverse gap-2" : ""
          }`}
        >
          <AlertDialogCancel
            disabled={isLoading}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <Spinner className={`size-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            ) : null}
            {isLoading ? t("Deleting") : t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PrivacyDeleteDialog;

"use client";
import { deleteTheme } from "@/app/[locale]/_Lib/actions";
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
import { useLocale } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

function ThemeDeleteDialog({ theme_id, onDelete, t }) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await deleteTheme(theme_id);
      onDelete(theme_id);
      toast.success(t("Theme deleted successfully"));
      setOpen(false);
    } catch (error) {
      toast.error(error.message || t("Failed to delete theme"));
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
          className="text-gray-500 dark:text-[#677185] hover:text-red-500 hover:bg-red-500/10"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="bg-white dark:bg-[#0F1017] border-gray-200 dark:border-gray-800"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <AlertDialogTitle className="text-gray-900 dark:text-white">
                {t("DialogDeleteTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 dark:text-[#677185] mt-1">
                {t("DialogDeleteDescription")}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className={`border-t border-gray-200 dark:border-gray-800 pt-4 mt-2 ${isRTL ? "flex-row-reverse gap-2" : ""}`}>
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
            {isLoading ? <Spinner className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} /> : null}
            {t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ThemeDeleteDialog;

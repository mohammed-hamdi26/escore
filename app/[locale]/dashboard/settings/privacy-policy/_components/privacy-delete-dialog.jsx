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
import { Trash, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

function PrivacyDeleteDialog({
  languageCode,
  contentCache,
  setHasPrivacy,
  setContent,
}) {
  const t = useTranslations("PrivacyPage");
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
    } catch (error) {
      toast.error(error.message || t("Failed to delete content"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          disabled={isLoading}
          className="p-2 hover:bg-gray-100 rounded transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          title={t("Delete Content")}
        >
          <Trash size={18} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-destructive size-6" />
          </div>
          <AlertDialogTitle>
            {t("Delete confirmation title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {t("Delete confirmation description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white"
          >
            {isLoading ? t("Deleting") : t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PrivacyDeleteDialog;

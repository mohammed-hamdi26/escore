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
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
function ThemeDeleteDialog({ theme_id, onDelete, t }) {
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
          className="rounded-full min-w-[100px] bg-[#3a469d] hover:bg-[#4656bf] text-amber-50 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : t("Delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-destructive size-6" />
          </div>
          <AlertDialogTitle>{t("DialogDeleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {t("DialogDeleteDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white"
          >
            {isLoading ? <Spinner /> : t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ThemeDeleteDialog;

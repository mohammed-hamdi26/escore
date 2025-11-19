"use client";
import { deleteAboutContent } from '@/app/[locale]/_Lib/aboutAPI';
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
import toast from "react-hot-toast";
function AboutDeleteDialog({ languageCode,contentCache, setHasAbout,setContent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteAboutContent(languageCode);
      setContent("");
      contentCache.delete(languageCode);
      setHasAbout(false);
      toast.success("Privacy content deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete content");
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
          title="Delete Content"
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
            Are you absolutely sure you want to delete this About page content?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete the
            about page content and remove it from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AboutDeleteDialog

"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Link2 } from "lucide-react";
import { useLocale } from "next-intl";
import LinkForm from "./LinkForm";

function DialogLinks({ t, trigger, dialogTitle, link, onSuccess }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const isEditing = !!link;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0F1017] border-gray-200 dark:border-gray-800"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5">
              <Link2 className="w-5 h-5 text-green-primary" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <DialogTitle className="text-gray-900 dark:text-white">
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-[#677185]">
                {isEditing
                  ? t("Update the social link information")
                  : t("Add a new social media link to your app")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <LinkForm
          setOpen={setOpen}
          t={t}
          link={link}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

export default DialogLinks;

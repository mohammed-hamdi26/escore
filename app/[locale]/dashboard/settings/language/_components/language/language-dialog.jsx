"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import LanguageForm from "./language-form";

export default function LanguageDialog({
  trigger,
  formType,
  setLanguagesTable,
  languageOptions = undefined,
  onSuccess,
  t,
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";

  const dialogTitle =
    formType === "add" ? t("Add new language") : t("Edit Language");
  const dialogDescription =
    formType === "add" ? t("DialogAddDescription") : t("DialogEditDescription");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0F1017] border-gray-200 dark:border-gray-800"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5">
              <Globe className="w-5 h-5 text-green-primary" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <DialogTitle className="text-gray-900 dark:text-white">
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-[#677185]">
                {dialogDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <LanguageForm
          t={t}
          formType={formType}
          successMessage={
            formType === "add"
              ? t("Language added successfully")
              : t("Language updated successfully")
          }
          setLanguagesTable={setLanguagesTable}
          onSuccess={onSuccess}
          setOpen={setOpen}
          languageOptions={languageOptions}
        />
      </DialogContent>
    </Dialog>
  );
}

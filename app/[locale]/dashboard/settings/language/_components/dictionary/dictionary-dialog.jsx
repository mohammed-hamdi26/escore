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
import { BookOpen, PenLine } from "lucide-react";
import { useLocale } from "next-intl";
import DictionaryForm from "./dictionary-form";

function DictionaryDialog({
  trigger,
  formType,
  languageCode,
  word = undefined,
  translation = undefined,
  setDictionary,
  t,
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const isEditing = formType === "edit";
  const dialogTitle = isEditing ? `${t("Edit")} : ${word}` : t("DialogAddTitle");
  const dialogDescription = isEditing
    ? t("DialogEditDescription")
    : t("DialogAddDescription");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0F1017] border-gray-200 dark:border-gray-800"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isEditing
                ? "bg-gradient-to-br from-blue-500/20 to-blue-500/5"
                : "bg-gradient-to-br from-green-primary/20 to-green-primary/5"
            }`}>
              {isEditing ? (
                <PenLine className="w-5 h-5 text-blue-500" />
              ) : (
                <BookOpen className="w-5 h-5 text-green-primary" />
              )}
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
        <DictionaryForm
          t={t}
          formType={formType}
          code={languageCode}
          initialWord={word}
          initialTranslation={translation}
          successMessage={
            formType === "add"
              ? t("Word added successfully")
              : t("Word translation updated successfully")
          }
          setOpen={setOpen}
          setDictionary={setDictionary}
        />
      </DialogContent>
    </Dialog>
  );
}

export default DictionaryDialog;

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
  const dialogTitle =
    formType === "add" ? t("DialogAddTitle") : `${t("Edit")} : ${word}`;
  const dialogDescription =
    formType === "add" ? t("DialogAddDescription") : t("DialogEditDescription");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
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

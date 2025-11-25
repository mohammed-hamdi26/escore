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
import LanguageForm from "./language-form";

export default function LanguageDialog({
  trigger,
  formType,
  setLanguagesTable,
  languageOptions = undefined,
  t,
}) {
  const [open, setOpen] = useState(false);

  const dialogTitle =
    formType === "add" ? t("Add new language") : t("Edit Language");
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
        <LanguageForm
          t={t}
          formType={formType}
          successMessage={
            formType === "add"
              ? t("Language added successfully")
              : t("Language updated successfully")
          }
          setLanguagesTable={setLanguagesTable}
          setOpen={setOpen}
          languageOptions={languageOptions}
        />
      </DialogContent>
    </Dialog>
  );
}

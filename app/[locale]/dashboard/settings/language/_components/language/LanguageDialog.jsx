"use client";

import { getSpecificLanguage } from "@/app/[locale]/_Lib/languageAPI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import LanguageForm from "./LanguageForm";

export default function LanguageDialog({
  trigger,
  formType = "add",
  setLanguagesTable,
  languageOptions=undefined
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dialogTitle = formType === "add" ? "Add New Language" : "Edit Language";
  const dialogDescription =
    formType === "add"
      ? "Add a new language to the system. Fill in all the required fields."
      : "Update the language information. Modify the fields as needed.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading language data...</p>
          </div>
        ) : (
          <LanguageForm
            formType={formType}
            successMessage={
              formType === "add"
                ? "Language added successfully"
                : "Language updated successfully"
            }
            setLanguagesTable={setLanguagesTable}
            setOpen={setOpen}
            languageOptions={languageOptions}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

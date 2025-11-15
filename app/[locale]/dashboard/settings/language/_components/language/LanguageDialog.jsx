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
  languageCode = undefined,
  onSuccess,
}) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(undefined);
  const [loading, setLoading] = useState(false);

  // Fetch language data when dialog opens for edit mode
  useEffect(() => {
    if (open && formType === "update" && languageCode) {
      setLoading(true);
      getSpecificLanguage(languageCode)
        .then(response => {
          const lang = response?.data || response;
          setLanguage(lang);
        })
        .catch(error => {
          console.error("Failed to fetch language:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && formType === "add") {
      // Reset language for add mode
      setLanguage(undefined);
    }
  }, [open, formType, languageCode]);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

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
            language={language}
            code={languageCode}
            successMessage={
              formType === "add"
                ? "Language added successfully"
                : "Language updated successfully"
            }
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

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
  setDictionary
}) {
  const [open, setOpen] = useState(false);
  const dialogTitle = formType === "add" ? "Add New word" : `Edit: ${word}`;
  const dialogDescription =
    formType === "add"
      ? "Add a new word to the system. Fill in all the required fields."
      : "Update the word translation. Modify the fields as needed.";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DictionaryForm
            formType={formType}
            code={languageCode}
            initialWord={word}
            initialTranslation={translation}
            successMessage={
              formType === "add"
                ? "Word added successfully"
                : "Word translation updated successfully"
            }
            setOpen={setOpen}
            setDictionary={setDictionary}
          />
      </DialogContent>
    </Dialog>
  );
}

export default DictionaryDialog;

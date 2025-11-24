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
import ThemeForm from "./theme-form";
function ThemeDialog({
  trigger,
  formType = "add",
  setThemes,
  currentTheme,
  t,
}) {
  const [open, setOpen] = useState(false);

  const dialogTitle =
    formType === "add" ? t("Add New theme") : t("DialogEditTitle");
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
        <ThemeForm
          t={t}
          sucessMessage={
            formType === "add"
              ? t("Theme added successfully")
              : t("Theme updated successfully")
          }
          formType={formType}
          setThemes={setThemes}
          setOpen={setOpen}
          currentTheme={currentTheme}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ThemeDialog;

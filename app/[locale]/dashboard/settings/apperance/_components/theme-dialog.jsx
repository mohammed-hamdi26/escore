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
import ThemeForm from './theme-form';
function ThemeDialog({
  trigger,
  formType = "add",
  setThemes,
  currentTheme
}) {
  const [open,setOpen] = useState(false);

  const dialogTitle = formType === "add" ? "Add New theme" : "Edit theme";
  const dialogDescription =
    formType === "add"
      ? "Add a new theme to the system. Fill in all the required fields."
      : "Update the theme color. Modify the fields as needed.";
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <ThemeForm sucessMessage={formType === "add" ? "Theme added successfully" : "Theme updated successfully" } formType={formType} setThemes={setThemes} setOpen={setOpen} currentTheme={currentTheme}/>
      </DialogContent>
    </Dialog>
  )
}

export default ThemeDialog

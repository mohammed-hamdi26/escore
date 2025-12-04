"use client";
import { cloneElement, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function EditDialog({ idUser, t, trigger, contentDialog, title }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {cloneElement(contentDialog, { setOpen })}
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
